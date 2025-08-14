import { launchBrowser } from '../services/browser.js';

import { config } from '../../config/environments.js';

/**
 * Funcion para ejecutar el flujo de Mercado libre obtener el 
 * mayor y el menor valor de un vehiculo.
 */
export const runMercadoLibreFlow = async (vehiculo) => {
    /**
     * Lanzar el navegador.
     */
    const browser = await launchBrowser(false);

    /**
     * Abrir una pagina nueva.
     */
    const page = await browser.newPage();

    /**
     * Abrir una nueva pagina en el navegador.
     * Navegar a la pagina objetivo.
     */
    await page.goto(`${config.MERCADO_LIBRE_BASE_URL}`, { waitUntil: 'networkidle2' });

    /**
     * Cerrar modal al cargar la pagina.
    */
    await new Promise(resolve => setTimeout(resolve, 1500));
    const closeBtn = await page.waitForSelector('.andes-modal__close-button', { timeout: 5000 });
    await closeBtn.click();

    /**
     * Bucar el vehiculo.
    */
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.waitForSelector('input[name="as_word"]', { visible: true });
    await page.type('input[name="as_word"]', vehiculo);
    await Promise.all([
        page.click('button.nav-search-btn'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    /**
     * Esperar a cargar los resultados.
    */
    await page.waitForSelector('.poly-card__content', { visible: true });

    /**
     * Ordernar de menor a mayor.
    */
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.waitForSelector('.ui-search-sort-filter', { visible: true });
    await page.click('.ui-search-sort-filter');
    await page.waitForSelector('.andes-list__item', { visible: true });
    await page.evaluate(() => {
        const opciones = Array.from(document.querySelectorAll('.andes-list__item'));
        const opcion = opciones.find(el => el.innerText.includes('Menor precio'));
        if (opcion) opcion.click();
    });

    /**
     * Esperar a cargar los resultados.
    */
    await page.waitForSelector('.poly-card__content', { visible: true });
    const lowerPrices = await page.$$eval(
        '.poly-price__current .andes-money-amount__fraction',
        elements => elements.map(el => el.textContent)
    );
    const transformatedlowerPrices = lowerPrices.map(precio => Number(precio.replaceAll('.', '')));
    const lowerPrice = transformatedlowerPrices.sort((a, b) => a - b);

    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.waitForSelector('.ui-search-sort-filter', { visible: true });
    await page.click('.ui-search-sort-filter');
    await page.waitForSelector('.andes-list__item', { visible: true });
    await page.evaluate(() => {
        const opciones = Array.from(document.querySelectorAll('.andes-list__item'));
        const opcion = opciones.find(el => el.innerText.includes('Mayor precio'));
        if (opcion) opcion.click();
    });

    /**
     * Esperar a cargar los resultados.
    */
    await page.waitForSelector('.poly-card__content', { visible: true });
    const higherPrices = await page.$$eval(
        '.poly-price__current .andes-money-amount__fraction',
        elements => elements.map(el => el.textContent)
    );
    const transformatedhigherPrices = higherPrices.map(precio => Number(precio.replaceAll('.', '')));
    const higherPrice = transformatedhigherPrices.sort((a, b) => b - a);

    return [lowerPrice[0] ?? '', higherPrice[0] ?? ''];
}