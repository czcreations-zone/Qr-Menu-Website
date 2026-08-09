
/*
=========================================================
CZ MENU PLATFORM
Firebase Authentication
File:
js/firebase/auth.js

Handles:
- Restaurant admin login
- Signup
- Logout
- Current user
- Password reset
- Password change
- Profile update
- Authentication state
=========================================================
*/

import {
    firebaseAuth
}
from
    "./init.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    onAuthStateChanged
}
from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// =========================================================
// SIGN UP
// =========================================================

export async function signupAdmin(
    email,
    password,
    displayName = ""
) {

    const credential =
        await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password
        );


    if (displayName) {

        await updateProfile(
            credential.user,
            {
                displayName
            }
        );

    }


    return credential.user;

}


// =========================================================
// LOGIN
// =========================================================

export async function loginAdmin(
    email,
    password
) {

    const credential =
        await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password
        );


    return credential.user;

}


// =========================================================
// LOGOUT
// =========================================================

export async function logoutAdmin() {

    await signOut(
        firebaseAuth
    );

}


// =========================================================
// CURRENT USER
// =========================================================

export function getCurrentAdmin() {

    return (
        firebaseAuth.currentUser ||
        null
    );

}


// =========================================================
// AUTH STATE
// =========================================================

export function observeAuth(
    callback
) {

    return onAuthStateChanged(
        firebaseAuth,
        callback
    );

}


// =========================================================
// REQUIRE AUTH
// =========================================================

export function requireAdmin(
    redirect = "/pages/restaurant-admin/login.html"
) {

    const user =
        getCurrentAdmin();


    if (!user) {

        window.location.href =
            redirect;

        return false;

    }


    return true;

}


// =========================================================
// PASSWORD RESET
// =========================================================

export async function sendAdminPasswordReset(
    email
) {

    await sendPasswordResetEmail(
        firebaseAuth,
        email
    );

}


// =========================================================
// CHANGE PASSWORD
// =========================================================

export async function changeAdminPassword(
    currentPassword,
    newPassword
) {

    const user =
        getCurrentAdmin();


    if (!user) {

        throw new Error(
            "auth/no-current-user"
        );

    }


    if (!currentPassword) {

        throw new Error(
            "auth/current-password-required"
        );

    }


    const credential =
        EmailAuthProvider.credential(
            user.email,
            currentPassword
        );


    await reauthenticateWithCredential(
        user,
        credential
    );


    await updatePassword(
        user,
        newPassword
    );

}


// =========================================================
// PROFILE
// =========================================================

export async function updateAdminProfile(
    profile
) {

    const user =
        getCurrentAdmin();


    if (!user) {

        throw new Error(
            "auth/no-current-user"
        );

    }


    await updateProfile(
        user,
        {
            displayName:
                profile.displayName ??
                user.displayName ??
                "",

            photoURL:
                profile.photoURL ??
                user.photoURL ??
                null
        }
    );


    return user;

}


// =========================================================
// EMAIL
// =========================================================

export function getCurrentAdminEmail() {

    return (
        firebaseAuth.currentUser?.email ||
        ""
    );

}
