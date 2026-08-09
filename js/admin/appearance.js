/*
=========================================================
CZ MENU PLATFORM
Restaurant Appearance Management
File:
js/admin/appearance.js

Responsibilities:
- Load centralized templates
- Load centralized themes
- Display selectable cards
- Save restaurant appearance settings
- Manage branding
- Manage display preferences
- Preview device size

Theme/template definitions remain centralized in:

js/config/themes.js
js/config/templates.js

Firebase operations remain centralized in:

js/firebase/database.js
=========================================================
*/


import {
    uploadRestaurantLogo,
    uploadRestaurantCover,
    validateImageFile
} from "../firebase/storage.js";

let availableThemes = [];

let availableTemplates = [];

let appearanceSettings = {

    templateId:
        "",

    themeId:
        "",

    logo:
        "",

    coverImage:
        "",

    display:
        {

            description:
                true,

            contact:
                true,

            hours:
                true,

            itemImages:
                true

        }

};


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeForms();

        initializeDevicePreview();

        await loadAppearance();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadAppearance() {

    await loadConfiguration();

    await loadRestaurantAppearance();

    renderTemplates();

    renderThemes();

    populateBranding();

    populateDisplaySettings();

}


// =========================================================
// CONFIGURATION
// =========================================================

async function loadConfiguration() {

    try {

        const templatesModule =
            await import(
                "../config/templates.js"
            );


        const themesModule =
            await import(
                "../config/themes.js"
            );


        availableTemplates =
            getExportedArray(
                templatesModule,
                [
                    "restaurantTemplates",
                    "templates",
                    "TEMPLATES"
                ]
            );


        availableThemes =
            getExportedArray(
                themesModule,
                [
                    "restaurantThemes",
                    "themes",
                    "THEMES"
                ]
            );

    }

    catch (error) {

        console.error(
            "Appearance configuration loading failed:",
            error
        );


        availableTemplates =
            [];

        availableThemes =
            [];

    }

}


function getExportedArray(
    module,
    names
) {

    for (
        const name of names
    ) {

        if (
            Array.isArray(
                module[name]
            )
        ) {

            return module[name];

        }

    }


    return [];

}


// =========================================================
// FIREBASE DATA
// =========================================================

async function loadRestaurantAppearance() {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.getCurrentRestaurant !==
            "function"
        ) {

            return;

        }


        const restaurant =
            await database.getCurrentRestaurant();


        if (
            restaurant?.appearance
        ) {

            appearanceSettings = {

                ...appearanceSettings,

                ...restaurant.appearance,

                display:
                    {

                        ...appearanceSettings.display,

                        ...(
                            restaurant
                                .appearance
                                .display ||
                            {}
                        )

                    }

            };

        }

    }

    catch (error) {

        console.error(
            "Appearance loading failed:",
            error
        );

    }

}


// =========================================================
// TEMPLATE UI
// =========================================================

function renderTemplates() {

    const container =
        document.getElementById(
            "template-grid"
        );


    if (!container) {
        return;
    }


    if (!availableTemplates.length) {

        container.innerHTML =
            createUnavailableState(
                "[TEMPLATE DATA UNAVAILABLE]"
            );

        return;

    }


    container.innerHTML =
        availableTemplates
            .map(
                template =>
                    renderTemplateCard(
                        template
                    )
            )
            .join("");


    container
        .querySelectorAll(
            "[data-template-id]"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectTemplate(
                            card.dataset.templateId
                        );

                    }
                );

            }
        );


    updateTemplateSelection();

}


function renderTemplateCard(
    template
) {

    const selected =
        template.id ===
        appearanceSettings.templateId;


    const preview =
        template.previewImage ||
        template.image ||
        "";


    return `

        <button
            type="button"
            class="
                admin-template-card
                ${selected
                    ? "is-selected"
                    : ""}
            "
            data-template-id="${escapeAttribute(
                template.id
            )}"
        >

            <div
                class="
                    admin-template-card__preview
                "
            >

                ${
                    preview
                        ? `
                            <img
                                src="${escapeAttribute(
                                    preview
                                )}"
                                alt="${escapeAttribute(
                                    template.name ||
                                    "[TEMPLATE PREVIEW]"
                                )}"
                                loading="lazy"
                            >
                          `
                        : `
                            <div
                                class="
                                    admin-template-card__placeholder
                                "
                            >
                                ✦
                            </div>
                          `
                }

            </div>


            <div
                class="
                    admin-template-card__content
                "
            >

                <div>

                    <strong>
                        ${escapeHTML(
                            template.name ||
                            "[TEMPLATE NAME]"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            template.description ||
                            "[TEMPLATE DESCRIPTION]"
                        )}
                    </span>

                </div>


                <span
                    class="
                        admin-selection-indicator
                    "
                >
                    ${selected
                        ? "✓"
                        : ""}
                </span>

            </div>

        </button>

    `;

}


