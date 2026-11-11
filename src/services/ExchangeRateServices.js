export class ExchangeRateService {
    #apiKey;
    #baseURL

    constructor(apiKey, baseUrl = 'https://api.exchangeratesapi.io/v1') {
        if (!apiKey) {
            throw new Error('An API Key is required');
        }

        this.#apiKey = apiKey;
        this.#baseURL = baseUrl;
    }

    async #request(endpoint) {
        const url = new URL(`${this.#baseURL}/${endpoint}`);
        url.searchParams.set('access_key', this.#apiKey);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.success === false) {
            throw new Error(data.error?.info ?? 'The API returned an error');
        }
        return data;
    }

    async getSymbols() {
        const data = await this.#request('symbols');
        return data.symbols;
    }

    async getRates() {
        const { base, date, rates } = await this.#request('latest');
        return { base,date, rates };
    }
}