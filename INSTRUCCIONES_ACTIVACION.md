# Guía Profesional de Activación y Despliegue de OnixLingo (LMS & IA Kernel)

Esta guía documenta los pasos oficiales y profesionales para poner en marcha el ecosistema **OnixLingo** de manera integral. El proyecto cuenta con un backend en **FastAPI (Python 3.10+)** y un frontend de alto rendimiento en **Next.js (React/TypeScript)**, orquestado mediante **Docker** y **Make**.

---

## 📋 Arquitectura del Proyecto

El proyecto está organizado de la siguiente manera:
* **`/backend`**: API de FastAPI, base de datos (PostgreSQL remota/local SQLite), inyectores de lecciones y motor de IA con Gemini/Google Cloud.
* **`/frontend`**: Interfaz de usuario Next.js 14+ optimizada para escritorio, móvil y tableros de control.
* **`Makefile` y `docker-compose.yml`**: Configuración de contenedores Docker para producción o pruebas unificadas.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema operativo:
1. **Python 3.10** o superior (con soporte para entornos virtuales).
2. **Node.js 18** o superior (con gestor de paquetes `npm`).
3. **Docker Desktop** (opcional, requerido únicamente para el modo contenedor/producción).
4. Acceso de red para la base de datos PostgreSQL y las APIs de Inteligencia Artificial (Gemini API, Google Cloud, etc.).

---

## 🚀 Método 1: Activación en Desarrollo Local (Modo Altamente Productivo)

Este método es ideal para el desarrollo diario, la edición rápida de código y la depuración en tiempo real.

### Paso 1: Configuración e Inicio del Backend (FastAPI)

1. **Navega al directorio del backend:**
   ```powershell
   cd backend
   ```

2. **Crear y activar el entorno virtual de Python (venv):**
   * **En PowerShell (Windows):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **En CMD (Windows):**
     ```cmd
     python -m venv venv
     .\venv\Scripts\activate.bat
     ```

3. **Instalar todas las dependencias requeridas:**
   ```powershell
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Verificación de Variables de Entorno (`.env`):**
   El archivo `.env` ya se encuentra preconfigurado con claves críticas. Asegúrate de verificar las siguientes propiedades:
   * `NEXT_PUBLIC_API_URL`: `http://127.0.0.1:8000` (Debe coincidir con el puerto del backend).
   * `GEMINI_API_KEY`: Tu clave de Google Gemini para la generación inteligente.
   * `DATABASE_URL`: URL de PostgreSQL remota preconfigurada (ej. `postgres://postgres:...@178.104.254.28:5433/postgres`).
     > [!NOTE]
     > Si la variable `DATABASE_URL` se deja en blanco o se elimina del `.env`, el backend se auto-configura para usar una base de datos local SQLite (`onixlingo.db`). Esto es excelente para pruebas rápidas offline.

5. **Ejecutar migraciones y estructuración de base de datos:**
   Al iniciar el backend, SQLAlchemy creará las tablas automáticamente. Sin embargo, para aplicar columnas adicionales personalizadas en producción, ejecuta:
   ```powershell
   python migrate_db.py
   ```

6. **Inyección del Super-Administrador (Admin Seed):**
   Para tener un usuario inicial con todos los privilegios premium y nivel Titanium habilitado:
   ```powershell
   python crear_admin.py
   ```
   * **Credenciales generadas:**
     * **Usuario:** `OnixuAdmin`
     * **Email:** `onixutechnology@gmail.com`
     * **Contraseña:** `Onixuad9.87mi-n` (Cambiar inmediatamente en el panel al pasar a producción).

7. **Levantar el Servidor del Backend con Uvicorn:**
   ```powershell
   python -m uvicorn main:app --reload --port 8000
   ```
   * El backend estará escuchando en `http://127.0.0.1:8000`.
   * Puedes ver e interactuar con la documentación interactiva OpenAPI en: `http://127.0.0.1:8000/docs`.

---

### Paso 2: Generación del Contenido LMS (Lecciones, Drills y TOEIC)

OnixLingo cuenta con generadores dinámicos que compilan las lecciones de inglés de alto impacto (niveles A1, A2, B1, certificaciones TOEIC, retos auditivos y de gramática). Debes ejecutar estos generadores para compilar el material del curso.

1. **Posiciónate en la raíz del proyecto (`language-ai-tutor`):**
   ```powershell
   cd ..
   ```

2. **Generar los archivos molde de lecciones (si faltan lecciones específicas):**
   ```powershell
   python create_all_generators.py
   ```

3. **Ejecutar la compilación masiva de lecciones:**
   ```powershell
   python regenerate_all.py
   ```
   * Este script ejecutará todos los generadores individuales (`generate_lesson_a1_*_pro.py`, `toeic-*.py`, etc.).
   * Generará archivos JSON estructurados con más de 100 ejercicios por lección y los guardará en el backend (`backend/app/data/lessons/` y `backend/app/voclessons/lessons/`).

