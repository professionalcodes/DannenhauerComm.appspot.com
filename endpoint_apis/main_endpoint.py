from models.models                      import *
from request_models.rpc_messages        import *
from protorpc                           import remote, message_types
from settings                           import WEB_CLIENT_ID
from google.appengine.api               import urlfetch
import logging
import endpoints
import os

# EMAIL_SCOPE = endpoints.EMAIL_SCOPE
# API_EXPLORER_CLIENT_ID = endpoints.API_EXPLORER_CLIENT_ID

# @endpoints.api(name="main_endpoint", version="v1", allowed_client_ids=[WEB_CLIENT_ID, API_EXPLORER_CLIENT_ID], scopes=[EMAIL_SCOPE], description="Endpoint for a background job on updating train locations")
# class MainEndpoint(remote.Service):

#     @endpoints.method(Text, Text, path="test_main_endpoint", http_method="post", name="test_main_endpoint")
#     def test(self, text_object):
#         return Text(txt=text_object.txt)

# @endpoints.api(name="signup_endpoint", version="v1", allowed_client_ids=[WEB_CLIENT_ID, API_EXPLORER_CLIENT_ID], scopes=[EMAIL_SCOPE], description="")
# class SignupEndpoint(remote.Service):

#     @endpoints.method(SignupFormObject, SignupResponse, path="signup", http_method="post", name="signup")
#     def signup(self, data):
#         logging.info(data)
#         user, key = User.store_user(data.username, data.password, data.email)
#         return SignupResponse(key=str(key.id()), success="true")

#     @endpoints.method(Text, Text, path="check_username", http_method="post", name="check_username_exists")
#     def check_username(self, data):
#         if User.exists(data.txt):
#             return Text(txt="true")
#         return Text(txt="false")




        



