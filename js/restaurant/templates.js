/*
=========================================================
CZ MENU PLATFORM
Restaurant Templates
File:
js/restaurant/templates.js

Templates:
1. Editorial
2. Floating
3. Minimal
4. Layered

All templates use the same:
- Menu
- Home
- Contact
- Search
- Filters
- Restaurant data
- Admin data
=========================================================
*/


export const RESTAURANT_TEMPLATES = {

    "template-1": {

        id: "template-1",

        name: "[TEMPLATE 1 NAME]",

        description:
            "[TEMPLATE 1 DESCRIPTION]",

        className:
            "restaurant-template-1"

    },


    "template-2": {

        id: "template-2",

        name: "[TEMPLATE 2 NAME]",

        description:
            "[TEMPLATE 2 DESCRIPTION]",

        className:
            "restaurant-template-2"

    },


    "template-3": {

        id: "template-3",

        name: "[TEMPLATE 3 NAME]",

        description:
            "[TEMPLATE 3 DESCRIPTION]",

        className:
            "restaurant-template-3"

    },


    "template-4": {

        id: "template-4",

        name: "[TEMPLATE 4 NAME]",

        description:
            "[TEMPLATE 4 DESCRIPTION]",

        className:
            "restaurant-template-4"

    }

};


// ---------------------------------------------------------
// APPLY TEMPLATE
// ---------------------------------------------------------

export function applyRestaurantTemplate(
    templateId
) {

    const template =
        RESTAURANT_TEMPLATES[
            templateId
        ] ||
        RESTAURANT_TEMPLATES[
            "template-1"
        ];


    document.body.dataset.template =
        template.id;


    document.body.classList
        .remove(
            "restaurant-template-1",
            "restaurant-template-2",
            "restaurant-template-3",
            "restaurant-template-4"
        );


    document.body.classList.add(
        template.className
    );


    return template;

}


// ---------------------------------------------------------
// GET TEMPLATE
// ---------------------------------------------------------

export function getRestaurantTemplate(
    templateId
) {

    return (
        RESTAURANT_TEMPLATES[
            templateId
        ] ||
        RESTAURANT_TEMPLATES[
            "template-1"
        ]
    );

}


// ---------------------------------------------------------
// GET ALL TEMPLATES
// ---------------------------------------------------------

export function getAllRestaurantTemplates() {

    return Object.values(
        RESTAURANT_TEMPLATES
    );

}
