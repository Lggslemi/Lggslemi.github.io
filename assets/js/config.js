// Central configuration (pone aquí las claves públicas y URLs).
// NOTA: protege los secretos en producción; las claves públicas de Firebase son seguras en cliente,
// pero las claves privadas y endpoints de verificación deberían vivir en un backend.
window.BLENDS_CONFIG = {
    firebase: {
        apiKey: "AIzaSyDDdVULLYla_iF1O_IfOfIuNQn74N2alUo",
        authDomain: "blends-store.firebaseapp.com",
        projectId: "blends-store",
        storageBucket: "blends-store.firebasestorage.app",
        messagingSenderId: "151049649136",
        appId: "1:151049649136:web:758b02941cc090dd86bb35",
        measurementId: "G-J33LK3B2ZG"
    },
    epayco: {
        publicKey: "30a7f23efa613db7572381c8097f2d73",
        test: true,
        // URL de retorno que debe configurarse en ePayco (respuesta.html)
        successUrl: (new URL('/public/respuesta.html', location.origin)).toString()
    },
    sheetdb: {
        // URL pública de SheetDB o tu backend que recibe pedidos
        pedidosUrl: "https://sheetdb.io/api/v1/vsp6002zg2sm3"
    }
};

// Inicializa Firebase (modular SDK)
(function initFirebase() {
    if (!window.firebaseAppInitialized) {
        // Carga modular SDK dinamicamente si no existe
        const s = document.createElement('script');
        s.type = 'module';
        s.textContent = `
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
      import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
      import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
      const cfg = window.BLENDS_CONFIG.firebase;
      window._firebaseApp = initializeApp(cfg);
      window._firebaseAuth = getAuth(window._firebaseApp);
      window._firebaseFirestore = getFirestore(window._firebaseApp);
      window.firebaseAppInitialized = true;
    `;
        document.head.appendChild(s);
    }
})();
