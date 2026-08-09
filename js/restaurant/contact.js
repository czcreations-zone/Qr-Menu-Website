/*
=========================================================
CZ MENU PLATFORM
Restaurant Contact Page
File:
js/restaurant/contact.js
=========================================================
*/

import {
    initializeRestaurant,
    renderRestaurantHeader,
    renderRestaurantFooter
} from "./restaurant.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const restaurant =
            await initializeRestaurant();


        if (!restaurant) {
            return;
        }


        renderRestaurantHeader(
            restaurant
        );


        renderRestaurantFooter(
            restaurant
        );


        renderContact(
            restaurant
        );

    }
);


// ---------------------------------------------------------
// CONTACT
// ---------------------------------------------------------

function renderContact(
    restaurant
) {

    const container =
        document.getElementById(
            "restaurant-contact-details"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <span
            class="section-label"
        >
            CONTACT
        </span>


        <h2>
            [CONTACT TITLE]
        </h2>


        <p>
            [CONTACT DESCRIPTION]
        </p>


        <div
            class="
                restaurant-contact-list
            "
        >

            ${
                restaurant.phone
                    ? renderContactCard(
                        "☎",
                        "Phone",
                        restaurant.phone,
                        `tel:${restaurant.phone}`
                    )
                    : ""
            }


            ${
                restaurant.whatsapp
                    ? renderContactCard(
                        "◇",
                        "WhatsApp",
                        restaurant.whatsapp,
                        `https://wa.me/${restaurant.whatsapp}`
                    )
                    : ""
            }


            ${
                restaurant.email
                    ? renderContactCard(
                        "@",
                        "Email",
                        restaurant.email,
                        `mailto:${restaurant.email}`
                    )
                    : ""
            }


            ${
                restaurant.address
                    ? renderContactCard(
                        "◎",
                        "Address",
                        restaurant.address,
                        null
                    )
                    : ""
            }

        </div>

    `;


    const map =
        document.getElementById(
            "restaurant-map-placeholder"
        );


    if (map) {

        map.innerHTML = `

            <div>

                <span>
                    ◎
                </span>

                <p>
                    ${
                        restaurant.address ||
                        "[RESTAURANT LOCATION]"
                    }
                </p>

            </div>

        `;

    }

}


// ---------------------------------------------------------
// CONTACT CARD
// ---------------------------------------------------------

function renderContactCard(
    icon,
    label,
    value,
    href
) {

    const content = `

        <span
            class="icon-box"
            aria-hidden="true"
        >
            ${icon}
        </span>


        <div>

            <small>
                ${label}
            </small>

            <strong>
                ${escapeHTML(
                    value
                )}
            </strong>

        </div>

    `;


    if (!href) {

        return `

            <div
                class="
                    restaurant-contact-card
                "
            >

                ${content}

            </div>

        `;

    }


    const external =
        href.startsWith(
            "https://wa.me/"
        );


    return `

        <a
            href="${escapeAttribute(
                href
            )}"
            class="
                restaurant-contact-card
            "
            ${
                external
                    ? `
                        target="_blank"
                        rel="
                            noopener
                            noreferrer
                        "
                    `
                    : ""
            }
        >

            ${content}

        </a>

    `;

}


// ---------------------------------------------------------
// ESCAPE
// ---------------------------------------------------------

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


function escapeAttribute(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}
