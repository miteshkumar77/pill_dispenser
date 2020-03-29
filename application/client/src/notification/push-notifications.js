const pushServerPublicKey = 'BDvQD1LxhycVHPPbmBD3BE2L7b7LE3VE9XO-o6NmCjs1D1XqKb6vCczdE671TvQlkLe2eupqXSbxO1bksiajfEE';


function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window; 
}

async function askUserPermission() {
    return await Notification.requestPermission(); 
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('../serviceWorker.js');
}

async function createNotificationSubscription() {
    const serviceWorker = await navigator.serviceWorker.ready; 

    return await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pushServerPublicKey
    });
}

async function sendSubscriptionToBackEnd(subscription) {
    const response = await fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    });
    if (!response.ok) {
        throw new Error('Bad status code from server.');
    }
    const responseData = await response.json();
    if (!(responseData.data && responseData.data.success)) {
        throw new Error('Bad response from server.');
    }
}
