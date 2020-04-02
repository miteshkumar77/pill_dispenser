import React, { Component } from 'react';



class Notification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publicVapidKey: this.props.pubKey
        }
    }


    registerServiceWorker = () => {
        console.log('Registering Service Worker...');
        const path = require('path');
        const url = require('url');
        let swScope = path.join(__dirname, '/');
        let swPath = url.format({
            pathname: path.join(__dirname, 'public/worker.js'),
            protocol: 'localhost:3000',
            slashes: false
        });

        console.log(swScope, swPath);
        return navigator.serviceWorker.register(`${swPath}`, { scope: `${swScope}` })
            .then((registration) => {
                console.error('Registration successful, scope is:', registration.scope);
            })
            .catch((error) => {
                console.error('Service worker registration failed, error:', error);
            });


        // navigator.serviceWorker.register('/public/sw.js')
        // .then((registration) => {
        //     console.log('Service Worker successfully registered: ', registration);
        //     return registration;
        // })
        // .catch((err) => {
        //     console.error('Unable to register service worker.', err);
        // });
    }

    componentDidMount() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Notifications not availible in this browser.');
            return;
        }
        console.log('Notifications available!');
        const registration = this.registerServiceWorker();


    }

    render() {
        return null;
    }

}



function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export default Notification; 