function selectTemplate(
    id
) {

    appearanceSettings.templateId =
        id;


    updateTemplateSelection();

    showToast(
        "[TEMPLATE SELECTED MESSAGE]",
        "info"
    );

}


function updateTemplateSelection() {

    document
        .querySelectorAll(
            "[data-template-id]"
        )
        .forEach(
            card => {

                const selected =
                    card.dataset.templateId ===
                    appearanceSettings.templateId;


                card.classList.toggle(
                    "is-selected",
                    selected
                );


                const indicator =
                    card.querySelector(
                        ".admin-selection-indicator"
                    );


                if (indicator) {

                    indicator.textContent =
                        selected
                            ? "✓"
                            : "";

                }

            }
        );

}


// =========================================================
// THEME UI
// =========================================================

function renderThemes() {

    const container =
        document.getElementById(
            "theme-grid"
        );


    if (!container) {
        return;
    }


    if (!availableThemes.length) {

        container.innerHTML =
            createUnavailableState(
                "[THEME DATA UNAVAILABLE]"
            );

        return;

    }


    container.innerHTML =
        availableThemes
            .map(
                theme =>
                    renderThemeCard(
                        theme
                    )
            )
            .join("");


    container
        .querySelectorAll(
            "[data-theme-id]"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectTheme(
                            card.dataset.themeId
                        );

                    }
                );

            }
        );


    updateThemeSelection();

}


function renderThemeCard(
    theme
) {

    const selected =
        theme.id ===
        appearanceSettings.themeId;


    const colors =
        theme.colors ||
        {};


    return `

        <button
            type="button"
            class="
                admin-theme-card
                ${selected
                    ? "is-selected"
                    : ""}
            "
            data-theme-id="${escapeAttribute(
                theme.id
            )}"
        >

            <div
                class="
                    admin-theme-card__visual
                "
                style="
                    --theme-primary:
                        ${escapeAttribute(
                            colors.primary ||
                            "#777777"
                        )};

                    --theme-secondary:
                        ${escapeAttribute(
                            colors.secondary ||
                            "#AAAAAA"
                        )};

                    --theme-accent:
                        ${escapeAttribute(
                            colors.accent ||
                            "#FFFFFF"
                        )};
                "
            >

                <span></span>
                <span></span>
                <span></span>

            </div>


            <div
                class="
                    admin-theme-card__content
                "
            >

                <div>

                    <strong>
                        ${escapeHTML(
                            theme.name ||
                            "[THEME NAME]"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            theme.description ||
                            "[THEME DESCRIPTION]"
                        )}
                    </span>

                </div>


                <span
                    class="
                        admin-selection-indicator
                    "
                >
                    ${selected
                        ? "✓"
                        : ""}
                </span>

            </div>

        </button>

    `;

}


function selectTheme(
    id
) {

    appearanceSettings.themeId =
        id;


    updateThemeSelection();

    showToast(
        "[THEME SELECTED MESSAGE]",
        "info"
    );

}


function updateThemeSelection() {

    document
        .querySelectorAll(
            "[data-theme-id]"
        )
        .forEach(
            card => {

                const selected =
                    card.dataset.themeId ===
                    appearanceSettings.themeId;


                card.classList.toggle(
                    "is-selected",
                    selected
                );


                const indicator =
                    card.querySelector(
                        ".admin-selection-indicator"
                    );


                if (indicator) {

                    indicator.textContent =
                        selected
                            ? "✓"
                            : "";

                }

            }
        );

}


// =========================================================
// BRANDING
// =========================================================

