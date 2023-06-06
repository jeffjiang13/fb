importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA_ZHzp7P760fCmy_r40qyVp-4pVyKaV_g",
  authDomain: "facebook-81c3c.firebaseapp.com",
  projectId: "facebook-81c3c",
  storageBucket: "facebook-81c3c.appspot.com",
  messagingSenderId: "1094313014969",
  appId: "1:1094313014969:web:8c3805f3068e0a284f8d68",
  measurementId: "G-9C907QG2NB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  //   self.registration.showNotification(notificationTitle, notificationOptions);
});
