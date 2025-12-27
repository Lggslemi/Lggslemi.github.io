// assets/js/config.js
const CONFIG = {
  EPAYCO_PUBLIC_KEY: '30a7f23efa613db7572381c8097f2d73', // -> Reemplaza con tu public key
  EPAYCO_TEST: true, // true en pruebas, false en producción
  CURRENCY: 'COP',
  COUNTRY: 'CO',
  // URL que recibe el POST de confirmación (sheetdb / make / endpoint que guardará la info automaticamente)
  API_URL: 'https://sheetdb.io/api/v1/vsp6002zg2sm3',
  // URL donde el cliente verá el resultado (GitHub Pages)
  RESPONSE_URL: 'https://tu-usuario.github.io/tu-repo/public/respuesta.html'
};
