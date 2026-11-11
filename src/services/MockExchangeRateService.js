import { mockSymbols, mockRates} from '../data/mock-data.js';

export class MockExchangeRateService {
    #delayMs;

    constructor(delayMs = 500) {
        this.#delayMs = delayMs;
    }
    
    #wait() {
        return new Promise((resolve) => setTimeout(resolve, this.#delayMs));
    }
    async getSymbols() {
        await this.#wait();
        return { ...mockSymbols.symbols };
    }

    async getRates() {
        await this.#wait();
        const { base, date, rates } = mockRates;
        return { base, date, rates: { ...rates } };
    }
}