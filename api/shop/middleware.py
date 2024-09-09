import logging

logger = logging.getLogger(__name__)


class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log the request details
        logger.info(f"Request from: {request.META.get('HTTP_ORIGIN')}\n")
        logger.info(f"Request URL: {request.build_absolute_uri()}\n")
        logger.info(f"Request Method: {request.method}\n")
        logger.info(f"Request Headers: {request.headers}\n")
        response = self.get_response(request)
        return response
