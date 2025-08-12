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
    const browser = await launchBrowser(true);

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
     * Obtener los precios y ordenar array de menor a mayor.
    */
    const precios = await page.$$eval(
        '.poly-price__current .andes-money-amount__fraction',
        elements => elements.map(el => el.textContent)
    );

    /**
     * Retornar el precio mayor y el precio menor encontrado.
    */
    if (precios.length > 0) {
        const transformatedPrices = precios.map(precio => Number(precio.replaceAll('.', '')));
        transformatedPrices.sort((a, b) => a - b);
        return [transformatedPrices[0], transformatedPrices[transformatedPrices.length - 1]];
    } else {
        return [];
    }
}