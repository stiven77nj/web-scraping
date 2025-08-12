// Al inicio del archivo
import fs from 'fs';
import path from 'path';

// Función para log detallado
export const logDebug = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`;
    console.log(logMessage);
    
    // Opcional: guardar en archivo
    fs.appendFileSync('scraping.log', logMessage + '\n');
};