---

### Paso 3: Configuración e Inicio del Frontend (Next.js)

1. **Navega al directorio del frontend:**
   ```powershell
   cd frontend
   ```

2. **Instalar dependencias de Node.js:**
   ```powershell
   npm install
   ```

3. **Verificación de Variables de Entorno (`.env.local`):**
   Comprueba el archivo `.env.local`. Debe apuntar al backend local:
   * `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
   * `NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000/ws`
   * Configuración de pasarelas de pago sandbox (Stripe o Paddle) precargadas.

4. **Ejecutar el Frontend en Modo Desarrollo:**
   ```powershell
   npm run dev
   ```
   * El frontend estará disponible en `http://localhost:3000` (o `http://localhost:3001` si el puerto 3000 está ocupado).
   * Next.js soporta Hot Module Replacement (HMR), por lo que cualquier cambio visual se reflejará al instante.

---

## 🐳 Método 2: Activación Profesional Unificada (Docker & Docker-Compose)

Este método es el recomendado para entornos de pre-producción (Staging), pruebas de conectividad de red local y despliegue final en producción. Con un solo comando levantarás la base de datos PostgreSQL, el backend en FastAPI y el frontend en Next.js.

### Paso 1: Levantar el Ecosistema

1. **Navega a la raíz del proyecto (`language-ai-tutor`):**
   ```powershell
   cd c:\Users\jeico\onixlingo\language-ai-tutor
   ```

2. **Asegúrate de que Docker Desktop esté en ejecución.**

3. **Construir y arrancar todos los contenedores usando Make:**
   El proyecto incluye un `Makefile` profesional para automatizar la orquestación:
   ```powershell
   # 1. Construir las imágenes Docker limpias
   make build

   # 2. Levantar todos los servicios en segundo plano (-d)
   make up
   ```
   *(Si no tienes `make` instalado en Windows, ejecuta directamente: `docker-compose up --build -d`)*

4. **Verificar que todos los servicios estén corriendo:**
   ```powershell
   make logs
   ```
   *(O alternativamente: `docker-compose logs -f`)*
   
   Esto mostrará los logs unificados. Busca los mensajes de éxito:
   * **`onix-db`**: `database system is ready to accept connections`
   * **`onix-backend`**: `Application startup complete.` en el puerto `8000`.
   * **`onix-frontend`**: Servidor Next.js levantado en el puerto `3000`.

---

### Paso 2: Inyectar Datos y Administradores dentro del Contenedor Docker

Dado que los procesos ahora corren de forma aislada dentro de contenedores, la inyección inicial debe hacerse ejecutando comandos sobre el contenedor backend activo (`onix-backend`):

1. **Ejecutar migraciones en el contenedor:**
   ```powershell
   docker exec -it onix-backend python migrate_db.py
   ```

2. **Crear el Super-Administrador en el contenedor:**
   ```powershell
   docker exec -it onix-backend python crear_admin.py
   ```

3. **Compilar y regenerar todas las lecciones dentro del contenedor:**
   ```powershell
   docker exec -it onix-backend python regenerate_all.py
   ```

---

## ⚡ Comandos de Utilidad Rápida (Cheat Sheet)

### Para el Makefile Unificado
| Comando | Descripción |
| :--- | :--- |
| `make up` | Levanta todos los contenedores en segundo plano (`onix-db`, `onix-backend`, `onix-frontend`). |
| `make down` | Apaga y remueve los contenedores activos. |
| `make build` | Reconstruye las imágenes Docker sin caché para aplicar cambios de dependencias. |
| `make logs` | Sigue en tiempo real los registros/logs de los contenedores. |
| `make restart` | Reinicia rápidamente los contenedores activos. |
| `make db-shell` | Abre una consola interactiva de Postgres (`psql`) en la base de datos interna. |
| `make clean` | Apaga los contenedores, remueve volúmenes persistidos y limpia el sistema Docker. |

---

## 🛡️ Lista de Verificación para el Paso a Producción (Production Checklist)

1. [ ] **Cambio de Contraseñas:** Asegúrate de cambiar la contraseña por defecto del super-admin inyectado (`Onixuad9.87mi-n`) y de la base de datos PostgreSQL.
2. [ ] **Modo Sandbox:** Si vas a facturar de verdad, cambia `NEXT_PUBLIC_PADDLE_ENV` a `production` en el frontend y configura las credenciales correspondientes de producción para Stripe o Paddle.
3. [ ] **Desactivar Recarga Automática (Reload):** En el backend de producción, no utilices el flag `--reload` de uvicorn; en su lugar, corre con múltiples workers (`gunicorn` con clase uvicorn).
4. [ ] **Seguridad CORS:** Limita los valores de `ALLOWED_ORIGINS` en el archivo `.env` del backend únicamente al dominio de producción del frontend (`https://onixlingo.onixu.company`), eliminando `localhost` para evitar vulnerabilidades de origen.
