import puppeteer from 'puppeteer';

/**
 * Inicializar el navegador.
*/
export const launchBrowser = async (visualizar) => {
    return await puppeteer.launch({
        headless: visualizar, // True si no se quiere visualizar el navegador
        defaultViewport: null
    });
}
