export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  DB_CONNECTION: process.env.DB_CONNECTION,
  FIREBASE_CONFIG: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    locationId: process.env.FIREBASE_LOCATION_ID,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  }
});