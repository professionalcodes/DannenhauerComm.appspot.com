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

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session(backend='datastore')

class HomePage(MainHandler):
    def get(self):
        try:
            self.render("index.html")
        except Exception as e:
            self.write(str(e))  

class Profile(MainHandler):
    def get(self):
        self.render("profile.html")

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

class TermsOfServiceTwitter(MainHandler):
    def get(self):
        self.write("terms of service")

class PrivacyPolicyTwitter(MainHandler):
    def get(self):
        self.write("private policy")

class AuthHandler(MainHandler):
    def get(self):
        logging.info(self.request)
        self.redirect('/profile')

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
    ('/import_token', StripeApi),
    ('/privacy-policy-twitter', PrivacyPolicyTwitter),
    ('/terms-of-service-twitter', TermsOfServiceTwitter),
    ('/_/auth/handler', AuthHandler)

], config=config, debug=True)
        