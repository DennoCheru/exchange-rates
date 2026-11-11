export class ConverterView {
    #root;
    #amount;
    #from;
    #to;
    #swap;
    #result;
    #rate;
    #updated;
    #error;
    #status

    constructor(root) {
        this.#root = root;
        this.#amount = this.#get('amount');
        this.#from = this.#get('from');
        this.#to = this.#get('to');
        this.#swap = this.#get('swap');
        this.#result = this.#get('result');
        this.#rate = this.#get('rate');
        this.#updated = this.#get('updated');
        this.#error = this.#get('error');
        this.#status = this.#get('status');

    }

    #get(id) {
        const element = this.#root.getElementById(id);
        if (!element) {
            throw new Error(`Element #${id} not found in the page`);
        }
        return element;
    }

    #format(value, maxFractionDigits = 2) {
        const options = 
            value !==0 && Math.abs(value) < 0.01
            ? { maximumSignificantDigits : 4}
            : { maximumFractionDigits: maxFractionDigits };
        return new Intl.NumberFormat(undefined, options).format(value);
    }

    populateCurrencies(symbols) {
        for (const select of [this.#from, this.#to]) {
            select.replaceChildren();

            for (const [code, name] of Object.entries(symbols)) {
                const option = this.#root.createElement('option');
                option.value = code;
                option.textContent = `${code} - ${name}`;
                select.append(option);
            }
        }
    }

    setSelection({from, to}) {
        this.#from.value = from;
        this.#to.value = to;
    }

    getFormValues() {
        return {
            amount: this.#amount.valueAsNumber,
            from: this.#from.value,
            to: this.#to.value,
        };
    }
    
    onChange(handler) {
        const notify = () => handler();

        this.#amount.addEventListener('input', notify);
        this.#from.addEventListener('change', notify);
        this.#to.addEventListener('change', notify);

        this.#swap.addEventListener('click', () => {
            [this.#from.value, this.#to.value] = [this.#to.value, this.#from.value];
            notify();
        });
    }

    showResult({ amount, from, to, result, rate}) {
        this.#error.textContent = '';
        this.#result.textContent = `${this.#format(amount)} ${from} = ${this.#format(result)} ${to}`;
        this.#rate.textContent = `1 ${from} = ${this.#format(rate, 4)} ${to}`;
    }

    showUpdated(date) {
        this.#updated.textContent = `Rates updated: ${date}`;
    }

    showError(message) {
        this.#result.textContent = '';
        this.#rate.textContent = '';
        this.#error.textContent = message;
    }

    setLoading(isLoading) {
        for (const control of [this.#amount, this.#from, this.#to, this.#swap]) {
            control.disabled = isLoading;
        }
        this.#status.textContent = isLoading ? 'Loading rates...' : '';
    }
}