#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import stripe
import webapp2
import jinja2
import os
import logging
import json
import the_endpoint
from dd_utils                       import *
from models.models                  import User
from google.appengine.api           import images, users
from webapp2_extras                 import sessions, auth, security

stripe.api_key = "sk_test_2SesnVyk4RA3wK2NabaftD4D"
template_dir = os.path.join(os.path.dirname(__file__), 'jinja_templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape = True)

class MainHandler(webapp2.RequestHandler):
    def write(self, *args, **kwargs):
        self.response.out.write(*args, **kwargs)
        
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kwargs):
        self.write(self.render_str(template, **kwargs))

    def dispatch(self):
        self.session_store = sessions.get_store(request=self.request)
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    def handle_login_request(self, un, pw):
        try:
            user = self.auth.get_user_by_password(un, pw, remember=True)
            return True
        except Exception as e:
            logging.info('login failed for user %s' % un)
            return False

    def handle_logout_request(self):
        try:
            self.auth.unset_session()
            return True
        except Exception as e:
            logging.info(str(e))
            return False

    def get_signup_data(self):
        return (
            self.request.get('username'),
            self.request.get('email'),
            self.request.get('password')
        )

    def get_login_data(self):
        return (
            self.request.get("username"),
            self.request.get("password")
        )

    def get_user_userid_token(self, user_data):
        user = user_data[1]
        user_id = user.get_id()
        token = self.user_model.create_signup_token(user_id)
        return (
            user,
            user_id,
            token
        )

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session(backend='datastore')

    @webapp2.cached_property
    def auth(self):
        return auth.get_auth()

    @webapp2.cached_property
    def user_info(self):
        return self.auth.get_user_by_session()

    @webapp2.cached_property
    def user(self):
        usr_info = self.user_info
        return self.user_model.get_by_id(usr_info['user_id']) if usr_info else None

    @webapp2.cached_property
    def username(self):
        return self.user.auth_ids[0]

    @webapp2.cached_property
    def user_model(self):
        return self.auth.store.user_model

class HomePage(MainHandler):
    def get(self):
        try:
            if not self.user:
                self.render("index.html")
            else:
                self.redirect("/profile")   
        except Exception as e:
            logging.error(str(e))

class LoginHandler(MainHandler):
    def post(self):
        try:
            username, passwd = self.get_login_data(self)
            logged_in_success = self.handle_login_request(username, passwd)
            self.redirect("/profile")
        except Exception as e:
            logging.info(str(e))

class LogoutHandler(MainHandler):
    def get(self):
        try:
            if self.user:
                log_out_success = self.handle_logout_request()
                if log_out_success:
                    self.redirect("/")
                else:
                    self.write("An error was encountered while trying to log you out")
        except Exception as e:
            logging.error(str(e))  

class Signup(MainHandler):
    def post(self):
        try:
            if self.user:
                self.redirect("/profile")
            elif not self.user: 
                user_name, email, password = self.get_signup_data()
                unique_properties = ['email_address']
                user_data = self.user_model.create_user(user_name, unique_properties, email_address=email, password_raw=password, verified=False)

                if not user_data[0]:
                    return self.render("/#/signup", error="Unable to complete request")
            
                user, user_id, token = self.get_user_userid_token(user_data)
                verification_url = self.uri_for('verification', type='v', user_id=user_id, signup_token=token, _full=True)
                logging.info(verification_url)
                return self.redirect("/profile")
        except Exception as e:
            logging.info(str(e))
            self.write(str(e))

class Profile(MainHandler):
    def get(self):
        self.render("profile.html")

class AdminHandler(MainHandler):
    def get(self):
        try:
            admin_user = users.is_current_user_admin()
            if admin_user:
                # photo_upload_url = blobstore.create_upload_url('/')
                # self.render("admin.html", upload_url=photo_upload_url)
                self.render("admin.html")
            else:
                self.redirect("/#/login") 
        except Exception as e:
            self.write("the request could not be processed")

class StripeApi(MainHandler):
    def post(self):
        token = self.request.get("token")
        logging.info("token: %s" % token)
        try:
            charge = stripe.Charge.create(
                amount=1000, # Amount in cents
                currency="usd",
                source=token,
                description="Example charge")

            logging.info(type(charge))
        except stripe.error.CardError as e:
            logging.error(str(e))


class CheckUser(MainHandler):
    def post(self):
        try:
            username = self.request.get("username")
            exists = User.get_by_auth_id(username)
            obj = {"exists": bool(exists)}
            self.write(json.dumps(obj))
        except Exception as e:
            self.write("Something went wrong")
            logging.info(str(e))

class CheckEmail(MainHandler):
    def post(self):
        try:
            email = self.request.get("email")
            exists = User.email_exists(email)
            self.write(json.dumps({"exists": bool(exists)}))
        except Exception as e:
            logging.error(str(e))

class VerificationHandler(MainHandler):
    def get(self, *args, **kwargs):
        user = None
        user_id = kwargs['user_id']
        signup_token = kwargs['signup_token']
        verification_type = kwargs['type']
        user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
        'signup')
 
        if not user:
            logging.info('Could not find any user with id "%s" signup token "%s"',
            user_id, signup_token)
            self.abort(404)
        
        self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)
 
        if verification_type == 'v':
            self.user_model.delete_signup_token(user.get_id(), signup_token)
 
            if not user.verified:
                user.verified = True
                user.put()
 
            logging.info("user email address has been verified")
            return

        elif verification_type == 'p':
            # params = {
            #     'user': user,
            #     'token': signup_token
            # }
            # self.render_template('resetpassword.html', params)
            parms = {'user': user, 'token': signup_token}
            self.write(json.dumps({"allow_password_reset": True, 'data': parms}))
        else:
            logging.info('verification type not supported')
            self.abort(404)

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'q9m6USBZWRhoJY5R7uGTJOCWUm5WQpnU6jZU5Ta9eyvE5BEEbW5C2eSwLFMCysrYPK3dcGFAFH6SPyk2FQBHNKAv',
    'backends': {'datastore': 'webapp2_extras.appengine.sessions_ndb.DatastoreSessionFactory',
                 'memcache': 'webapp2_extras.appengine.sessions_memcache.MemcacheSessionFactory',
                 'securecookie': 'webapp2_extras.sessions.SecureCookieSessionFactory'}
}
config['webapp2_extras.auth'] = {
    'user_model': 'models.models.User',
    'user_attributes': []
}

app = webapp2.WSGIApplication([
    ('/', HomePage),
    ('/log_user_in', LoginHandler),
    ('/signup', Signup),
    ('/logout', LogoutHandler),
    ('/check_username_exists', CheckUser),
    ('/check_email_exists', CheckEmail),
    ('/import_token', StripeApi),
    ('/root', AdminHandler),
    webapp2.Route('/<type:v|p>/<user_id:\d+>-<signup_token:.+>',
  handler=VerificationHandler, name='verification')

], config=config, debug=True)
        