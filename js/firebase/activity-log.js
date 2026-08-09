/*
=========================================================
CZ MENU PLATFORM
Activity Log
File:
js/firebase/activity-log.js
=========================================================
*/

import {
    addDoc,
    getDocs,
    query,
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
    activityCollection
}
from
    "./queries.js";


import {
    getCurrentAdminRecord
}
from
    "./database.js";


// =========================================================
// CREATE ACTIVITY
// =========================================================

export async function logActivity(
    {
        type = "system",
        title = "",
        description = "",
        metadata = {}
    } = {}
) {

    const user =
        getCurrentAdmin();


    if (!user) {
        return null;
    }


    const admin =
        await getCurrentAdminRecord();


    if (
        !admin?.restaurantId
    ) {

        return null;

    }


    const reference =
        await addDoc(
            activityCollection(
                admin.restaurantId
            ),
            {

                type,

                title,

                description,

                metadata,

                userId:
                    user.uid,

                userEmail:
                    user.email ||
                    "",

                createdAt:
                    serverTimestamp()

            }
        );


    return reference.id;

}


// =========================================================
// GET ACTIVITY
// =========================================================

export async function getRestaurantActivity(
    maximum = 100
) {

    const user =
        getCurrentAdmin();


    if (!user) {
        return [];
    }


    const admin =
        await getCurrentAdminRecord();


    if (
        !admin?.restaurantId
    ) {

        return [];

    }


    const activityQuery =
        query(
            activityCollection(
                admin.restaurantId
            ),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(
                maximum
            )
        );


    const snapshot =
        await getDocs(
            activityQuery
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}