function initializeForms() {

    const branding =
        document.getElementById(
            "appearance-branding-form"
        );


    const display =
        document.getElementById(
            "appearance-display-form"
        );


    branding?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            await saveBranding();

        }
    );


    display?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveDisplaySettings();

        }
    );


    document
        .getElementById(
            "save-appearance-button"
        )
        ?.addEventListener(
            "click",
            saveAppearance
        );


    document
        .getElementById(
            "restaurant-logo"
        )
        ?.addEventListener(
            "input",
            updateImagePreview
        );


    document
        .getElementById(
            "restaurant-cover"
        )
        ?.addEventListener(
            "input",
            updateImagePreview
        );


    document
        .getElementById(
            "restaurant-logo-file"
        )
        ?.addEventListener(
            "change",
            () => previewSelectedFile("restaurant-logo-file", "logo-preview")
        );


    document
        .getElementById(
            "restaurant-cover-file"
        )
        ?.addEventListener(
            "change",
            () => previewSelectedFile("restaurant-cover-file", "cover-preview")
        );

}


function populateBranding() {

    setValue(
        "restaurant-logo",
        appearanceSettings.logo
    );


    setValue(
        "restaurant-cover",
        appearanceSettings.coverImage
    );


    updateImagePreview();

}


async function saveBranding() {

    const database =
        await import(
            "../firebase/database.js"
        );

    const restaurant =
        await database.getCurrentRestaurant();

    if (!restaurant?.id) {
        showToast(
            "[RESTAURANT NOT FOUND MESSAGE]",
            "error"
        );
        return;
    }

    try {

        const logoFile =
            document.getElementById(
                "restaurant-logo-file"
            )?.files?.[0];

        const coverFile =
            document.getElementById(
                "restaurant-cover-file"
            )?.files?.[0];

        if (logoFile) {

            const validation =
                validateImageFile(logoFile);

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            setUploadProgress(
                "restaurant-logo-upload-progress",
                "[UPLOADING LOGO] 0%",
                false
            );

            const result =
                await uploadRestaurantLogo(
                    logoFile,
                    restaurant.id,
                    {
                        onProgress: progress =>
                            setUploadProgress(
                                "restaurant-logo-upload-progress",
                                `[UPLOADING LOGO] ${progress}%`,
                                false
                            )
                    }
                );

            appearanceSettings.logo =
                result.secureUrl;

            appearanceSettings.logoPublicId =
                result.publicId;

            setValue(
                "restaurant-logo",
                result.secureUrl
            );

            setUploadProgress(
                "restaurant-logo-upload-progress",
                "[LOGO UPLOAD COMPLETE]",
                false
            );

        } else {

            appearanceSettings.logo =
                getValue(
                    "restaurant-logo"
                );

        }


        if (coverFile) {

            const validation =
                validateImageFile(coverFile);

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            setUploadProgress(
                "restaurant-cover-upload-progress",
                "[UPLOADING COVER] 0%",
                false
            );

            const result =
                await uploadRestaurantCover(
                    coverFile,
                    restaurant.id,
                    {
                        onProgress: progress =>
                            setUploadProgress(
                                "restaurant-cover-upload-progress",
                                `[UPLOADING COVER] ${progress}%`,
                                false
                            )
                    }
                );

            appearanceSettings.coverImage =
                result.secureUrl;

            appearanceSettings.coverImagePublicId =
                result.publicId;

            setValue(
                "restaurant-cover",
                result.secureUrl
            );

            setUploadProgress(
                "restaurant-cover-upload-progress",
                "[COVER UPLOAD COMPLETE]",
                false
            );

        } else {

            appearanceSettings.coverImage =
                getValue(
                    "restaurant-cover"
                );

        }

        updateImagePreview();

        showToast(
            "[BRANDING CHANGES READY MESSAGE]",
            "success"
        );

    } catch (error) {

        console.error(
            "Branding image upload failed:",
            error
        );

        showToast(
            error.message ||
            "[BRANDING UPLOAD ERROR MESSAGE]",
            "error"
        );

    }

}


function previewSelectedFile(
    inputId,
    imageId
) {

    const file =
        document.getElementById(
            inputId
        )?.files?.[0];

    const image =
        document.getElementById(
            imageId
        );

    if (!file || !image) {
        return;
    }

    const validation =
        validateImageFile(file);

    if (!validation.valid) {
        showToast(validation.error, "error");
        return;
    }

    const url =
        URL.createObjectURL(file);

    image.onload = () =>
        URL.revokeObjectURL(url);

    image.src = url;

    document.getElementById(
        "branding-preview"
    )?.removeAttribute("hidden");

}


