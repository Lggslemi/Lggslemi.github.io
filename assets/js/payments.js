// assets/js/payments.js
// Lógica para iniciar checkout ePayco y generar descripcionPedido y campos extra.

// Dependencia: incluye en las páginas:
// <script src="https://checkout.epayco.co/checkout.js"></script>

function crearDescripcionPedido(items) {
  // items: [{id,name,price,qty},...]
  return items.map(it => `${it.name} (x${it.qty})`).join(', ');
}

/**
 * iniciarPagoEpayco
 * formData: {nombre, direccion, ciudad, telefono, email}
 * items: cart items
 */
function iniciarPagoEpayco(formData, items) {
  const descripcionPedido = crearDescripcionPedido(items);
  const amount = items.reduce((s,i)=> s + i.price * i.qty, 0);

  // Creamos un formulario dinámico que ePayco espera (onepage checkout)
  const form = document.createElement('form');
  form.setAttribute('method', 'POST'); // ePayco abrirá la ventana del checkout
  form.setAttribute('action', 'https://checkout.epayco.co/checkout'); // script lo maneja
  form.style.display = 'none';

  // Campos obligatorios / recomendados (según docs)
  const addHidden = (name, value) => {
    const i = document.createElement('input');
    i.type = 'hidden';
    i.name = name;
    i.value = value;
    form.appendChild(i);
  };

  addHidden('public_key', CONFIG.EPAYCO_PUBLIC_KEY);
  addHidden('amount', amount.toString());
  addHidden('name', 'Blends - Pedido');
  addHidden('description', descripcionPedido);
  addHidden('currency', CONFIG.CURRENCY);
  addHidden('country', CONFIG.COUNTRY);
  addHidden('test', CONFIG.EPAYCO_TEST ? 'true' : 'false');

  // EXTRAS (se especifican en la solicitud). Guardamos Nombre, Direccion+Ciudad y Telefono.
  addHidden('extra1', formData.nombre || '');
  addHidden('extra2', `${formData.direccion || ''} | ${formData.ciudad || ''}`);
  addHidden('extra3', formData.telefono || '');
  // Email para notificaciones
  addHidden('email', formData.email || '');

  // URLs: respuesta visible al cliente (GET) y confirmation (POST) -> confirmation debe apuntar a tu API/SheetDB
  addHidden('response', CONFIG.RESPONSE_URL);
  addHidden('confirmation', CONFIG.API_URL);

  // Agregamos el form temporal al body, lo activamos (ePayco script lo detecta)
  document.body.appendChild(form);

  // Si usas el checkout.js de ePayco, normalmente se dispara por submit
  form.submit();

  // Clean up (opcional, no antes de submit)
  setTimeout(()=> form.remove(), 2000);
}
