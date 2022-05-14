const axios = require('axios').default;
const FormData = require('form-data');
const fs = require('fs');

const formData = new FormData();
formData.append('username', 'leopaul.bretin');
formData.append('password', 'M7whDpv9GVJf');


console.log('Starting Application');

const instance = axios.create({
  timeout: 2000,
  withCredentials: true
});


const params = new URLSearchParams();
params.append('client_id', 'FED_MET');
params.append('client_secret', 'e5b8acde-dee8-497a-b4f3-6418603c5947');
params.append('grant_type', 'password');
params.append('username', 'tott.bsdfdsf');
params.append('password', 'sdfsdfsdfdsf');


instance.post(
  'https://auth.fft.fr/auth/realms/master/protocol/openid-connect/token',
  params).then((response) => {
    console.log('response 1: ', response)
  }).catch((error1) => {
    console.log('Error 1: ', error1)
  })