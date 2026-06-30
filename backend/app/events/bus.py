import asyncio
from typing import Callable, Dict, List, Any
from app.events.schemas import BaseEvent
from app.utils.logger import logger

class EventBus:
    """
    In-memory asynchronous event bus for Phase B.
    In Phase C (LangGraph integration), this can be backed by Redis PubSub or Google Cloud Pub/Sub.
    """
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, handler: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)
        logger.info(f"Subscribed to event: {event_type}")

    async def publish(self, event: BaseEvent):
        handlers = self._subscribers.get(event.event_type, [])
        if not handlers:
            logger.info(f"Event published with no subscribers: {event.event_type}")
            return

        logger.info(f"Publishing event {event.event_type} to {len(handlers)} handlers.")
        # Fire and forget handlers asynchronously
        for handler in handlers:
            asyncio.create_task(self._execute_handler(handler, event))

    async def _execute_handler(self, handler: Callable, event: BaseEvent):
        try:
            if asyncio.iscoroutinefunction(handler):
                await handler(event)
            else:
                handler(event)
        except Exception as e:
            logger.error(f"Error executing handler for event {event.event_type}: {str(e)}", exc_info=True)

# Global event bus instance
event_bus = EventBus()
