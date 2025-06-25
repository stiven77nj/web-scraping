# 📦 API REST - Web Scraping

Esta API REST construida con **Express.js** permite realizar **peticiones GET** para ejecutar procesos de **web scraping** sobre distintas páginas, cada una representada por un endpoint específico. Actualmente se utiliza para extraer información de las plataformas **Mercately** y **ApiCrops**.

## 🚀 Tecnologías utilizadas

- **Express.js** – Framework para construir la API REST.
- **Puppeteer** – Librería de Node.js que permite automatizar el navegador para realizar scraping.
- **Docker** – Contenedor para ejecutar la aplicación de forma portable.
- **SQL Server** – Base de datos relacional para almacenar la información extraída.

## 🌐 Páginas objetivo de scraping

Se accede al CRM de Mercately para descargar datos de clientes automáticamente:

> [https://app.mercately.com/login](https://app.mercately.com/login)

Se accede a la página para extraer informacion del clima y de suelo:

> [https://web.instacrops.com](https://web.instacrops.com)

## ⚙️ Estructura del Proyecto

- /api
- /config
- /downloads
- /src
- .env # Variables de entorno (credenciales, configuraciones)
- Dockerfile # Imagen de Docker para contener la app

## 📦 Instalación

1. Clona el repositorio:

```bash
$ git clone https://github.com/tu_usuario/web-scraping-mercately-api.git
$ cd web-scraping-mercately-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura el archivo .env:

```bash
MERCATELY_USER=tu_usuario
MERCATELY_PASSWORD=tu_contraseña
SQLSERVER_HOST=localhost
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=tu_password
SQLSERVER_DATABASE=NombreDB
```

4. Ejecuta la API localmente:

```bash
npm run dev
```

## 🐳 Uso con Docker

```bash
docker build -t scraping-api .
docker run -p 3000:3000 scraping-api
```

## 🔌 Endpoints disponibles

- GET /api/mercately – Ejecuta el proceso de scraping para obtener informe clientes desde Mercately.

## 🗃️ Base de datos

Los datos extraídos se almacenan automáticamente en una instancia de SQL Server.

## Estado actual

- ✅ Estado actual
- ✅ Login automatizado con Puppeteer
- ✅ Descarga de archivo Excel desde CRM
- ✅ Parseo del archivo y carga en SQL Server
- ✅ Soporte para múltiples plataformas
- ⌛ Manejo de errores más robusto
- ⌛ Testing automatizado