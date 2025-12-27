// assets/js/payments.js

/**
 * Genera un texto simple con los productos del carrito
 */
function crearDescripcionPedido(items) {
  return items.map(it => `${it.name} (x${it.qty})`).join(', ');
}

/**
 * Inicia el checkout de ePayco usando el método de Modal (ventana flotante)
 * Esto evita errores de CloudFront/GitHub Pages.
 */
function iniciarPagoEpayco(formData, items) {
  const descripcionPedido = crearDescripcionPedido(items);
  const amount = items.reduce((s, i) => s + i.price * i.qty, 0);

  // 1. Configuramos el manejador de ePayco con tu llave pública
  const handler = ePayco.checkout.configure({
    key: CONFIG.EPAYCO_PUBLIC_KEY,
    test: CONFIG.EPAYCO_TEST
  });

  // 2. Definimos los datos del pago y del cliente
  const data = {
    // Datos del producto
    name: "Blends - Pedido de Gorras",
    description: descripcionPedido,
    currency: CONFIG.CURRENCY.toLowerCase(), // ePayco prefiere minúsculas (cop)
    amount: amount.toString(),
    tax_base: "0",
    tax: "0",
    country: CONFIG.COUNTRY.toLowerCase(),
    lang: "es",

    // Datos del cliente y envío (EXTRAS para tu Excel)
    external: "false", 
    extra1: formData.nombre || '',                      // Nombre en el Excel
    extra2: `${formData.direccion} | ${formData.ciudad}`, // Dirección en el Excel
    extra3: formData.telefono || '',                    // Teléfono en el Excel
    
    // Datos de facturación para la pasarela
    email_billing: formData.email,
    name_billing: formData.nombre,
    address_billing: formData.direccion,

    // Redirecciones (URLs que configuraste en config.js)
    response: CONFIG.RESPONSE_URL,
    confirmation: CONFIG.API_URL, 
    
    // Método para el envío de datos a SheetDB
    method: "POST"
  };

  // 3. Abrimos la ventana de pago
  handler.open(data);
}
