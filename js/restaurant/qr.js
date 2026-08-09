/*
=========================================================
CZ MENU PLATFORM
Restaurant QR Utilities
File:
js/restaurant/qr.js

Purpose:
- Build restaurant menu URL
- Build restaurant home URL
- Build restaurant contact URL
- Prepare QR destination
- QR generation itself can later be connected
  to the selected QR service/library.
=========================================================
*/


import {
    getRestaurantId,
    getWebsiteId
} from "../core/utils.js";


// ---------------------------------------------------------
// BASE RESTAURANT URL
// ---------------------------------------------------------

export function getRestaurantMenuUrl() {

    return buildRestaurantUrl(
        "menu"
    );

}


// ---------------------------------------------------------
// BUILD URL
// ---------------------------------------------------------

export function buildRestaurantUrl(
    page = "menu"
) {

    const restaurantId =
        getRestaurantId();


    const websiteId =
        getWebsiteId();


    const pagePaths = {

        menu:
            "/pages/restaurant/index.html",

        home:
            "/pages/restaurant/home.html",

        contact:
            "/pages/restaurant/contact.html"

    };


    const path =
        pagePaths[page] ||
        pagePaths.menu;


    const params =
        new URLSearchParams();


    if (restaurantId) {

        params.set(
            "restaurant",
            restaurantId
        );

    }


    if (websiteId) {

        params.set(
            "website",
            websiteId
        );

    }


    const query =
        params.toString();


    return query
        ? `${path}?${query}`
        : path;

}


// ---------------------------------------------------------
// QR CONFIGURATION
// ---------------------------------------------------------

export function getQRConfiguration() {

    return {

        restaurantId:
            getRestaurantId(),

        websiteId:
            getWebsiteId(),

        destination:
            getRestaurantMenuUrl()

    };

}


// ---------------------------------------------------------
// COPY QR DESTINATION
// ---------------------------------------------------------

export async function copyQRDestination() {

    const url =
        getRestaurantMenuUrl();


    if (
        !navigator.clipboard
    ) {

        return false;

    }


    try {

        await navigator.clipboard.writeText(
            url
        );

        return true;

    }

    catch (error) {

        console.error(
            "Unable to copy QR destination:",
            error
        );

        return false;

    }

}
