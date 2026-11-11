const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export class CachedExchangeRateService {
    #service;
    #storage;
    #ttl;
    #now;
    #prefix;

    constructor({
        service,
        storage = globalThis.localStorage,
        ttl = { symbols: 7 * DAY, rates: DAY },
        now = () => Date.now(),
        prefix = 'fx',
    }) {
        this.#service = service;
        this.#storage = storage,
        this.#ttl = ttl,
        this.#now = now,
        this.#prefix = prefix;
    }

    #read(key) {
        try {
            const raw = this.#storage.getItem(`${this.#prefix}: ${key}`);
            if (!raw) return null;

            const entry = JSON.parse(raw);
            return typeof entry?.savedAt === 'number' && 'data' in entry ? entry: null;
        } catch {
            return null;
        }
    }

    #write(key, data) {
        try {
            const entry = { savedAt: this.#now(), data };
            this.#storage.setItem(`${this.#prefix}: ${key}`, JSON.stringify(entry));
        } catch {
            // Storage full or blocked: carry on without caching.
        }
    }

    async #cached(key, fetcher) {
        const entry = this.#read(key);
        const isFresh = entry && this.#now() - entry.savedAt < this.#ttl[key];

        if (isFresh) return entry.data;

        try {
            const data = await fetcher();
            this.#write(key, data);
            return data;
        } catch (error) {
            if (entry) return entry.data; //stale, but better than nothing.
            throw error;
        }
    }

    getSymbols() {
        return this.#cached('symbols', () => this.#service.getSymbols());
    }

    getRates() {
        return this.#cached('rates', () => this.#service.getRates());
    }
}