// assets/js/cart.js
// Carrito simple sobre localStorage. Adaptable a tus necesidades.
const Cart = (function () {
  const STORAGE_KEY = 'blends_cart_v1';

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Cart load err', e);
      return [];
    }
  }

  function _save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  return {
    add(item) {
      // item: {id, name, price, qty}
      const items = _load();
      const found = items.find(i => i.id === item.id);
      if (found) found.qty += item.qty;
      else items.push(item);
      _save(items);
    },
    remove(id) {
      const items = _load().filter(i => i.id !== id);
      _save(items);
    },
    list() {
      return _load();
    },
    total() {
      return _load().reduce((s, i) => s + i.price * i.qty, 0);
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
})();
