# CZ Menu Platform

Static HTML/CSS/JavaScript restaurant menu platform using Firebase Authentication/Firestore and Cloudinary for image storage and delivery.

## Editable content
Central public-site content lives in `js/config/`. Restaurant/demo content lives in `js/data/`.

## Firebase
Firebase configuration is in `js/config/firebase.js`. Authentication and Firestore are initialized in `js/firebase/init.js`.

## Images
Cloudinary configuration is in `js/cloudinary/config.js`. Do not put a Cloudinary API secret in frontend code.

## Hosting
Deploy the repository with Firebase Hosting using the existing `firebase.json`.
