import logging
import sys
import contextvars
from typing import Any

# Context variable to hold the current request ID
request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="")

class RequestIDFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get()
        return True

def setup_logger(name: str = "cityos_ai") -> logging.Logger:
    logger = logging.getLogger(name)
    
    # Avoid duplicating logs if setup is called multiple times
    if logger.hasHandlers():
        return logger

    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        '{"time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "request_id": "%(request_id)s", "message": "%(message)s"}'
    )
    handler.setFormatter(formatter)
    handler.addFilter(RequestIDFilter())
    
    logger.addHandler(handler)
    return logger

logger = setup_logger()
