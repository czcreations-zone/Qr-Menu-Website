
/*
=========================================================
CZ MENU PLATFORM
Menu Item Editor
File:
js/admin/menu-editor.js

Purpose:
Centralized menu-item editor state and form handling.

This file does NOT directly contain Firebase logic.
Database operations are supplied by js/firebase/database.js.
=========================================================
*/


let currentMenuItem =
    null;

let currentCategories =
    [];


export function initializeMenuEditor(
    options = {}
) {

    currentCategories =
        Array.isArray(
            options.categories
        )
            ? options.categories
            : [];


    populateCategorySelect();

    initializePriceMode();

    initializePriceVariants();

    initializeImagePreview();

    initializeFoodType();

    initializeEditorForm();

}


// =========================================================
// OPEN
// =========================================================

export function openMenuEditor(
    item = null
) {

    currentMenuItem =
        item;


    const modal =
        document.getElementById(
            "menu-editor-modal"
        );


    const title =
        document.getElementById(
            "menu-editor-title"
        );


    const form =
        document.getElementById(
            "menu-item-form"
        );


    if (
        !modal ||
        !form
    ) {
        return;
    }


    resetForm();


    if (item) {

        if (title) {

            title.textContent =
                "Edit Menu Item";

        }


        populateItem(
            item
        );

    }

    else {

        if (title) {

            title.textContent =
                "Add Menu Item";

        }

    }


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            document
                .getElementById(
                    "menu-item-name"
                )
                ?.focus();

        },
        50
    );

}


// =========================================================
// CLOSE
// =========================================================

export function closeMenuEditor() {

    const modal =
        document.getElementById(
            "menu-editor-modal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    currentMenuItem =
        null;

}


// =========================================================
// CATEGORIES
// =========================================================

export function setEditorCategories(
    categories
) {

    currentCategories =
        Array.isArray(
            categories
        )
            ? categories
            : [];


    populateCategorySelect();

}


function populateCategorySelect() {

    const select =
        document.getElementById(
            "menu-item-category"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            [SELECT CATEGORY]
        </option>

    `;


    currentCategories
        .filter(
            category =>
                category.active !== false
        )
        .forEach(
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


// =========================================================
// RESET
// =========================================================

function resetForm() {

    const form =
        document.getElementById(
            "menu-item-form"
        );


    if (form) {

        form.reset();

    }


    document.getElementById(
        "menu-item-id"
    ).value =
        "";


    document.getElementById(
        "menu-item-available"
    ).checked =
        true;


    document.getElementById(
        "single-price-field"
    ).hidden =
        false;


    document.getElementById(
        "price-variants-field"
    ).hidden =
        true;


    document.getElementById(
        "price-variants-list"
    ).innerHTML =
        "";


    clearEditorMessage();


    clearErrors();


    hideImagePreview();


    updateChoiceStyles();

}


// =========================================================
// POPULATE ITEM
// =========================================================

function populateItem(
    item
) {

    setValue(
        "menu-item-id",
        item.id
    );


    setValue(
        "menu-item-name",
        item.name
    );


    setValue(
        "menu-item-category",
        item.categoryId
    );


    setValue(
        "menu-item-description",
        item.description
    );


    setValue(
        "menu-item-price",
        item.price
    );


    setValue(
        "menu-item-image",
        item.image
    );


    document.getElementById(
        "menu-item-available"
    ).checked =
        item.available !== false;


    const foodType =
        item.foodType ===
        "non-veg"
            ? "non-veg"
            : "veg";


    const foodRadio =
        document.querySelector(
            `input[name="foodType"][value="${foodType}"]`
        );


    if (foodRadio) {

        foodRadio.checked =
            true;

    }


    const variants =
        Array.isArray(
            item.priceVariants
        )
            ? item.priceVariants
            : [];


    if (variants.length) {

        const variantRadio =
            document.querySelector(
                'input[name="priceMode"][value="variants"]'
            );


        if (variantRadio) {

            variantRadio.checked =
                true;

        }


        renderPriceVariants(
            variants
        );

    }

    else {

        const singleRadio =
            document.querySelector(
                'input[name="priceMode"][value="single"]'
            );


        if (singleRadio) {

            singleRadio.checked =
                true;

        }

    }


    updatePriceMode();

    updateChoiceStyles();

    updateImagePreview();

}


// =========================================================
// PRICE MODE
// =========================================================

function initializePriceMode() {

    document
        .querySelectorAll(
            'input[name="priceMode"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        updatePriceMode();

                        updateChoiceStyles();

                    }
                );

            }
        );

}


function updatePriceMode() {

    const mode =
        document.querySelector(
            'input[name="priceMode"]:checked'
        )?.value ||
        "single";


    const single =
        document.getElementById(
            "single-price-field"
        );


    const variants =
        document.getElementById(
            "price-variants-field"
        );


    if (
        mode ===
        "variants"
    ) {

        single.hidden =
            true;

        variants.hidden =
            false;


        const list =
            document.getElementById(
                "price-variants-list"
            );


        if (
            list &&
            !list.children.length
        ) {

            addPriceVariant();

        }

    }

    else {

        single.hidden =
            false;

        variants.hidden =
            true;

    }

}


// =========================================================
// PRICE VARIANTS
// =========================================================

function initializePriceVariants() {

    document
        .getElementById(
            "add-price-variant"
        )
        ?.addEventListener(
            "click",
            () => {

                addPriceVariant();

            }
        );

}


function addPriceVariant(
    variant = null
) {

    const list =
        document.getElementById(
            "price-variants-list"
        );


    if (!list) {
        return;
    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "price-variant-row";


    row.innerHTML = `

        <input
            type="text"
            class="price-variant-name"
            placeholder="[VARIANT NAME]"
            value="${escapeAttribute(
                variant?.name ||
                ""
            )}"
        >


        <input
            type="number"
            class="price-variant-price"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="[PRICE]"
            value="${escapeAttribute(
                variant?.price ??
                ""
            )}"
        >


        <button
            type="button"
            class="
                admin-icon-button
                is-danger
            "
            data-remove-price-variant
            aria-label="Remove price"
        >
            ×
        </button>

    `;


    row
        .querySelector(
            "[data-remove-price-variant]"
        )
        ?.addEventListener(
            "click",
            () => {

                row.remove();

            }
        );


    list.appendChild(
        row
    );

}


function renderPriceVariants(
    variants
) {

    const list =
        document.getElementById(
            "price-variants-list"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        "";


    variants.forEach(
        variant => {

            addPriceVariant(
                variant
            );

        }
    );

}


function getPriceVariants() {

    return Array
        .from(
            document.querySelectorAll(
                ".price-variant-row"
            )
        )
        .map(
            row => {

                return {

                    name:
                        row
                            .querySelector(
                                ".price-variant-name"
                            )
                            ?.value
                            .trim() ||
                        "",

                    price:
                        Number(
                            row
                                .querySelector(
                                    ".price-variant-price"
                                )
                                ?.value ||
                            0
                        )

                };

            }
        )
        .filter(
            variant =>
                variant.name
        );

}


// =========================================================
// IMAGE
// =========================================================

function initializeImagePreview() {

    const input =
        document.getElementById(
            "menu-item-image"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        updateImagePreview
    );

    document
        .getElementById(
            "menu-item-image-file"
        )
        ?.addEventListener(
            "change",
            previewSelectedMenuFile
        );

}


function updateImagePreview() {

    const input =
        document.getElementById(
            "menu-item-image"
        );


    const preview =
        document.getElementById(
            "menu-item-image-preview"
        );


    const image =
        document.getElementById(
            "menu-item-image-preview-img"
        );


    if (
        !input ||
        !preview ||
        !image
    ) {
        return;
    }


    const url =
        input.value.trim();


    if (!url) {

        hideImagePreview();

        return;

    }


    image.src =
        url;


    image.onload =
        () => {

            preview.hidden =
                false;

        };


    image.onerror =
        hideImagePreview;

}


function previewSelectedMenuFile() {

    const input =
        document.getElementById(
            "menu-item-image-file"
        );

    const image =
        document.getElementById(
            "menu-item-image-preview-img"
        );

    const preview =
        document.getElementById(
            "menu-item-image-preview"
        );

    const file = input?.files?.[0];

    if (!file || !image || !preview) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        hideImagePreview();
        return;
    }

    const url = URL.createObjectURL(file);
    image.onload = () => URL.revokeObjectURL(url);
    image.src = url;
    preview.hidden = false;

}


function hideImagePreview() {

    const preview =
        document.getElementById(
            "menu-item-image-preview"
        );


    if (preview) {

        preview.hidden =
            true;

    }

}


// =========================================================
// FOOD TYPE
// =========================================================

function initializeFoodType() {

    document
        .querySelectorAll(
            'input[name="foodType"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    updateChoiceStyles
                );

            }
        );

}


function updateChoiceStyles() {

    document
        .querySelectorAll(
            ".admin-choice-card"
        )
        .forEach(
            card => {

                const radio =
                    card.querySelector(
                        "input"
                    );


                card.classList.toggle(
                    "is-selected",
                    radio?.checked === true
                );

            }
        );

}


// =========================================================
// FORM
// =========================================================

function initializeEditorForm() {

    const form =
        document.getElementById(
            "menu-item-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const data =
                collectMenuItemData();


            const errors =
                validateMenuItem(
                    data
                );


            if (errors.length) {

                showEditorErrors(
                    errors
                );

                return;

            }


            clearErrors();

            clearEditorMessage();


            document.dispatchEvent(
                new CustomEvent(
                    "cz:menu-item-submit",
                    {
                        detail: {
                            data,
                            item: currentMenuItem
                        }
                    }
                )
            );

        }
    );


    document
        .querySelectorAll(
            "[data-menu-modal-close]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    closeMenuEditor
                );

            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                const modal =
                    document.getElementById(
                        "menu-editor-modal"
                    );


                if (
                    modal &&
                    !modal.hidden
                ) {

                    closeMenuEditor();

                }

            }

        }
    );

}


// =========================================================
// COLLECT
// =========================================================

function collectMenuItemData() {

    const mode =
        document.querySelector(
            'input[name="priceMode"]:checked'
        )?.value ||
        "single";


    const data = {

        id:
            getValue(
                "menu-item-id"
            ) ||
            null,

        name:
            getValue(
                "menu-item-name"
            ),

        categoryId:
            getValue(
                "menu-item-category"
            ),

        description:
            getValue(
                "menu-item-description"
            ),

        foodType:
            document.querySelector(
                'input[name="foodType"]:checked'
            )?.value ||
            "veg",

        available:
            document.getElementById(
                "menu-item-available"
            )?.checked !== false,

        priceMode:
            mode,

        price:
            mode === "single"
                ? Number(
                    getValue(
                        "menu-item-price"
                    ) ||
                    0
                )
                : null,

        priceVariants:
            mode === "variants"
                ? getPriceVariants()
                : [],

        image:
            getValue(
                "menu-item-image"
            ),

        imageFile:
            document.getElementById(
                "menu-item-image-file"
            )?.files?.[0] ||
            null

    };


    return data;

}


// =========================================================
// VALIDATION
// =========================================================

function validateMenuItem(
    data
) {

    const errors = [];


    if (!data.name) {

        errors.push({
            field: "name",
            message:
                "[ITEM NAME REQUIRED MESSAGE]"
        });

    }


    if (!data.categoryId) {

        errors.push({
            field: "category",
            message:
                "[CATEGORY REQUIRED MESSAGE]"
        });

    }


    if (
        data.priceMode ===
        "single"
    ) {

        if (
            !Number.isFinite(
                data.price
            ) ||
            data.price < 0
        ) {

            errors.push({
                field: "price",
                message:
                    "[VALID PRICE REQUIRED MESSAGE]"
            });

        }

    }


    if (
        data.priceMode ===
        "variants"
    ) {

        if (
            !data.priceVariants.length
        ) {

            errors.push({
                field: "price",
                message:
                    "[PRICE VARIANT REQUIRED MESSAGE]"
            });

        }


        data.priceVariants.forEach(
            variant => {

                if (
                    !Number.isFinite(
                        variant.price
                    ) ||
                    variant.price < 0
                ) {

                    errors.push({
                        field: "price",
                        message:
                            "[VALID VARIANT PRICE MESSAGE]"
                    });

                }

            }
        );

    }


    return errors;

}


// =========================================================
// ERROR UI
// =========================================================

function showEditorErrors(
    errors
) {

    clearErrors();


    errors.forEach(
        error => {

            const id =
                error.field ===
                "category"
                    ? "menu-item-category-error"
                    : error.field ===
                        "price"
                        ? "menu-item-form-message"
                        : "menu-item-name-error";


            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    error.message;

                if (
                    id ===
                    "menu-item-form-message"
                ) {

                    element.hidden =
                        false;

                    element.dataset.type =
                        "error";

                }

            }

        }
    );

}


function clearErrors() {

    document
        .querySelectorAll(
            ".form-error"
        )
        .forEach(
            element => {

                element.textContent =
                    "";

            }
        );

}


function clearEditorMessage() {

    const element =
        document.getElementById(
            "menu-item-form-message"
        );


    if (!element) {
        return;
    }


    element.hidden =
        true;


    element.textContent =
        "";

}


// =========================================================
// HELPERS
// =========================================================

function getValue(
    id
) {

    return (
        document
            .getElementById(
                id
            )
            ?.value
            ?.trim() ||
        ""
    );

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ??
            "";

    }

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
