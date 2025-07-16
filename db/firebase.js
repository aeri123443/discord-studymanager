const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require(path.join(__basedir, 'serviceAccountKey.json'));

// Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestore 인스턴스 가져오기
const db = admin.firestore();

console.log('📌 Firebase Admin SDK, Firestore 초기화 완료');

module.exports = db;
