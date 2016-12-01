from google.appengine.ext import ndb
import logging
import webapp2_extras.appengine.auth.models as webappModel
from webapp2_extras import security

class User(webappModel.User):
    
    def set_password(self, raw_password):
        self.password = security.generate_password_hash(raw_password, length=12)
 
    @classmethod
    def get_by_auth_token(cls, user_id, token, subject='auth'):
        token_key = cls.token_model.get_key(user_id, subject, token)
        user_key = ndb.Key(cls, user_id)
        valid_token, user = ndb.get_multi([token_key, user_key])
        if valid_token and user:
            timestamp = int(time.mktime(valid_token.created.timetuple()))
            return user, timestamp
        return None, None

    @classmethod 
    def by_email(cls, email):
        k = ndb.Key(cls.unique_model, 'User.email_address:%s' % email)
        return k.get()

    @classmethod
    def email_exists(cls, email):
        return cls.by_email(email) != None
        
    @classmethod
    def retrieve_all_authids(cls):
        users = cls.query()
        for user in users:
            logging.info(user.auth_ids)







        