/*
=========================================================
CZ MENU PLATFORM
Firestore Query References
File:
js/firebase/queries.js

Central location for all Firestore collection paths.

DO NOT scatter collection names throughout HTML files.

If the database structure changes later,
update this file.
=========================================================
*/

import {
    collection,
    doc
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    firestore
}
from
    "./init.js";


// =========================================================
// COLLECTIONS
// =========================================================

export function restaurantsCollection() {

    return collection(
        firestore,
        "restaurants"
    );

}


export function adminsCollection() {

    return collection(
        firestore,
        "admins"
    );

}


export function activityCollection(
    restaurantId
) {

    return collection(
        firestore,
        "restaurants",
        restaurantId,
        "activity"
    );

}


export function categoriesCollection(
    restaurantId
) {

    return collection(
        firestore,
        "restaurants",
        restaurantId,
        "categories"
    );

}


export function menuCollection(
    restaurantId
) {

    return collection(
        firestore,
        "restaurants",
        restaurantId,
        "menu"
    );

}


// =========================================================
// DOCUMENTS
// =========================================================

export function restaurantDocument(
    restaurantId
) {

    return doc(
        firestore,
        "restaurants",
        restaurantId
    );

}


export function adminDocument(
    uid
) {

    return doc(
        firestore,
        "admins",
        uid
    );

}


export function categoryDocument(
    restaurantId,
    categoryId
) {

    return doc(
        firestore,
        "restaurants",
        restaurantId,
        "categories",
        categoryId
    );

}


export function menuDocument(
    restaurantId,
    itemId
) {

    return doc(
        firestore,
        "restaurants",
        restaurantId,
        "menu",
        itemId
    );

}
