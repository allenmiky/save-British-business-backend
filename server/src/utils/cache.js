class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 60 * 1000) {
    this.cache.set(key, { value, expiry: Date.now() + ttl });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    return cached.value;
  }
}

export default new SimpleCache();
