/* cart.js
  - Implementa sincronización en tiempo real con Firestore
  - Persistencia por usuario (UID)
  - Exposición de API simple: addItem, removeItem, setQty, addFavorite, removeFavorite, getSnapshot
*/
(async function () {
    // Espera a que window._firebaseFirestore y window._firebaseAuth estén inicializados
    function waitForFirestore() {
        return new Promise((resolve) => {
            const check = () => { if (window._firebaseFirestore && window._firebaseAuth) resolve(); else setTimeout(check, 150); };
            check();
        });
    }

    await waitForFirestore();

    const { getFirestore, doc, onSnapshot, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js');

    const db = getFirestore(window._firebaseApp);
    const auth = getAuth(window._firebaseApp);

    class CartModule {
        constructor() {
            this.uid = null;
            this.unsubscribe = null;
            this.data = { items: [], favorites: [] };
            // Escucha cambios de autenticación
            auth.onAuthStateChanged(user => this._handleUser(user));
        }

        async _handleUser(user) {
            // Desuscribirse si existía una escucha previa
            if (this.unsubscribe) this.unsubscribe();

            // Si no hay usuario, limpia estado local
            if (!user) {
                this.uid = null;
                this.data = { items: [], favorites: [] };
                this._emit();
                return;
            }

            this.uid = user.uid;
            const ref = doc(db, 'carts', this.uid);

            // Create document if not exists
            try {
                const snapshot = await getDoc(ref);
                if (!snapshot.exists()) {
                    await setDoc(ref, { items: [], favorites: [], updatedAt: new Date().toISOString() });
                }
            } catch (err) {
                console.error('Error al comprobar/crear documento de carrito:', err);
                // Notificar UI si es necesario
            }

            // Escucha en tiempo real
            this.unsubscribe = onSnapshot(ref, s => {
                const d = s.data() || { items: [], favorites: [] };
                this.data = { items: d.items || [], favorites: d.favorites || [] };
                this._emit();
            }, err => {
                console.warn('onSnapshot error:', err);
            });
        }

        _emit() {
            document.dispatchEvent(new CustomEvent('cart-changed', { detail: { data: this.data } }));
        }

        async _write(data) {
            if (!this.uid) throw new Error('No user authenticated. Cannot write cart.');
            const ref = doc(db, 'carts', this.uid);
            await setDoc(ref, Object.assign({ updatedAt: new Date().toISOString() }, data));
        }

        async addItem(item) {
            const idx = this.data.items.findIndex(i => i.id === item.id);
            if (idx >= 0) {
                this.data.items[idx].qty += item.qty || 1;
            } else {
                this.data.items.push(Object.assign({ qty: item.qty || 1 }, item));
            }
            await this._write({ items: this.data.items, favorites: this.data.favorites });
        }

        async removeItem(id) {
            this.data.items = this.data.items.filter(i => i.id !== id);
            await this._write({ items: this.data.items, favorites: this.data.favorites });
        }

        async setQty(id, qty) {
            const it = this.data.items.find(i => i.id === id);
            if (it) {
                it.qty = qty;
                await this._write({ items: this.data.items, favorites: this.data.favorites });
            }
        }

        async addFavorite(item) {
            if (!this.data.favorites.find(f => f.id === item.id)) {
                this.data.favorites.push(item);
                await this._write({ items: this.data.items, favorites: this.data.favorites });
            }
        }

        async removeFavorite(id) {
            this.data.favorites = this.data.favorites.filter(f => f.id !== id);
            await this._write({ items: this.data.items, favorites: this.data.favorites });
        }

        async clear() {
            this.data.items = [];
            await this._write({ items: this.data.items, favorites: this.data.favorites });
        }

        async getSnapshot() {
            return JSON.parse(JSON.stringify(this.data));
        }
    }

    window.Cart = new CartModule();

    // Expose some UI convenience: render cart when `cart-changed` fired
    document.addEventListener('cart-changed', (e) => {
        const area = document.getElementById('cart-area');
        if (!area) return;
        const d = e.detail.data;
        if (!d || d.items.length === 0) {
            area.innerHTML = '<p>Tu carrito está vacío.</p>';
            return;
        }
        const list = document.createElement('div');
        list.className = 'card';
        list.innerHTML = d.items.map(it => `<div><strong>${it.title}</strong> x ${it.qty} — $${(it.price / 100).toFixed(2)}</div>`).join('');
        area.innerHTML = '';
        area.appendChild(list);
    });
})();
