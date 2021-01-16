import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyC1yFSVaa0LQ1T3bIR0QRQbC0bBxThTU4I",
    authDomain: "vue-app-83c21.firebaseapp.com",
    projectId: "vue-app-83c21",
    storageBucket: "vue-app-83c21.appspot.com",
    messagingSenderId: "924582148334",
    appId: "1:924582148334:web:41a429579ba3491f19dbff"
}

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')


const categoriesCollection = db.collection('categories')


// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  categoriesCollection
}