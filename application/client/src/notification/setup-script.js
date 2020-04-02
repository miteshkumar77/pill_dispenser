'use strict';

const pushServerPublicKey = 'BDvQD1LxhycVHPPbmBD3BE2L7b7LE3VE9XO-o6NmCjs1D1XqKb6vCczdE671TvQlkLe2eupqXSbxO1bksiajfEE';
let isSubscribed = false;
let swRegistration = null;

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js')
    .then((swReg) => {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg; 
    })
    .catch(function(error) {
        console.error('Service Worker Error', error);
    });
} else {
    console.warn('Push messaging is not supported');
}