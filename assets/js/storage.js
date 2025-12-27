// assets/js/storage.js
// Servicio para guardar pedidos. Hoy: SheetDB / Formspree / Make.com -> POST JSON.
// Cambia CONFIG.API_URL en config.js cuando migres a tu propio backend.
async function guardarPedido(datosPedido) {
  // datosPedido: objeto listo para enviar (ej: {ref:..., total:..., items: [...], extra1:..., extra2:..., extra3:...})
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosPedido)
    });
    // algunos servicios devuelven 201/200 con JSON
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error guardando pedido:', err);
    throw err;
  }
}
