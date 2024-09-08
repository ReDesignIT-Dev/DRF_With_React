import logging

logger = logging.getLogger(__name__)


class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log the request details
        logger.info(f"Request from: {request.META.get('HTTP_ORIGIN')}")
        logger.info(f"Request URL: {request.build_absolute_uri()}")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Request Headers: {request.headers}")
        response = self.get_response(request)
        return response
