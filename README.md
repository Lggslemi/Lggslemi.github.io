# Blends - Frontend con ePayco + Google Sheets (SheetDB)

## Estructura
- HTML en la raíz: `index.html`, `catalogo.html`, `producto.html`, `checkout.html`, `respuesta.html`
- Recursos en `assets/` (css y js)

## Qué hacer antes de subir
1. Editar `assets/js/config.js` con:
   - `EPAYCO_PUBLIC_KEY` (ya la pusiste)
   - `API_URL` (ya la pusiste)
   - `RESPONSE_URL`: cambia `tu-usuario` y `tu-repo` por los reales (ej: `https://miusuario.github.io/mirepo/respuesta.html`)
2. Subir todo al repo (HTML en raíz) y activar GitHub Pages apuntando a la rama (root).

## Configurar ePayco (panel)
- **URL de Respuesta (response)**: `https://tu-usuario.github.io/tu-repo/respuesta.html` (Método GET).
- **URL de Confirmación (confirmation)**: `https://sheetdb.io/api/v1/vsp6002zg2sm3` (Método POST).
- Mantén `EPAYCO_TEST: true` para pruebas.

## Flujo
1. Cliente llena checkout → `iniciarPagoEpayco()` abre checkout.
2. ePayco procesa pago → redirige a `respuesta.html` con parámetros GET.
3. Si `x_cod_response == 1` → `guardarPedido(datos)` en `assets/js/storage.js`.
4. `Cart.clear()` solo tras registro exitoso.

**Importante**: no pongas tu private_key en frontend.
