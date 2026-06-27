import NodeCache from "node-cache";

// Default cache TTL is 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    if (req.method !== "GET" || req.originalUrl.includes('/auth') || req.originalUrl.includes('/admin')) {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    } else {
      const originalSend = res.json;
      res.json = function(body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(key, body, duration);
        }
        originalSend.call(this, body);
      };
      next();
    }
  };
};

export const clearCachePrefix = (prefix) => {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  });
};
