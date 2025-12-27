# Blends - Frontend con ePayco + Google Sheets (SheetDB)

## Qué contiene
- Páginas estáticas en `public/`
- JS modular en `assets/js/` con capa de servicio `storage.js`

## Qué hacer antes de subir
1. Editar `assets/js/config.js` con tu `EPAYCO_PUBLIC_KEY`, `API_URL` (SheetDB/Make/tu-backend) y `RESPONSE_URL` (la URL pública de respuesta: GitHub Pages).
2. Sube al repo y activa GitHub Pages apuntando a la carpeta `public/`.

## Configurar ePayco (panel)
- **URL de Respuesta (response)**: `https://tu-usuario.github.io/tu-repo/public/respuesta.html` (Método GET).
- **URL de Confirmación (confirmation)**: `https://sheetdb.or.backend/endpoint` (Método POST).  
  - Esto hace que ePayco envíe una copia del pago a tu endpoint (SheetDB/Make) incluso si el cliente no regresa al navegador.
- En el dashboard de ePayco activa modo pruebas si vas a probar (usa `CONFIG.EPAYCO_TEST = true`).

**Importante**: guarda el `public_key` en `config.js` y nunca expongas tu `private_key` en frontend.

## Flujo
1. Cliente llena checkout → se invoca `iniciarPagoEpayco()` que abre el checkout.
2. ePayco procesa el pago y redirige a `respuesta.html` con parámetros GET (ej. `x_cod_response`, `x_ref_payco`, `x_extra1`, ...).
3. `respuesta.html` lee `x_cod_response`. Si `== 1` → Llama `guardarPedido(datos)` (service) para persistir en SheetDB.
4. Cart.clear() **solo** tras confirmación y registro exitoso.

## Notas
- La URL de confirmación (POST) la configuras también dentro del formulario que envías a ePayco (campo `confirmation`).
- Para producción cambia `EPAYCO_TEST` a `false` y usa la key de producción.
