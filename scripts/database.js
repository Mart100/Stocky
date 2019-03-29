const firebaseAdmin = require("firebase-admin")
const serviceAccount = require("../FirebaseServiceAccountKey.json")
let db

module.exports = {
  initialize() {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: "https://stocky-2ed94.firebaseio.com"
    })

    db = firebaseAdmin.firestore()

    console.log('Database Initialized')
  },
  newUser(id) {
    db.collection('users').doc(id).set({
      balance: 1000,
      stocks: {

      }
    })
  },
  getUser(id) {
    return new Promise((resolve, reject) => {
      db.collection('users').doc(id).get().then((snapshot) => {
        resolve(snapshot.data())
      }).catch(err => console.log('err: ', err))
    })
  },
  updateUser(id, to) {
    db.collection('users').doc(id).update(to)
  }
}