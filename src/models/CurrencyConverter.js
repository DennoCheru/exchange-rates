export class CurrencyConverter {
  #rates = {};

  setRates(rates) {
    this.#rates = {...rates};
  }

  #getRateFor(code) {
    const rate = this.#rates[code];

    if (rate === undefined) {
      throw new Error (`No rate available for "${code}"`);
    }
    return rate;
  }

  getRate(from, to) {
    return this.#getRateFor(to) / this.#getRateFor(from);
  }

  convert(amount, from, to) {
  return amount * this.getRate(from, to);
 }

}