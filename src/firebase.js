import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD6m63RBrFEbJl_DoOSqvwYV4Yn4K5FE1A',
  authDomain: 'slack-chat-web.firebaseapp.com',
  databaseURL: 'https://slack-chat-web.firebaseio.com',
  projectId: 'slack-chat-web',
  storageBucket: 'slack-chat-web.appspot.com',
  messagingSenderId: '644285602149',
  appId: '1:644285602149:web:8720df0e23ec2186b0e98c',
  measurementId: 'G-K80VZSYFL0',
}

firebase.initializeApp(firebaseConfig)

export default firebase
