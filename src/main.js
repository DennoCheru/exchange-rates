import { MockExchangeRateService } from './services/MockExchangeRateService.js';
import { CurrencyConverter } from './models/CurrencyConverter.js';
import { ConverterView } from './ui/ConverterView.js';
import { ConverterApp  } from './app/ConverterApp.js';
import { CachedExchangeRateService } from './services/CachedExchangeRateService.js';
import { ExchangeRateService } from './services/ExchangeRateServices.js';

const USE_MOCK = true;

if (USE_MOCK) {
    document.getElementById('demo-note').hidden = false;
}

async function createService() {
    if (USE_MOCK) {
        return new MockExchangeRateService();
    }
    const { API_KEY } = await import ('./config.js');
    return new CachedExchangeRateService({ service: new ExchangeRateService(API_KEY) });
}

const app = new ConverterApp({
    service: new CachedExchangeRateService({ service: new MockExchangeRateService() }),
    converter: new CurrencyConverter(),
    view: new ConverterView(document),
});

app.init();