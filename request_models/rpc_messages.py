from protorpc import messages

class Text(messages.Message):
	txt = messages.StringField(1)

class SignupFormObject(messages.Message):
    username = messages.StringField(1)
    password = messages.StringField(2)
    email    = messages.StringField(3)

class SignupResponse(messages.Message):
    key = messages.StringField(1)
    success = messages.StringField(2)

class Url(messages.Message):
    url = messages.StringField(1)

class UrlList(messages.Message):
    urls = messages.MessageField(Url, 1, repeated=True)

# class User(messages.Message):
    
# class UserSignupData(messages.Message):
#     account_name = messages.StringField(1, required=True)
#     email        = messages.StringField(2, required=True)
#     password     = messages.StringField(3, required=True)
#     phone        = messages.StringField(4)
#     employer     = messages.StringField(5)

# class UserSignupResponse(messages.Message):
#     user_stored = messages.IntegerField(1, required=True)
#     error_msg   = messages.StringField(2)

# class UserLoginData(messages.Message):
#     account_name = messages.StringField(1, required=True)
#     password     = messages.StringField(2, required=True)

# class UserLoginResponse(messages.Message):
#     successful  = messages.IntegerField(1, required=True)
#     error_msg   = messages.StringField(2)

# class UserEventRequest(messages.Message):
#     event_name         = messages.StringField(1, required=True)
#     event_types        = messages.StringField(2, repeated=True)
#     event_host         = messages.StringField(3, required=True)
#     event_start        = messages.IntegerField(4, required=True)
#     event_end          = messages.IntegerField(5, required=True)
#     event_guestlist    = messages.StringField(6, repeated=True)
#     event_guestmessage = messages.StringField(7)
#     event_address      = messages.StringField(8, required=True)


# class UserEventResponse(messages.Message):
#     successful = messages.StringField(1, required=True)
#     error_msg  = messages.StringField(2)

# class EventsList(messages.Message):
#     events = messages.MessageField(UserEventRequest, 1, repeated=True)

# class UsernameExistsRequest(messages.Message):
#     username = messages.StringField(1, required=True)

# class UsernameExistsResponse(messages.Message):
#     exists = messages.StringField(1, required=True)

# class PasswordMatchRequest(messages.Message):
#     username = messages.StringField(1, required=True)
#     password = messages.StringField(2, required=True)

# class PasswordMatchResponse(messages.Message):
#     match = messages.StringField(1, required=True)
    
    
"""
34:40
In case I wanted to send requests manualy opposed to using gapi.client.apiname.methodname
I could just use the path 
"http://localhost:8080/_ah/api/endpoint_name/v1/path

"""