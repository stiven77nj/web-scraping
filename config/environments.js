import dotenv from 'dotenv';

dotenv.config();

/**
 * Variables de entorno.
 */
export const config = {
    MERCATELY_USER: process.env.MERCATELY_USER,
    MERCATELY_PASSWORD: process.env.MERCATELY_PASSWORD,
    MERCATELY_BASE_URL: process.env.MERCATELY_BASE_URL,
    MERCATELY_DOWNLOAD_DIR: process.env.MERCATELY_DOWNLOAD_DIR,
    API_CROPS_USER: process.env.API_CROPS_USER,
    API_CROPS_PASSWORD: process.env.API_CROPS_PASSWORD,
    API_CROPS_BASE_URL: process.env.API_CROPS_BASE_URL,
    API_CROPS_DOWNLOAD_DIR: process.env.API_CROPS_DOWNLOAD_DIR,
    CRM_USER: process.env.CRM_USER,
    CRM_PASSWORD: process.env.CRM_PASSWORD,
    CRM_BASE_URL: process.env.CRM_BASE_URL,
    CRM_DOWNLOAD_DIR: process.env.CRM_DOWNLOAD_DIR,
    MERCADO_LIBRE_BASE_URL: process.env.MERCADO_LIBRE_BASE_URL,
    PORT_API: process.env.PORT_API
}