import React, { Component } from 'react';



class Notification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            publicVapidKey: this.props.pubKey,
            backEndUri: this.props.uri
        }
    }


    

    componentDidMount() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const backEndUri = this.state.backEndUri; 
            console.log('Registering Service Worker...');
            navigator.serviceWorker.register('worker.js')
            .then((registration) => {
                console.log('Service Worker Registered.');
                console.log('Registering pushManager...');
                return registration.pushManager.getSubscription()
                .then(async (subscription) => {
                    console.log('pushManager Registered.');
                    if (subscription) {
                        console.log('Subscription already exists: ',subscription); 
                        return subscription;
                    }

                    console.log('Awaiting Key...', backEndUri + '/vapidPublicKey');
                    const response = await fetch(backEndUri + '/vapidPublicKey'); 
                    const vapidPublicKey = await response.text(); 

                    console.log('key: ',vapidPublicKey); 
                    const convertedVapidKey = urlB64ToUint8Array(vapidPublicKey);

                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                });
            }).then((subscription) => {
                fetch(backEndUri + '/register', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    }, 
                    body: JSON.stringify({
                        subscription: subscription
                    })
                });
            })
            .catch( err => console.error('Error registering service worker: ', err));
        }
        
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