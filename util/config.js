const UrlConfig = {
    apiBaseUrl: 'https://api.craft-aftrip.com',
    // apiBaseUrl: 'http://127.0.0.1:8000',
    // apiBaseUrl: 'http://192.168.88.57:8000',
    adminUrl: '/admin',
};

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


export default UrlConfig;

export { UrlConfig, firebaseConfig };
