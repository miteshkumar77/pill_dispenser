self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification('Medication Management System Notification:', {
      body: 'Take 1 Lisinopril at 11:00',
    })
  );
});