/* assets/js/storage.js */
(function () {
    window.Storage = {
        async guardarPedido(data) {
            const url = window.BLENDS_CONFIG.sheetdb?.pedidosUrl;
            if (!url) return console.error('Falta URL de SheetDB');

            // SheetDB espera un array de objetos o un objeto dentro de "data"
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([data]) // Enviamos como fila de Excel
                });

                if (!response.ok) throw new Error('Error en SheetDB');
                return await response.json();
            } catch (error) {
                console.error("Error guardando en Excel:", error);
            }
        }
    };
})();