/* auth.js
  - Maneja sign in con Email/Password y Google
  - Detecta cambios de sesión y expone currentUser
  - Provee helper para proteger rutas estáticas
*/
(function () {
    // Espera a que Firebase haya inicializado las variables _firebaseAuth
    function waitForAuthLoaded() {
        return new Promise((resolve) => {
            const check = () => { if (window._firebaseAuth) resolve(); else setTimeout(check, 150); };
            check();
        });
    }

    async function init() {
        await waitForAuthLoaded();
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js');
        const auth = getAuth(window._firebaseApp);

        window.Auth = {
            async login(email, password) {
                return signInWithEmailAndPassword(auth, email, password);
            },
            async signup(email, password) {
                return createUserWithEmailAndPassword(auth, email, password);
            },
            async logout() { return signOut(auth); },
            async googleSignin() {
                const provider = new GoogleAuthProvider();
                return signInWithPopup(auth, provider);
            },
            onAuthStateChanged: (cb) => onAuthStateChanged(auth, cb),
            getCurrentUser: () => auth.currentUser
        };

        // UI bindings comunes
        // Login form (si existe)
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const f = new FormData(loginForm);
                try {
                    await window.Auth.login(f.get('email'), f.get('password'));
                    location.href = '/public/catalogo.html';
                } catch (err) { alert('Error al iniciar sesión: ' + err.message); }
            });
        }

        const googleBtn = document.getElementById('google-signin');
        if (googleBtn) googleBtn.addEventListener('click', async () => { try { await window.Auth.googleSignin(); location.href = '/public/catalogo.html'; } catch (e) { alert('Google Signin falló'); } });

        // Exponer globalmente
        window.addEventListener('DOMContentLoaded', () => {
            // Muestra estado en headers si hay elementos con id
            const loginLink = document.getElementById('link-login');
            const checkoutLink = document.getElementById('link-checkout');
            window.Auth.onAuthStateChanged(user => {
                if (loginLink) loginLink.textContent = user ? 'Perfil' : 'Iniciar sesión';
                if (checkoutLink) checkoutLink.style.display = user ? 'inline' : 'none';
                window.currentUser = user || null;
                document.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
            });
        });
    }

    init();
})();