function setUploadProgress(
    id,
    message,
    hidden = false
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent = message;
    element.hidden = hidden;

}


// =========================================================
// IMAGE PREVIEW
// =========================================================

function updateImagePreview() {

    const logo =
        getValue(
            "restaurant-logo"
        );


    const cover =
        getValue(
            "restaurant-cover"
        );


    const wrapper =
        document.getElementById(
            "branding-preview"
        );


    const logoImage =
        document.getElementById(
            "logo-preview"
        );


    const coverImage =
        document.getElementById(
            "cover-preview"
        );


    if (
        logoImage &&
        logo
    ) {

        logoImage.src =
            logo;

    }


    if (
        coverImage &&
        cover
    ) {

        coverImage.src =
            cover;

    }


    if (wrapper) {

        wrapper.hidden =
            !logo &&
            !cover;

    }

}


// =========================================================
// DISPLAY SETTINGS
// =========================================================

function populateDisplaySettings() {

    const display =
        appearanceSettings.display ||
        {};


    setChecked(
        "show-description",
        display.description !== false
    );


    setChecked(
        "show-contact",
        display.contact !== false
    );


    setChecked(
        "show-hours",
        display.hours !== false
    );


    setChecked(
        "show-item-images",
        display.itemImages !== false
    );

}


function saveDisplaySettings() {

    appearanceSettings.display = {

        description:
            isChecked(
                "show-description"
            ),

        contact:
            isChecked(
                "show-contact"
            ),

        hours:
            isChecked(
                "show-hours"
            ),

        itemImages:
            isChecked(
                "show-item-images"
            )

    };


    showToast(
        "[DISPLAY SETTINGS READY MESSAGE]",
        "success"
    );

}


// =========================================================
// SAVE ALL
// =========================================================

async function saveAppearance() {

    await saveBranding();

    saveDisplaySettings();


    if (
        !appearanceSettings.templateId
    ) {

        showToast(
            "[SELECT TEMPLATE MESSAGE]",
            "error"
        );

        return;

    }


    if (
        !appearanceSettings.themeId
    ) {

        showToast(
            "[SELECT THEME MESSAGE]",
            "error"
        );

        return;

    }


    const button =
        document.getElementById(
            "save-appearance-button"
        );


    const original =
        button?.textContent ||
        "Save Changes";


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "[SAVING TEXT]";

    }


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.updateCurrentRestaurant !==
            "function"
        ) {

            throw new Error(
                "appearance-update-not-configured"
            );

        }


        await database.updateCurrentRestaurant(
            {
                appearance:
                    appearanceSettings
            }
        );


        showToast(
            "[APPEARANCE SAVED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Appearance save failed:",
            error
        );


        showToast(
            "[APPEARANCE SAVE ERROR MESSAGE]",
            "error"
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                original;

        }

    }

}


// =========================================================
// DEVICE PREVIEW
// =========================================================

function initializeDevicePreview() {

    document
        .querySelectorAll(
            "[data-device]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setPreviewDevice(
                            button.dataset.device
                        );

                    }
                );

            }
        );

}


function setPreviewDevice(
    device
) {

    const frame =
        document.getElementById(
            "appearance-preview-frame"
        );


    if (!frame) {
        return;
    }


    frame.classList.toggle(
        "is-mobile",
        device ===
        "mobile"
    );


    frame.classList.toggle(
        "is-desktop",
        device ===
        "desktop"
    );


    document
        .querySelectorAll(
            "[data-device]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.device ===
                    device
                );

            }
        );

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

            overlay.hidden =
                true;

        }

    }


    menu?.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "is-open"
            );


            if (overlay) {

                overlay.hidden =
                    false;

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
            value ||
            "";

    }

}


function setChecked(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.checked =
            Boolean(
                value
            );

    }

}


function isChecked(
    id
) {

    return (
        document
            .getElementById(
                id
            )
            ?.checked ===
        true
    );

}


function createUnavailableState(
    message
) {

    return `

        <div
            class="
                admin-empty-state
                glass
            "
        >

            <div>
                ✦
            </div>

            <h3>
                [CONFIGURATION TITLE]
            </h3>

            <p>
                ${escapeHTML(
                    message
                )}
            </p>

        </div>

    `;

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


function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "appearance-toast"
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
        window.CZAppearanceToastTimer
    );


    window.CZAppearanceToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}
