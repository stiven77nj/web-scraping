import { launchBrowser } from '../services/browser.js';

import { config } from '../../config/environments.js';
import { sendCaptchaToWebhook } from '../utils/sendCaptchaToWebhook.js';

/**
 * Funcion para ejecutar el flujo de CRM para exportar el reporte de prospectos,
 * clientes y demas.
 */
export const runCrmFlow = async () => {
    /**
     * 
     */
    const browser = await launchBrowser(false);

    /**
     * 
     */
    const page = await browser.newPage();

    /**
     * Abrir una nueva pagina en el navegador.
     * Navegar a la pagina objetivo e ingresar las
     * credenciales de acceso.
     */
    await page.goto(`${config.CRM_BASE_URL}`, { waitUntil: 'networkidle2' });
    
    /**
     * Lector de la imagen del captcha.
     */
    const captchaSelector = 'img[src*="captcha_loader.php"]';
    await page.waitForSelector(captchaSelector);
    const captchaText = await sendCaptchaToWebhook(page, captchaSelector, `${config.CRM_DOWNLOAD_DIR}/captcha/captcha.png`);

    await page.type('input[name="usuario"]', config.CRM_USER);
    await page.type('input[name="contrase_chart241_a"]', config.CRM_PASSWORD);
    await page.type('input[name="antirobots"]', captchaText);
    await Promise.all([
        page.click('input[type=submit]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
}
