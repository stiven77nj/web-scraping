import { launchBrowser } from '../services/browser.js';

import { config } from '../../config/environments.js';
import { downloadFile } from '../services/download.js';
import { getTimestamp } from '../utils/time.js';

/**
 * Funcion para ejecutar el flujo de Mercately para exportar el reporte de clientes.
 */
export const runMercatelyFlow = async () => {
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
    await page.goto(`${config.MERCATELY_BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('input[name="user[email]"]', config.MERCATELY_USER);
    await page.type('input[name="user[password]"]', config.MERCATELY_PASSWORD);
    await Promise.all([
        page.click('input[type=submit]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    /**
     * Dar click en el boton "CRM" del sidebar
    */
    const crmSelector = 'a[href="/retailers/arar-financiera-23371/customers"]';
    await page.waitForSelector(crmSelector, { visible: true });
    await page.click(crmSelector);

    /**
     * Buscar el contenedor del boton "Acciones" y dar click en el boton.
     */
    const buttonSelector = 'div.tw-relative.tw-inline-block.tw-text-left > button';
    await page.waitForSelector(buttonSelector, { visible: true });
    await page.click(buttonSelector);

    /**
     * Buscar el listado de botones y filtrarlos de manera que solo 
     * retorno el boton con el contenido "Exportar".
     */
    await page.evaluate(() => {
        const botones = Array.from(document.querySelectorAll('button'));
        const exportar = botones.find(btn =>
            Array.from(btn.querySelectorAll('span')).some(span => span.textContent.trim() === 'Exportar')
        );
        if (exportar) exportar.click();
    });

    /**
     * Buscar el listado de botones y filtrarlos de manera que solo 
     * retorno el boton con el contenido "Excel".
     */
    await page.evaluate(() => {
        const botones = Array.from(document.querySelectorAll('button'));
        const exportar = botones.find(btn =>
            Array.from(btn.querySelectorAll('span')).some(span => span.textContent.trim() === 'Excel')
        );
        if (exportar) exportar.click();
    });

    setTimeout(async () => {
        /**
         * Dar click en el boton "CRM" del sidebar
        */
        const clientesExportadosSelector = 'a[href="/retailers/arar-financiera-23371/exported_customers"]';
        await page.click(clientesExportadosSelector);

        setTimeout(async () => {
            /**
             * Primer elemento de la tabla "clientes exportados".
             * Hace referencia al ultimo informe generado.
            */
            const downloadUrl = await page.evaluate(() => {
                const link = document.querySelector('a.tw-text-blue-600');
                return link?.href || null;
            });

            if (downloadUrl) {
                const filename = `${getTimestamp()}-clientes-exportados.xlsx`;
                const savedPath = await downloadFile(downloadUrl, config.MERCATELY_DOWNLOAD_DIR, filename);
                console.log(`✅ Archivo guardado en: ${savedPath}`);
            } else {
                console.log('❌ No se encontró un enlace válido');
            }

            await browser.close();
        }, 5000);

    }, 5000);
}
