const axios = require('axios').default;
const FormData = require('form-data');

const formData = new FormData();
formData.append('username', 'leopaul.bretin');
formData.append('password', 'M7whDpv9GVJf');


axios.post('https://auth.fft.fr/auth/realms/master/login-actions/authenticate', formData, {
  headers: formData.getHeaders()
}).then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });