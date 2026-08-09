/*
=========================================================
CZ MENU PLATFORM
Restaurant Menu Management
File:
js/admin/menu.js

Responsibilities:
- Load menu items
- Load categories
- Search
- Filters
- Add item
- Edit item
- Delete item
- Toggle availability
- Connect editor
- Publish menu

Firebase implementation stays inside:
js/firebase/database.js
=========================================================
*/

import {
    uploadMenuImage,
    validateImageFile
} from "../firebase/storage.js";


import {
    initializeMenuEditor,
    openMenuEditor,
    closeMenuEditor,
    setEditorCategories
} from "./menu-editor.js";


let menuItems = [];

let categories = [];

let filteredItems = [];


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeMenuControls();

        initializeEditor();

        await loadMenuData();

    }
);


// =========================================================
// LOAD DATA
// =========================================================

async function loadMenuData() {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.getCurrentCategories ===
            "function"
        ) {

            categories =
                await database.getCurrentCategories() ||
                [];

        }


        if (
            typeof database.getCurrentMenuItems ===
            "function"
        ) {

            menuItems =
                await database.getCurrentMenuItems() ||
                [];

        }


        setEditorCategories(
            categories
        );


        populateCategoryFilter();


        filteredItems =
            [...menuItems];


        renderMenu();

        updateSummary();

    }

    catch (error) {

        console.error(
            "Menu loading failed:",
            error
        );


        menuItems =
            [];

        categories =
            [];

        filteredItems =
            [];


        renderMenu();

        updateSummary();


        showToast(
            "[MENU LOAD ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// EDITOR
// =========================================================

function initializeEditor() {

    initializeMenuEditor({
        categories
    });


    document.addEventListener(
        "cz:menu-item-submit",
        async event => {

            await saveMenuItem(
                event.detail.data
            );

        }
    );


    document
        .getElementById(
            "add-menu-item-button"
        )
        ?.addEventListener(
            "click",
            () => {

                openMenuEditor();

            }
        );


    document
        .getElementById(
            "empty-add-menu-item"
        )
        ?.addEventListener(
            "click",
            () => {

                openMenuEditor();

            }
        );

}


// =========================================================
// SAVE ITEM
// =========================================================

async function saveMenuItem(
    data
) {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );

        const restaurant =
            await database.getCurrentRestaurant();

        if (!restaurant?.id) {
            throw new Error(
                "[RESTAURANT NOT FOUND MESSAGE]"
            );
        }

        if (data.imageFile) {

            const validation =
                validateImageFile(
                    data.imageFile
                );

            if (!validation.valid) {
                throw new Error(
                    validation.error
                );
            }

            const progress =
                document.getElementById(
                    "menu-item-image-upload-progress"
                );

            if (progress) {
                progress.hidden = false;
                progress.textContent =
                    "[UPLOADING IMAGE] 0%";
            }

            const result =
                await uploadMenuImage(
                    data.imageFile,
                    restaurant.id,
                    {
                        onProgress: value => {
                            if (progress) {
                                progress.hidden = false;
                                progress.textContent =
                                    `[UPLOADING IMAGE] ${value}%`;
                            }
                        }
                    }
                );

            data.image =
                result.secureUrl;

            data.imagePublicId =
                result.publicId;

            delete data.imageFile;

            if (progress) {
                progress.textContent =
                    "[IMAGE UPLOAD COMPLETE]";
            }

        } else {
            delete data.imageFile;
        }

        if (data.id) {

            if (
                typeof database.updateMenuItem !==
                "function"
            ) {
                throw new Error(
                    "menu-update-not-configured"
                );
            }

            await database.updateMenuItem(
                data.id,
                data
            );

            showToast(
                "[MENU ITEM UPDATED MESSAGE]",
                "success"
            );

        } else {

            if (
                typeof database.createMenuItem !==
                "function"
            ) {
                throw new Error(
                    "menu-create-not-configured"
                );
            }

            await database.createMenuItem(
                data
            );

            showToast(
                "[MENU ITEM CREATED MESSAGE]",
                "success"
            );
        }

        closeMenuEditor();
        await loadMenuData();

    }
    catch (error) {

        console.error(
            "Menu item save failed:",
            error
        );

        showToast(
            error.message ||
            "[MENU ITEM SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// FILTER CONTROLS
// =========================================================

function initializeMenuControls() {

    const search =
        document.getElementById(
            "menu-search"
        );


    const category =
        document.getElementById(
            "menu-category-filter"
        );


    const diet =
        document.getElementById(
            "menu-diet-filter"
        );


    const status =
        document.getElementById(
            "menu-status-filter"
        );


    search?.addEventListener(
        "input",
        applyFilters
    );


    category?.addEventListener(
        "change",
        applyFilters
    );


    diet?.addEventListener(
        "change",
        applyFilters
    );


    status?.addEventListener(
        "change",
        applyFilters
    );


    document
        .getElementById(
            "clear-menu-filters"
        )
        ?.addEventListener(
            "click",
            clearFilters
        );

}


function populateCategoryFilter() {

    const select =
        document.getElementById(
            "menu-category-filter"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="all">
            [ALL CATEGORIES LABEL]
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.id;


            option.textContent =
                category.name ||
                "[CATEGORY NAME]";


            select.appendChild(
                option
            );

        }
    );

}


function applyFilters() {

    const search =
        (
            document
                .getElementById(
                    "menu-search"
                )
                ?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const category =
        document
            .getElementById(
                "menu-category-filter"
            )
            ?.value ||
        "all";


    const diet =
        document
            .getElementById(
                "menu-diet-filter"
            )
            ?.value ||
        "all";


    const status =
        document
            .getElementById(
                "menu-status-filter"
            )
            ?.value ||
        "all";


    filteredItems =
        menuItems.filter(
            item => {

                const name =
                    (
                        item.name ||
                        ""
                    )
                        .toLowerCase();


                const description =
                    (
                        item.description ||
                        ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(
                        search
                    ) ||
                    description.includes(
                        search
                    );


                const matchesCategory =
                    category ===
                    "all" ||
                    item.categoryId ===
                    category;


                const matchesDiet =
                    diet ===
                    "all" ||
                    item.foodType ===
                    diet;


                const matchesStatus =
                    status ===
                    "all" ||
                    (
                        status ===
                        "available"
                            ? item.available !== false
                            : item.available === false
                    );


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesDiet &&
                    matchesStatus
                );

            }
        );


    renderMenu();

}


function clearFilters() {

    const search =
        document.getElementById(
            "menu-search"
        );


    const category =
        document.getElementById(
            "menu-category-filter"
        );


    const diet =
        document.getElementById(
            "menu-diet-filter"
        );


    const status =
        document.getElementById(
            "menu-status-filter"
        );


    if (search) {
        search.value = "";
    }


    if (category) {
        category.value = "all";
    }


    if (diet) {
        diet.value = "all";
    }


    if (status) {
        status.value = "all";
    }


    filteredItems =
        [...menuItems];


    renderMenu();

}


// =========================================================
// RENDER MENU
// =========================================================

function renderMenu() {

    const container =
        document.getElementById(
            "menu-items-list"
        );


    const empty =
        document.getElementById(
            "menu-empty-state"
        );


    const noResults =
        document.getElementById(
            "menu-no-results"
        );


    if (
        !container ||
        !empty ||
        !noResults
    ) {
        return;
    }


    container.innerHTML =
        "";


    if (!menuItems.length) {

        empty.hidden =
            false;

        noResults.hidden =
            true;

        return;

    }


    empty.hidden =
        true;


    if (!filteredItems.length) {

        noResults.hidden =
            false;

        return;

    }


    noResults.hidden =
        true;


    container.innerHTML =
        filteredItems
            .map(
                item =>
                    renderMenuItem(
                        item
                    )
            )
            .join("");


    bindMenuItemActions();

}


// =========================================================
// MENU ITEM CARD
// =========================================================

function renderMenuItem(
    item
) {

    const category =
        categories.find(
            category =>
                category.id ===
                item.categoryId
        );


    const categoryName =
        category?.name ||
        "[CATEGORY]";


    const available =
        item.available !== false;


    const foodType =
        item.foodType ===
        "non-veg"
            ? "non-veg"
            : "veg";


    const image =
        item.image ||
        "";


    const priceText =
        getPriceText(
            item
        );


    return `

        <article
            class="
                admin-menu-item
                glass
                ${available
                    ? ""
                    : "is-unavailable"}
            "
            data-item-id="${escapeHTML(
                item.id ||
                ""
            )}"
        >

            <div
                class="
                    admin-menu-item__image
                "
            >

                ${
                    image
                        ? `
                            <img
                                src="${escapeAttribute(
                                    image
                                )}"
                                alt="${escapeAttribute(
                                    item.name ||
                                    "[MENU ITEM]"
                                )}"
                                loading="lazy"
                            >
                          `
                        : `
                            <div
                                class="
                                    admin-menu-item__placeholder
                                "
                            >
                                ◎
                            </div>
                          `
                }

            </div>


            <div
                class="
                    admin-menu-item__content
                "
            >

                <div
                    class="
                        admin-menu-item__heading
                    "
                >

                    <div>

                        <h3>
                            ${escapeHTML(
                                item.name ||
                                "[ITEM NAME]"
                            )}
                        </h3>


                        <div
                            class="
                                admin-menu-item__meta
                            "
                        >

                            <span>
                                ${escapeHTML(
                                    categoryName
                                )}
                            </span>


                            <span
                                class="
                                    food-indicator
                                    ${
                                        foodType ===
                                        "veg"
                                            ? "food-indicator--veg"
                                            : "food-indicator--nonveg"
                                    }
                                "
                            ></span>


                            <span>
                                ${
                                    foodType ===
                                    "veg"
                                        ? "Veg"
                                        : "Non-Veg"
                                }
                            </span>

                        </div>

                    </div>


                    <span
                        class="
                            admin-menu-item__status
                            ${
                                available
                                    ? "is-available"
                                    : "is-unavailable"
                            }
                        "
                    >
                        ${
                            available
                                ? "Available"
                                : "Unavailable"
                        }
                    </span>

                </div>


                ${
                    item.description
                        ? `
                            <p>
                                ${escapeHTML(
                                    item.description
                                )}
                            </p>
                          `
                        : ""
                }


                <div
                    class="
                        admin-menu-item__bottom
                    "
                >

                    <strong
                        class="
                            admin-menu-item__price
                        "
                    >
                        ${escapeHTML(
                            priceText
                        )}
                    </strong>


                    <div
                        class="
                            admin-menu-item__actions
                        "
                    >

                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-edit-menu-item
                            data-id="${escapeAttribute(
                                item.id ||
                                ""
                            )}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="admin-icon-button"
                            data-toggle-menu-item
                            data-id="${escapeAttribute(
                                item.id ||
                                ""
                            )}"
                        >
                            ${
                                available
                                    ? "Unavailable"
                                    : "Available"
                            }
                        </button>


                        <button
                            type="button"
                            class="
                                admin-icon-button
                                is-danger
                            "
                            data-delete-menu-item
                            data-id="${escapeAttribute(
                                item.id ||
                                ""
                            )}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        </article>

    `;

}


