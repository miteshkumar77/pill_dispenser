import React, { Component } from 'react';


class Notification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publicVapidKey: props.pubKey,
            isSubscribed: false,
            swRegistration: null
        };
    }

    serviceWorkersPushMessagingSupported = () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');
            navigator.serviceWorker.register('../serviceWorker.js')
            .then((swReg) => {
                console.log('Service Worker is registered', swReg);

                this.setState({ swRegistration: swReg }); 
            })
            .catch((error) => {
                console.error('Service Worker Error', error);
            });
        } else {
            console.warn('Push messaging is not supported'); 
        }
    }


    render() {

    }

}

export default Notification; 