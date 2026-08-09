/*
=========================================================
CZ MENU PLATFORM
Restaurant Themes
File:
js/restaurant/theme.js

Three original visual themes inspired by:
- Social / conversational layouts
- Story / media-forward layouts
- Camera / playful layouts

They do NOT copy branding, logos, UI assets or
proprietary visual identities.
=========================================================
*/


export const RESTAURANT_THEMES = {

    "theme-1": {

        id: "theme-1",

        name: "[THEME 1 NAME]",

        description:
            "[THEME 1 DESCRIPTION]",

        className:
            "restaurant-theme-1"

    },


    "theme-2": {

        id: "theme-2",

        name: "[THEME 2 NAME]",

        description:
            "[THEME 2 DESCRIPTION]",

        className:
            "restaurant-theme-2"

    },


    "theme-3": {

        id: "theme-3",

        name: "[THEME 3 NAME]",

        description:
            "[THEME 3 DESCRIPTION]",

        className:
            "restaurant-theme-3"

    }

};


// ---------------------------------------------------------
// APPLY THEME
// ---------------------------------------------------------

export function applyRestaurantTheme(
    themeId
) {

    const theme =
        RESTAURANT_THEMES[
            themeId
        ] ||
        RESTAURANT_THEMES[
            "theme-1"
        ];


    document.documentElement
        .dataset.restaurantTheme =
        theme.id;


    document.body.classList
        .remove(
            "restaurant-theme-1",
            "restaurant-theme-2",
            "restaurant-theme-3"
        );


    document.body.classList.add(
        theme.className
    );


    return theme;

}


// ---------------------------------------------------------
// GET THEME
// ---------------------------------------------------------

export function getRestaurantTheme(
    themeId
) {

    return (
        RESTAURANT_THEMES[
            themeId
        ] ||
        RESTAURANT_THEMES[
            "theme-1"
        ]
    );

}


// ---------------------------------------------------------
// GET ALL THEMES
// ---------------------------------------------------------

export function getAllRestaurantThemes() {

    return Object.values(
        RESTAURANT_THEMES
    );

}
