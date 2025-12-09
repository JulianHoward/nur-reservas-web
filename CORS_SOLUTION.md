# Solución de CORS

## Problema
El backend solo permite el origen `https://pamela-web-page.vercel.app`, pero en desarrollo local usamos `http://localhost:5173`.

## Solución Implementada
Se configuró un **proxy en Vite** que redirige todas las peticiones de `/api/*` al backend en `http://localhost:3000/*`.

## Pasos para aplicar la solución:

1. **Detén el servidor de desarrollo actual** (Ctrl+C en la terminal donde corre `npm run dev`)

2. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

3. **Verifica en la consola del navegador** que ahora aparezca:
   ```
   🔧 Modo desarrollo detectado. API_URL: /api
   ```

4. Las peticiones ahora deberían ir a `/api/auth/register` en lugar de `http://localhost:3000/auth/register`

## Si el problema persiste:

### Opción 1: Verificar que el proxy funcione
Abre las herramientas de desarrollador (F12) → Network tab y verifica que las peticiones vayan a `/api/...` en lugar de `http://localhost:3000/...`

### Opción 2: Configurar CORS en el backend
Si tienes acceso al backend, agrega `http://localhost:5173` a los orígenes permitidos en la configuración de CORS.

### Opción 3: Usar variable de entorno
Crea un archivo `.env` en la raíz del proyecto con:
```
VITE_API_URL=http://localhost:3000
```
Pero esto requerirá que el backend permita CORS desde `http://localhost:5173`.

## Configuración actual:
- **Proxy configurado en**: `vite.config.js`
- **Cliente API**: `src/api/client.js`
- **En desarrollo**: Usa `/api` (proxy)
- **En producción**: Usa la URL completa del backend

