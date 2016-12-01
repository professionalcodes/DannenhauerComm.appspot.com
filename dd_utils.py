import logging

def is_ajax(headers):
    return headers.get("X-requested-with") and (headers.get("X-requested-with") == "XMLHttpRequest")

def get_cookie(req):
    headers = req.headers
    cookie = headers.get("Cookie")
    logging.info(cookie)
    return cookie

def log_request_data(request):
    logging.info(dir(request))
    logging.info(vars(request))
    logging.info(request.remote_addr)
    logging.info(request.path)
    logging.info(request.url)