// =========================================================
// PRICE DISPLAY
// =========================================================

function getPriceText(
    item
) {

    const variants =
        Array.isArray(
            item.priceVariants
        )
            ? item.priceVariants
            : [];


    if (variants.length) {

        return variants
            .map(
                variant =>
                    `${variant.name}: ${formatPrice(
                        variant.price
                    )}`
            )
            .join(" • ");

    }


    return formatPrice(
        item.price
    );

}


function formatPrice(
    price
) {

    const number =
        Number(
            price
        );


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "[PRICE]";

    }


    return `₹${number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    )}`;

}


// =========================================================
// ACTIONS
// =========================================================

function bindMenuItemActions() {

    document
        .querySelectorAll(
            "[data-edit-menu-item]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            menuItems.find(
                                menuItem =>
                                    menuItem.id ===
                                    button.dataset.id
                            );


                        if (item) {

                            openMenuEditor(
                                item
                            );

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-toggle-menu-item]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await toggleAvailability(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-menu-item]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteMenuItem(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// =========================================================
// AVAILABILITY
// =========================================================

async function toggleAvailability(
    id
) {

    const item =
        menuItems.find(
            menuItem =>
                menuItem.id ===
                id
        );


    if (!item) {
        return;
    }


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.updateMenuItem !==
            "function"
        ) {

            throw new Error(
                "menu-update-not-configured"
            );

        }


        await database.updateMenuItem(
            id,
            {
                available:
                    item.available === false
            }
        );


        await loadMenuData();


        showToast(
            "[AVAILABILITY UPDATED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[AVAILABILITY UPDATE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// DELETE
// =========================================================

async function deleteMenuItem(
    id
) {

    const item =
        menuItems.find(
            menuItem =>
                menuItem.id ===
                id
        );


    if (!item) {
        return;
    }


    const confirmed =
        window.confirm(
            "[MENU ITEM DELETE CONFIRMATION MESSAGE]"
        );


    if (!confirmed) {
        return;
    }


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.deleteMenuItem !==
            "function"
        ) {

            throw new Error(
                "menu-delete-not-configured"
            );

        }


        await database.deleteMenuItem(
            id
        );


        await loadMenuData();


        showToast(
            "[MENU ITEM DELETED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[MENU ITEM DELETE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// SUMMARY
// =========================================================

function updateSummary() {

    const available =
        menuItems.filter(
            item =>
                item.available !== false
        ).length;


    const unavailable =
        menuItems.length -
        available;


    setText(
        "menu-total-count",
        menuItems.length
    );


    setText(
        "menu-available-count",
        available
    );


    setText(
        "menu-unavailable-count",
        unavailable
    );


    setText(
        "menu-category-count",
        categories.length
    );

}


// =========================================================
// PUBLISH
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById(
                "publish-menu-button"
            )
            ?.addEventListener(
                "click",
                publishMenu
            );

    }
);


async function publishMenu() {

    const button =
        document.getElementById(
            "publish-menu-button"
        );


    if (!button) {
        return;
    }


    const original =
        button.textContent;


    button.disabled =
        true;


    button.textContent =
        "[PUBLISHING TEXT]";


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.publishRestaurantWebsite !==
            "function"
        ) {

            throw new Error(
                "publish-not-configured"
            );

        }


        await database.publishRestaurantWebsite();


        showToast(
            "[MENU PUBLISH SUCCESS MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Menu publish failed:",
            error
        );


        showToast(
            "[MENU PUBLISH ERROR MESSAGE]",
            "error"
        );

    }

    finally {

        button.disabled =
            false;

        button.textContent =
            original;

    }

}


// =========================================================
// NAVIGATION
// =========================================================

function initializeNavigation() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    const overlay =
        document.getElementById(
            "admin-sidebar-overlay"
        );


    const menu =
        document.getElementById(
            "admin-menu-button"
        );


    const close =
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


    menu?.addEventListener(
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


    close?.addEventListener(
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
// TOAST
// =========================================================

function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "menu-toast"
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
        window.CZMenuToastTimer
    );


    window.CZMenuToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}


// =========================================================
// HELPERS
// =========================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value ?? "";


    return element.innerHTML;

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
