import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

/**
 * Enviar imagen por POST a un Webhook de n8n
 * @param {string} imagePath Ruta local de la imagen
 * @param {string} webhookURL URL del Webhook de n8n
 */
export const sendCaptchaToWebhook = async (page, selector, outputPath) => {
  const webhookURL = 'http://172.28.254.41:5678/webhook/c11cd7dc-b91a-42e7-b35a-b9bef6e46965'
  const element = await page.$(selector);
  await element.screenshot({ path: outputPath });

  const form = new FormData();
  form.append('file', fs.createReadStream(outputPath), 'captcha.png');

  try {
    const response = await axios.post(webhookURL, form, {
      headers: form.getHeaders()
    });

    const rawOutput = response.data?.output || '';
    const match = rawOutput.match(/\*\*(.*?)\*\*/); 
    const result = match ? match[1] : '';

    console.log('🔍 CAPTCHA resuelto como:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al enviar la imagen al Webhook:', error.message);
    return '';
  }
};
