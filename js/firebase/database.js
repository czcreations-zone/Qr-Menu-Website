
/*
=========================================================
CZ MENU PLATFORM
Firestore Database Layer
File:
js/firebase/database.js

This is the SINGLE DATABASE ACCESS LAYER.

Pages should NOT directly use Firestore.

HTML
  ↓
page JS
  ↓
database.js
  ↓
Firestore
=========================================================
*/

import {
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


import {
    getCurrentAdmin
}
from
    "./auth.js";


import {
    restaurantDocument,
    restaurantsCollection,
    adminsCollection,
    categoriesCollection,
    categoryDocument,
    menuCollection,
    menuDocument
}
from
    "./queries.js";


// =========================================================
// CURRENT ADMIN RECORD
// =========================================================

export async function getCurrentAdminRecord() {

    const user =
        getCurrentAdmin();


    if (!user) {
        return null;
    }


    const snapshot =
        await getDoc(
            (
                await import(
                    "./queries.js"
                )
            )
                .adminDocument(
                    user.uid
                )
        );


    if (!snapshot.exists()) {
        return null;
    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


// =========================================================
// CURRENT RESTAURANT
// =========================================================

export async function getCurrentRestaurant() {

    const user =
        getCurrentAdmin();


    if (!user) {
        return null;
    }


    const adminRecord =
        await getCurrentAdminRecord();


    if (
        !adminRecord?.restaurantId
    ) {

        return null;

    }


    const snapshot =
        await getDoc(
            restaurantDocument(
                adminRecord.restaurantId
            )
        );


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


// =========================================================
// RESTAURANT BY ID
// =========================================================

export async function getRestaurantById(
    restaurantId
) {

    if (!restaurantId) {
        return null;
    }


    const snapshot =
        await getDoc(
            restaurantDocument(
                restaurantId
            )
        );


    if (!snapshot.exists()) {
        return null;
    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


// =========================================================
// UPDATE CURRENT RESTAURANT
// =========================================================

export async function updateCurrentRestaurant(
    data
) {

    const user =
        getCurrentAdmin();


    if (!user) {

        throw new Error(
            "database/not-authenticated"
        );

    }


    const adminRecord =
        await getCurrentAdminRecord();


    if (
        !adminRecord?.restaurantId
    ) {

        throw new Error(
            "database/no-restaurant"
        );

    }


    const reference =
        restaurantDocument(
            adminRecord.restaurantId
        );


    await updateDoc(
        reference,
        {
            ...data,

            updatedAt:
                serverTimestamp()
        }
    );


    return true;

}


// =========================================================
// CREATE RESTAURANT
// =========================================================

export async function createRestaurant(
    restaurantId,
    data
) {

    if (!restaurantId) {

        throw new Error(
            "database/restaurant-id-required"
        );

    }


    await setDoc(
        restaurantDocument(
            restaurantId
        ),
        {
            ...data,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()
        },
        {
            merge:
                true
        }
    );


    return restaurantId;

}


// =========================================================
// CATEGORIES
// =========================================================

export async function getCategories(
    restaurantId
) {

    const snapshot =
        await getDocs(
            categoriesCollection(
                restaurantId
            )
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


export async function createCategory(
    restaurantId,
    data
) {

    const reference =
        await addDoc(
            categoriesCollection(
                restaurantId
            ),
            {
                ...data,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()
            }
        );


    return reference.id;

}


export async function updateCategory(
    restaurantId,
    categoryId,
    data
) {

    await updateDoc(
        categoryDocument(
            restaurantId,
            categoryId
        ),
        {
            ...data,

            updatedAt:
                serverTimestamp()
        }
    );

}


export async function deleteCategory(
    restaurantId,
    categoryId
) {

    await deleteDoc(
        categoryDocument(
            restaurantId,
            categoryId
        )
    );

}


// =========================================================
// MENU
// =========================================================

export async function getMenuItems(
    restaurantId
) {

    const snapshot =
        await getDocs(
            menuCollection(
                restaurantId
            )
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


export async function createMenuItem(
    restaurantId,
    data
) {

    const reference =
        await addDoc(
            menuCollection(
                restaurantId
            ),
            {
                ...data,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()
            }
        );


    return reference.id;

}


export async function updateMenuItem(
    restaurantId,
    itemId,
    data
) {

    await updateDoc(
        menuDocument(
            restaurantId,
            itemId
        ),
        {
            ...data,

            updatedAt:
                serverTimestamp()
        }
    );

}


export async function deleteMenuItem(
    restaurantId,
    itemId
) {

    await deleteDoc(
        menuDocument(
            restaurantId,
            itemId
        )
    );

}


// =========================================================
// PUBLISHED RESTAURANTS
// =========================================================

export async function getPublishedRestaurants() {

    const reference =
        query(
            restaurantsCollection(),
            where(
                "published",
                "==",
                true
            ),
            limit(
                100
            )
        );


    const snapshot =
        await getDocs(
            reference
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}
// =========================================================
// SUPER ADMIN — ALL RESTAURANTS
// =========================================================

export async function getAllRestaurants(
    maximum = 100
) {

    const snapshot =
        await getDocs(
            query(
                restaurantsCollection(),
                limit(maximum)
            )
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


// =========================================================
// SUPER ADMIN — SINGLE RESTAURANT
// =========================================================

export async function getRestaurant(
    restaurantId
) {

    return getRestaurantById(
        restaurantId
    );

}


// =========================================================
// SUPER ADMIN — UPDATE RESTAURANT
// =========================================================

export async function updateRestaurant(
    restaurantId,
    data
) {

    await updateDoc(
        restaurantDocument(
            restaurantId
        ),
        {
            ...data,

            updatedAt:
                serverTimestamp()
        }
    );

}


// =========================================================
// SUPER ADMIN — DELETE RESTAURANT
// =========================================================

export async function deleteRestaurant(
    restaurantId
) {

    await deleteDoc(
        restaurantDocument(
            restaurantId
        )
    );

}


// =========================================================
// SUPER ADMIN — ALL ADMINS
// =========================================================

export async function getAllAdmins(
    maximum = 100
) {

    const snapshot =
        await getDocs(
            query(
                adminsCollection(),
                limit(maximum)
            )
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


// =========================================================
// SUPER ADMIN — UPDATE ADMIN RECORD
// =========================================================

export async function updateAdminRecord(
    uid,
    data
) {

    const {
        adminDocument
    } =
        await import(
            "./queries.js"
        );


    await updateDoc(
        adminDocument(
            uid
        ),
        {
            ...data,

            updatedAt:
                serverTimestamp()
        }
    );

}


// =========================================================
// SUPER ADMIN — CREATE ADMIN RECORD
// =========================================================

export async function createAdminRecord(
    uid,
    data
) {

    const {
        adminDocument
    } =
        await import(
            "./queries.js"
        );


    await setDoc(
        adminDocument(
            uid
        ),
        {
            ...data,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()
        },
        {
            merge:
                true
        }
    );

}


// =========================================================
// SUPER ADMIN — PLATFORM STATISTICS
// =========================================================

export async function getPlatformStatistics() {

    const [
        restaurantsSnapshot,
        adminsSnapshot
    ] =
        await Promise.all(
            [

                getDocs(
                    restaurantsCollection()
                ),

                getDocs(
                    adminsCollection()
                )

            ]
        );


    const restaurants =
        restaurantsSnapshot.docs.map(
            document =>
                document.data()
        );


    const admins =
        adminsSnapshot.docs.map(
            document =>
                document.data()
        );


    return {

        totalRestaurants:
            restaurants.length,

        publishedRestaurants:
            restaurants.filter(
                restaurant =>
                    restaurant.published === true
            ).length,

        totalAdmins:
            admins.length,

        recentActivity:
            0

    };

}


// =========================================================
// SUPER ADMIN — PLATFORM ACTIVITY
// =========================================================

export async function getPlatformActivity(
    maximum = 100
) {

    const restaurants =
        await getAllRestaurants(
            100
        );


    const activityGroups =
        await Promise.all(

            restaurants.map(
                async restaurant => {

                    try {

                        const snapshot =
                            await getDocs(
                                query(
                                    activityCollection(
                                        restaurant.id
                                    ),
                                    orderBy(
                                        "createdAt",
                                        "desc"
                                    ),
                                    limit(
                                        maximum
                                    )
                                )
                            );


                        return snapshot.docs.map(
                            document => ({

                                id:
                                    document.id,

                                restaurantId:
                                    restaurant.id,

                                restaurantName:
                                    restaurant.name ||
                                    "",

                                ...document.data()

                            })
                        );

                    }

                    catch {

                        return [];

                    }

                }
            )

        );


    return activityGroups
        .flat()
        .sort(
            (
                first,
                second
            ) => {

                const firstTime =
                    first.createdAt
                        ?.toMillis?.() ||
                    0;


                const secondTime =
                    second.createdAt
                        ?.toMillis?.() ||
                    0;


                return (
                    secondTime -
                    firstTime
                );

            }
        )
        .slice(
            0,
            maximum
        );

}
// =========================================================
// PLATFORM SETTINGS
// =========================================================

export async function getPlatformSettings() {

    const {
        doc
    } =
        await import(
            "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
        );


    const reference =
        doc(
            firestore,
            "platform",
            "settings"
        );


    const snapshot =
        await getDoc(
            reference
        );


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


// =========================================================
// UPDATE PLATFORM SETTINGS
// =========================================================

export async function updatePlatformSettings(
    data
) {

    const {
        doc
    } =
        await import(
            "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
        );


    const reference =
        doc(
            firestore,
            "platform",
            "settings"
        );


    await setDoc(
        reference,
        {
            ...data,

            updatedAt:
                serverTimestamp()
        },
        {
            merge:
                true
        }
    );

}
