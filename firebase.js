import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase';
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyDsIQ8BBURWJkYJJ-Q8ih4552eLm6hX9Ng",
    authDomain: "mobile-6b27d.firebaseapp.com",
    databaseURL: "https://mobile-6b27d.firebaseio.com",
    projectId: "mobile-6b27d",
    storageBucket: "mobile-6b27d.appspot.com",
    messagingSenderId: "533056623528",
    appId: "1:533056623528:web:028a504268483b4667839d"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

// export const fb = firebase.initializeApp(config)
// export const db = fb.database()
// export const productRef = db.ref('pizza')
	
	
