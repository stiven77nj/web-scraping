import express from 'express';

import { config } from '../config/environments.js'
import { runApiCropsFlow } from '../src/pages/api_crops.js';
import { runMercatelyFlow } from '../src/pages/mercately.js';

/**
 * Constante para gestionar el servidor "express".
 */
const app = express();

/**
 * Constante para gestionar el puerto, en el que
 * el servidor escucha las peticiones.
 */
const port = config.PORT_API;

/**
 * Endpoint de "Mercately".
*/
app.get('/mercately', async (req, res) => {
    try {
        await runMercatelyFlow();
        res.status(200).send('✅ Scraping ejecutado correctamente.');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Error al ejecutar el scraping.');
    }
});

/**
 * Endpoint de "ApiCrops".
*/
app.get('/apicrops', async (req, res) => {
    try {
        await runApiCropsFlow();
        res.status(200).send('✅ Scraping ejecutado correctamente.');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Error al ejecutar el scraping.');
    }
});


/**
 * Escuchar peticiones.
*/
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})