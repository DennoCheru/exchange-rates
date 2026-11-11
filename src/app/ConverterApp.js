export class ConverterApp {
    #service;
    #converter;
    #view;
    #defaults;

    constructor({ service, converter, view, defaults = { from: 'USD', to: 'KES'} }) {
        this.#service = service;
        this.#converter = converter;
        this.#view = view;
        this.#defaults = defaults;
    }

    async init() {
        this.#view.setLoading(true);

        try {
            const [symbols, ratesData] = await Promise.all([
                this.#service.getSymbols(),
                this.#service.getRates(),
            ]);

            this.#converter.setRates(ratesData.rates);
            this.#view.populateCurrencies(this.#onlyWithRates(symbols, ratesData.rates));
            this.#view.setSelection(this.#defaults);
            this.#view.showUpdated(ratesData.date);
            this.#view.onChange(() => this.#handleChange());

            this.#handleChange();
        } catch (error) {
            console.error(error);
            this.#view.showError('Could not road exchange rates. Please try again later.');
        } finally {
            this.#view.setLoading(false);
        }
    }

    #onlyWithRates(symbols, rates) {
        return Object.fromEntries(
            Object.entries(symbols).filter(([code]) => code in rates),
        );
    }

    #handleChange() {
        const {amount, from, to } = this.#view.getFormValues();

        if (Number.isNaN(amount)) {
            this.#view.showError('Please enter an amount.');
            return;
        }

        if (amount < 0) {
            this.#view.showError('Amount cannot be negative.');
            return;
        }

        try {
            const result = this.#converter.convert(amount, from, to);
            const rate = this.#converter.getRate(from, to);
            this.#view.showResult({ amount, from, to, result, rate });
        } catch {
            this.#view.showError(error.message);
        }
    }
}