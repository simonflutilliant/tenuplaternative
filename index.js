const axios = require('axios').default;
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');

console.log('Starting Application');

const instance = axios.create({
  timeout: 20000,
  withCredentials: true,
  //On ignore le certificat des serveurs
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});


// declare a request interceptor
/* instance.interceptors.request.use(config => {
  // perform a task before the request is sent
  console.log('XXX Request was sent XXX');
  // console.log('Config: ',config)
  console.log('XXXXXX');
  return config;
}, error => {
  // handle the error
  return Promise.reject(error);
});
*/

// Première requête pour récupérer les codes d'authentification
instance.get(
  'https://auth.fft.fr/auth/realms/master/protocol/openid-connect/auth',
  {
    params: {
      client_id: 'FED_MET',
      response_type: 'code',
      scope: 'openid',
      redirect_uri: 'https://tenup.fft.fr/user-auth/process'
    }
  }
).then(function(response) {
  // handle success
  console.log('Sucess Request 1');
  // console.log('reponse: ', response);
  // console.log('response headers: ', response.headers);

  //On récupère les cookies
  const cookie = response.headers['set-cookie'];

  //ON récupère la réponse pour en parser le contenu
  const responseData = response.data;

  //On sauvegarde le contenu de la réponse pour debug
  // console.log("Response Data: ",responseData);
  fs.writeFileSync('results/index_1.html', responseData);

  //On récupère les codes nécessaires pour la prochaine requete
  const sessionCodeIndex = responseData.indexOf('session_code');
  const sessionCode = responseData.substr(sessionCodeIndex + 13, 43)

  const tabIdIndex = responseData.indexOf('tab_id', sessionCode);
  const tabId = responseData.substr(tabIdIndex + 7, 11)

  console.log('sessionCode: ', sessionCode);
  console.log('tabId: ', tabId);
  console.log('cookie: ', cookie);

  //console.log('instance: ', instance);

  //On prépare les paramètres de la seconde requete
  const params = new URLSearchParams();
  params.append('client_id', 'FED_MET');
  params.append('session_code', sessionCode);
  params.append('execution', 'ed0c10f7-09ad-4f60-b84c-42267412a435');
  params.append('tab_id', tabId);

  //console.log("params: ", params.toString())

  //Lancement de la seconde requete avec les parametres d'authenification non pas en JSON mais en content classiqe
  return instance.post(
    'https://auth.fft.fr/auth/realms/master/login-actions/authenticate?' + params.toString(),
    'username=frensymega&password=' + encodeURIComponent('Tenup_2022!')
    , {
      headers: {
        'cookie': cookie
      }
    }
  ).then(function(response2) {

    console.log('Sucess Request 2');
    // console.log('reponse: ', response2);
    const cookie2 = response.headers['set-cookie'];
    console.log('Cookie2: ', cookie2)

    // On récupère et sauvegarde la seconde réponse
    const responseData2 = response2.data;
    //console.log("Response Data: ",responseData2);
    fs.writeFileSync('results/index_2.html', responseData2);
    //console.log("File written ");


  }).catch(function(error2) {
    // Gestion d'erreur seconde requete
    console.log('Error response 2');
    console.log('Error response 2: ', error2);



  })
}).catch(function(error) {
  // Gestion d'erreur première requete
  console.log('Error response 1: ', error);
}).then(function() {
  // Quand tout est fini !
  console.log('Program finished')
});