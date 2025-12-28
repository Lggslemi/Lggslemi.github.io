/* assets/js/payments.js */
(function () {
    window.Payments = {
        async checkoutWithEpayco({ cart, customer }) {
            // 1) Preparar descripción y monto total
            const desc = cart.items.map(i => `${i.title} x${i.qty}`).join(' | ');
            // Importante: ePayco recibe el monto como string. 
            const total = cart.items.reduce((s, i) => s + (i.price * i.qty), 0).toString();

            // 2) Cargar el script de ePayco dinámicamente si no está presente
            if (!window.ePayco) {
                await new Promise((resolve) => {
                    const s = document.createElement('script');
                    s.src = 'https://checkout.epayco.co/checkout.js';
                    s.onload = resolve;
                    document.head.appendChild(s);
                });
            }

            // 3) Configurar el handler
            const handler = ePayco.checkout.configure({
                key: window.BLENDS_CONFIG.epayco.publicKey,
                test: window.BLENDS_CONFIG.epayco.test
            });

            // 4) Definir la data (Aseguramos que extra1, 2 y 3 viajen siempre)
            const data = {
                name: "Blends Store - Gorras",
                description: desc,
                currency: "cop",
                amount: total,
                tax_base: "0",
                tax: "0",
                country: "co",
                lang: "es",
                external: "false", // Abre el modal en la misma ventana (mejor para móviles)
                response: window.BLENDS_CONFIG.epayco.successUrl,
                confirmation: window.BLENDS_CONFIG.sheetdb.pedidosUrl, // Opcional: ePayco avisa al Excel
                
                // Mapeo de cliente para tu base de datos
                extra1: customer.name || 'Sin nombre',
                extra2: customer.address || 'Sin dirección',
                extra3: customer.phone || 'Sin teléfono',
                
                // Atributos adicionales para mejor experiencia
                email_billing: window.currentUser?.email || '',
                name_billing: customer.name || ''
            };

            handler.open(data);
        }
    };
})();