import asyncio

class AsyncSimpleCache:
    def __init__(self):
        self.cache = {}
        self.lock = asyncio.Lock()

    async def get(self, key):
        async with self.lock:
            return self.cache.get(key)

    async def set(self, key, value):
        async with self.lock:
            self.cache[key] = value

    async def purge_cache(self):
        async with self.lock:
            self.cache.clear()