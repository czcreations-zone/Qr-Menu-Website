
/*
=========================================================
CZ MENU PLATFORM
Firebase Initialization
File:
js/firebase/init.js
=========================================================
*/

import {
    initializeApp,
    getApps,
    getApp
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


import {
    getAuth
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    getFirestore
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


import firebaseConfig from "../config/firebase.js";


const firebaseApp =
    getApps().length
        ? getApp()
        : initializeApp(
            firebaseConfig
        );


const firebaseAuth =
    getAuth(
        firebaseApp
    );


const firestore =
    getFirestore(
        firebaseApp
    );


export {
    firebaseApp,
    firebaseAuth,
    firestore
};
