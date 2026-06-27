import NodeCache from "node-cache";

// Default cache TTL is 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    if (req.method !== "GET") {
      // If it's a mutation (POST, PUT, DELETE), clear cache for this base URL
      if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE" || req.method === "PATCH") {
        const basePath = req.originalUrl.split('?')[0]; // e.g. /api/projects
        clearCachePrefix(basePath);
        // Also clear base paths if it's an ID route (e.g. /api/projects/123 -> clear /api/projects)
        const parts = basePath.split('/');
        if (parts.length > 3) {
          clearCachePrefix(parts.slice(0, 3).join('/')); 
        }
      }
      return next();
    }

    if (req.originalUrl.includes('/auth') || req.originalUrl.includes('/admin')) {
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
