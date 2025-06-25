import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Funcion para realizar descarga de un archivo de excel
 * generado por la aplicacion objetivo, por medio de AXIOS.
 * 
 * @param {string} url Url del archivo exportado para descargar
 * @param {*} outputFolder Ruta completa del archivo.
 * @param {*} filename Nombre del archivo.
 * @returns 
 */
export const downloadFile = async (url, outputFolder, filename) => {
    const outputPath = path.join(outputFolder, filename);
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(outputPath));
    return outputPath;
}