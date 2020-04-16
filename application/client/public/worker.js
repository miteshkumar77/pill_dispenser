self.addEventListener('push', (event) => {
  // Keep the service worker alive until the notification is created.

  const payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
  // console.log(payload); 
  // console.log(typeof(payload)); 
  // const times = payload.times
  // const output = `it is ${day}`
  
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification('Medication Management System Notification:', {
      body: `${payload[0].name} and additional medications are being dispensed.`
    })
    
  );
});