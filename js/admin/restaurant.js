/*
=========================================================
CZ MENU PLATFORM
Restaurant Information Management
File:
js/admin/restaurant.js
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeAdminNavigation();

        initializeBackButton();

        initializeForms();

        initializeHours();

        initializeLogout();

        await loadRestaurant();

    }
);


// =========================================================
// RESTAURANT DATA
// =========================================================

let originalRestaurantData = null;


async function loadRestaurant() {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.getCurrentRestaurant !==
            "function"
        ) {

            useEmptyRestaurantData();

            return;

        }


        const restaurant =
            await database.getCurrentRestaurant();


        originalRestaurantData =
            restaurant ||
            createEmptyRestaurant();


        populateRestaurant(
            originalRestaurantData
        );

    }

    catch (error) {

        console.error(
            "Unable to load restaurant:",
            error
        );


        useEmptyRestaurantData();

    }

}


function useEmptyRestaurantData() {

    originalRestaurantData =
        createEmptyRestaurant();


    populateRestaurant(
        originalRestaurantData
    );

}


function createEmptyRestaurant() {

    return {

        id:
            "[RESTAURANT_ID]",

        websiteId:
            "[WEBSITE_ID]",

        name:
            "",

        tagline:
            "",

        description:
            "",

        phone:
            "",

        email:
            "",

        address:
            "",

        city:
            "",

        state:
            "",

        pincode:
            "",

        mapUrl:
            "",

        hours:
            {

                monday: {
                    open: "",
                    close: "",
                    closed: false
                },

                tuesday: {
                    open: "",
                    close: "",
                    closed: false
                },

                wednesday: {
                    open: "",
                    close: "",
                    closed: false
                },

                thursday: {
                    open: "",
                    close: "",
                    closed: false
                },

                friday: {
                    open: "",
                    close: "",
                    closed: false
                },

                saturday: {
                    open: "",
                    close: "",
                    closed: false
                },

                sunday: {
                    open: "",
                    close: "",
                    closed: false
                }

            }

    };

}


// =========================================================
// POPULATE
// =========================================================

function populateRestaurant(
    restaurant
) {

    setValue(
        "restaurant-name",
        restaurant.name
    );

    setValue(
        "restaurant-tagline",
        restaurant.tagline
    );

    setValue(
        "restaurant-description",
        restaurant.description
    );

    setValue(
        "restaurant-phone",
        restaurant.phone
    );

    setValue(
        "restaurant-email",
        restaurant.email
    );

    setValue(
        "restaurant-address",
        restaurant.address
    );

    setValue(
        "restaurant-city",
        restaurant.city
    );

    setValue(
        "restaurant-state",
        restaurant.state
    );

    setValue(
        "restaurant-pincode",
        restaurant.pincode
    );

    setValue(
        "restaurant-map",
        restaurant.mapUrl
    );


    const name =
        restaurant.name ||
        "[RESTAURANT NAME]";


    setText(
        "admin-restaurant-name",
        name
    );


    const avatar =
        document.getElementById(
            "admin-restaurant-avatar"
        );


    if (avatar) {

        avatar.textContent =
            name.charAt(0)
                .toUpperCase() ||
            "R";

    }


    populateHours(
        restaurant.hours
    );

}


// =========================================================
// FORMS
// =========================================================

function initializeForms() {

    const infoForm =
        document.getElementById(
            "restaurant-info-form"
        );


    const locationForm =
        document.getElementById(
            "restaurant-location-form"
        );


    const hoursForm =
        document.getElementById(
            "restaurant-hours-form"
        );


    infoForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveBasicInformation(
                infoForm
            );

        }
    );


    locationForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveLocation(
                locationForm
            );

        }
    );


    hoursForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveHours(
                hoursForm
            );

        }
    );


    document
        .getElementById(
            "restaurant-info-reset"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    originalRestaurantData
                ) {

                    populateRestaurant(
                        originalRestaurantData
                    );

                    showToast(
                        "[RESET SUCCESS MESSAGE]",
                        "info"
                    );

                }

            }
        );

}


// =========================================================
// BASIC INFORMATION
// =========================================================

async function saveBasicInformation(
    form
) {

    const data = {

        name:
            form.name.value.trim(),

        tagline:
            form.tagline.value.trim(),

        description:
            form.description.value.trim(),

        phone:
            form.phone.value.trim(),

        email:
            form.email.value.trim()

    };


    if (!data.name) {

        showToast(
            "[RESTAURANT NAME REQUIRED MESSAGE]",
            "error"
        );

        return;

    }


    await saveRestaurantData(
        data,
        "[BASIC INFORMATION SAVED MESSAGE]"
    );

}


// =========================================================
// LOCATION
// =========================================================

async function saveLocation(
    form
) {

    const data = {

        address:
            form.address.value.trim(),

        city:
            form.city.value.trim(),

        state:
            form.state.value.trim(),

        pincode:
            form.pincode.value.trim(),

        mapUrl:
            form.mapUrl.value.trim()

    };


    await saveRestaurantData(
        data,
        "[LOCATION SAVED MESSAGE]"
    );

}


// =========================================================
// HOURS
// =========================================================

const DAYS = [

    {
        key: "monday",
        label: "Monday"
    },

    {
        key: "tuesday",
        label: "Tuesday"
    },

    {
        key: "wednesday",
        label: "Wednesday"
    },

    {
        key: "thursday",
        label: "Thursday"
    },

    {
        key: "friday",
        label: "Friday"
    },

    {
        key: "saturday",
        label: "Saturday"
    },

    {
        key: "sunday",
        label: "Sunday"
    }

];


function initializeHours() {

    const container =
        document.getElementById(
            "restaurant-hours-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        DAYS
            .map(
                day => `

                    <div
                        class="admin-hours-row"
                        data-day="${day.key}"
                    >

                        <strong>
                            ${day.label}
                        </strong>


                        <label>

                            <span>
                                Opens
                            </span>

                            <input
                                type="time"
                                data-hours-open
                            >

                        </label>


                        <label>

                            <span>
                                Closes
                            </span>

                            <input
                                type="time"
                                data-hours-close
                            >

                        </label>


                        <label
                            class="
                                admin-hours-closed
                            "
                        >

                            <input
                                type="checkbox"
                                data-hours-closed
                            >

                            <span>
                                Closed
                            </span>

                        </label>

                    </div>

                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-hours-closed]"
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    () => {

                        const row =
                            checkbox.closest(
                                "[data-day]"
                            );


                        row
                            ?.querySelectorAll(
                                "input[type='time']"
                            )
                            .forEach(
                                input => {

                                    input.disabled =
                                        checkbox.checked;

                                }
                            );

                    }
                );

            }
        );

}


function populateHours(
    hours = {}
) {

    DAYS.forEach(
        day => {

            const data =
                hours[day.key] ||
                {};


            const row =
                document.querySelector(
                    `[data-day="${day.key}"]`
                );


            if (!row) {
                return;
            }


            const open =
                row.querySelector(
                    "[data-hours-open]"
                );


            const close =
                row.querySelector(
                    "[data-hours-close]"
                );


            const closed =
                row.querySelector(
                    "[data-hours-closed]"
                );


            if (open) {
                open.value =
                    data.open || "";
            }


            if (close) {
                close.value =
                    data.close || "";
            }


            if (closed) {

                closed.checked =
                    data.closed === true;

                open.disabled =
                    closed.checked;

                close.disabled =
                    closed.checked;

            }

        }
    );

}


async function saveHours() {

    const hours = {};


    DAYS.forEach(
        day => {

            const row =
                document.querySelector(
                    `[data-day="${day.key}"]`
                );


            if (!row) {
                return;
            }


            hours[day.key] = {

                open:
                    row.querySelector(
                        "[data-hours-open]"
                    )?.value ||
                    "",

                close:
                    row.querySelector(
                        "[data-hours-close]"
                    )?.value ||
                    "",

                closed:
                    row.querySelector(
                        "[data-hours-closed]"
                    )?.checked ||
                    false

            };

        }
    );


    await saveRestaurantData(
        { hours },
        "[OPENING HOURS SAVED MESSAGE]"
    );

}


// =========================================================
// CENTRAL SAVE
// =========================================================

async function saveRestaurantData(
    data,
    successMessage
) {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.updateCurrentRestaurant !==
            "function"
        ) {

            showToast(
                "[DATABASE NOT CONNECTED MESSAGE]",
                "error"
            );

            return;

        }


        await database.updateCurrentRestaurant(
            data
        );


        originalRestaurantData = {

            ...originalRestaurantData,

            ...data

        };


        showToast(
            successMessage,
            "success"
        );

    }

    catch (error) {

        console.error(
            "Restaurant save failed:",
            error
        );


        showToast(
            "[SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// NAVIGATION
// =========================================================

function initializeAdminNavigation() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    const overlay =
        document.getElementById(
            "admin-sidebar-overlay"
        );


    const menuButton =
        document.getElementById(
            "admin-menu-button"
        );


    const closeButton =
        document.getElementById(
            "admin-sidebar-close"
        );


    function closeSidebar() {

        sidebar?.classList.remove(
            "is-open"
        );

        if (overlay) {
            overlay.hidden = true;
        }

    }


    menuButton?.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "is-open"
            );

            if (overlay) {
                overlay.hidden = false;
            }

        }
    );


    closeButton?.addEventListener(
        "click",
        closeSidebar
    );


    overlay?.addEventListener(
        "click",
        closeSidebar
    );

}


// =========================================================
// BACK
// =========================================================

function initializeBackButton() {

    document
        .getElementById(
            "admin-back-button"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    window.history.length >
                    1
                ) {

                    window.history.back();

                }
                else {

                    window.location.href =
                        "/pages/restaurant-admin/dashboard.html";

                }

            }
        );

}


// =========================================================
// LOGOUT
// =========================================================

function initializeLogout() {

    document
        .getElementById(
            "admin-logout"
        )
        ?.addEventListener(
            "click",
            async () => {

                try {

                    const auth =
                        await import(
                            "../firebase/auth.js"
                        );


                    if (
                        typeof auth.logoutAdmin ===
                        "function"
                    ) {

                        await auth.logoutAdmin();

                    }


                    window.location.href =
                        "/pages/restaurant-admin/login.html";

                }

                catch (error) {

                    console.error(
                        error
                    );

                }

            }
        );

}


// =========================================================
// HELPERS
// =========================================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {
        element.value =
            value || "";
    }

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {
        element.textContent =
            value || "";
    }

}


function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "restaurant-info-toast"
        );


    if (!toast) {
        return;
    }


    toast.hidden =
        false;

    toast.dataset.type =
        type;

    toast.textContent =
        message;


    clearTimeout(
        window.CZRestaurantToastTimer
    );


    window.CZRestaurantToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}
