import fs from 'fs';
import { launchBrowser } from '../services/browser.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from '../../config/environments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Funcion para ejecutar el flujo de ApiCrops para exportar el reporte de
 * registros del clima y suelos. (Hecarse y Hato)
 */
export const runApiCropsFlow = async () => {
    /**
     * 
     */
    const browser = await launchBrowser(true);

    /**
     * 
     */
    const page = await browser.newPage();

    /**
     * Abrir una nueva pagina en el navegador.
     * Navegar a la pagina objetivo e ingresar las
     * credenciales de acceso.
     */
    await page.goto(`${config.API_CROPS_BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('input[name="username"]', config.API_CROPS_USER);
    await page.type('input[name="password"]', config.API_CROPS_PASSWORD);
    await Promise.all([
        page.click('button[type=submit]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await sleep(5000); // Esperar un lapso de tiempo

    /**
     * Dar click en el boton "descargas" del navbar.
    */
    await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        const target = anchors.find(a =>
            a.textContent.includes('Descarga') && a.getAttribute('href') === '/download'
        )

        if (target) target.click();
    });

    await sleep(5000); // Esperar un lapso de tiempo

    await page.waitForSelector('#downloadOverflow ul.collapsible li');
    await page.evaluate(() => {
        const firstLi = document.querySelector('#downloadOverflow ul.collapsible li');
        if (firstLi) {
            const header = firstLi.querySelector('.collapsible-header');
            if (header) header.click();
        }
    });

    /**
     * Se listan las opciones del campo "select" donde se 
     * encuentran las diferentes sedes (FINCAS).
     * 
     * Se retornan las opciones.
     */
    const opciones = await page.evaluate(() => {
        const select = document.querySelector('select[ng-model="download.itemModel"]');
        if (!select) return [];

        return Array.from(select.querySelectorAll('option'))
            .map(opt => opt.value)
            .filter(text => text && !text.includes('?'));
    });

    /**
     * Prepara la forma en que se deben descargar los arhivos.
     */
    const downloadPath = path.resolve(__dirname + '/../../', config.API_CROPS_DOWNLOAD_DIR);
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath
    });

    /**
     * Se recorren las opciones para ir descargando
     * uno a uno la data asociada.
    */
    for (const opcion of opciones) {
        /**
         * Seleccionar la opcion "Selecciona Estacion".
         * Disparar el evento "change" del campo "Select".
        */
        await page.evaluate((opcion) => {
            const event = new Event('change');
            const select = document.querySelector('select[ng-model="download.itemModel"]');
            select.value = opcion;
            select.dispatchEvent(event);
        }, opcion);

        /**
         * Seleccionar la opcion "Selecciona parametro".
         * Se seleccionan todas las opciones posibles dando
         * click en el boton "Seleccionar todo".
        */
        await page.evaluate(() => {
            const selectAll = document.querySelector('#select_all');
            selectAll.click();
        });

        /**
         * En la seccion de "intervalo", se le da click en la opcion
         * numero 2 (equivalente a una hora). Denota la diferencia de 
         * tiempo que hay entre un dato y otro.
         * 
        */
        await page.evaluate(() => {
            const interval = document.querySelector('#interval-2');
            interval.click();
        });

        /**
         * Establecer el rango de fechas en el que se va
         * a descargar la informacion. (En este caso, diaria).
         * Fecha inicial = Fecha final.
        */
        await page.evaluate(() => {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');

            const fechaInicial = document.querySelector('#test32');
            fechaInicial.value = `&quot;${yyyy}-${mm}-${dd}T00:00:00.000Z&quot;`;

            const fechaFinal = document.querySelector('#test3');
            fechaFinal.value = `&quot;${yyyy}-${mm}-${dd}T00:00:00.000Z&quot;`;
        });

        /**
         * Realizar la descarga de datos.
        */
        await page.click('button[ng-click="download.setDownload()"]');
        console.log('Esperando descarga... ⌛');

        try {
            const archivo = await awaitForDownload(downloadPath);
            console.log(`✅ Archivo descargado: ${archivo}`);
        } catch (e) {
            console.log('Error esperando la descarga: ', e);
        }
    };

    await browser.close();
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Funcion para esperar a que se complete la descarga,
 * 
 * @param {string} folderPath Ruta del directorio donde se guardan las descargas.
 * @param {number} timeout Tiempo de espera (milisegundos).
 * @returns Nombre del archivo descargado.
 */
const awaitForDownload = (folderPath, timeout = 30000) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const files = fs.readdirSync(folderPath);
            const downloaded = files.find(file => !file.endsWith('.crdownload'));

            if (downloaded) {
                clearInterval(interval);
                resolve(downloaded)
            }

            if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error('Descarga no completada a tiempo'));
            }
        }, 500);
    });
}