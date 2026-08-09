/*
=========================================================
CZ MENU PLATFORM
Restaurant Home Page
File:
js/restaurant/home.js
=========================================================
*/

import {
    initializeRestaurant,
    renderRestaurantHeader,
    renderRestaurantFooter
} from "./restaurant.js";


import {
    buildRestaurantUrl,
    initializeRestaurantNavigation
} from "../core/navigation.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const restaurant =
            await initializeRestaurant();


        if (!restaurant) {
            return;
        }


        renderHomePage(
            restaurant
        );


        initializeRestaurantNavigation();

    }
);


// ---------------------------------------------------------
// RENDER HOME PAGE
// ---------------------------------------------------------

function renderHomePage(
    restaurant
) {

    renderRestaurantHeader(
        restaurant
    );


    renderRestaurantFooter(
        restaurant
    );


    const home =
        restaurant.home || {};


    const homeImage =
        document.getElementById(
            "restaurant-home-image"
        );


    const title =
        document.getElementById(
            "home-title"
        );


    const description =
        document.getElementById(
            "home-description"
        );


    const aboutTitle =
        document.getElementById(
            "restaurant-about-title"
        );


    const aboutDescription =
        document.getElementById(
            "restaurant-about-description"
        );


    if (homeImage) {

        homeImage.src =
            restaurant.homeImage ||
            "/assets/images/placeholders/restaurant-home.svg";

        homeImage.alt =
            restaurant.name;

    }


    if (title) {

        title.textContent =
            home.title ||
            "[RESTAURANT HOME TITLE]";

    }


    if (description) {

        description.textContent =
            home.description ||
            "[RESTAURANT HOME DESCRIPTION]";

    }


    if (aboutTitle) {

        aboutTitle.textContent =
            home.aboutTitle ||
            "[ABOUT RESTAURANT TITLE]";

    }


    if (aboutDescription) {

        aboutDescription.textContent =
            home.aboutDescription ||
            "[ABOUT RESTAURANT DESCRIPTION]";

    }


    renderHighlights(
        restaurant.highlights
    );


    initializeHomeButtons();

}


// ---------------------------------------------------------
// HIGHLIGHTS
// ---------------------------------------------------------

function renderHighlights(
    highlights = []
) {

    const positions = [

        "one",

        "two",

        "three"

    ];


    positions.forEach(
        (position, index) => {

            const element =
                document.getElementById(
                    `restaurant-highlight-${position}`
                );


            if (!element) {
                return;
            }


            const item =
                highlights[index];


            if (!item) {

                element.style.display =
                    "none";

                return;

            }


            element.innerHTML = `

                <div
                    class="icon-box"
                    aria-hidden="true"
                >
                    ${
                        item.icon ||
                        "✦"
                    }
                </div>

                <h3>
                    ${
                        item.title ||
                        "[HIGHLIGHT TITLE]"
                    }
                </h3>

                <p>
                    ${
                        item.description ||
                        "[HIGHLIGHT DESCRIPTION]"
                    }
                </p>

            `;

        }
    );

}


// ---------------------------------------------------------
// HOME BUTTONS
// ---------------------------------------------------------

function initializeHomeButtons() {

    document
        .querySelectorAll(
            "[data-open-menu]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            buildRestaurantUrl(
                                "menu"
                            );

                    }
                );

            }
        );

}
