/*
=========================================================
CZ MENU PLATFORM
Restaurant Category Management
File:
js/admin/categories.js
=========================================================
*/

let categories = [];

let editingCategoryId = null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeModal();

        initializeCategoryForm();

        await loadCategories();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadCategories() {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.getCurrentCategories !==
            "function"
        ) {

            categories = [];

            renderCategories();

            return;

        }


        categories =
            await database.getCurrentCategories() ||
            [];


        renderCategories();

    }

    catch (error) {

        console.error(
            "Category loading failed:",
            error
        );


        categories = [];

        renderCategories();

        showToast(
            "[CATEGORY LOAD ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// RENDER
// =========================================================

function renderCategories() {

    const container =
        document.getElementById(
            "category-list"
        );


    const empty =
        document.getElementById(
            "category-empty"
        );


    const count =
        document.getElementById(
            "category-count"
        );


    if (!container) {
        return;
    }


    if (count) {

        count.textContent =
            categories.length;

    }


    if (!categories.length) {

        container.innerHTML = "";

        container.appendChild(
            createEmptyState()
        );

        return;

    }


    container.innerHTML =
        categories
            .map(
                category =>
                    renderCategory(
                        category
                    )
            )
            .join("");


    bindCategoryActions();

}


function createEmptyState() {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "admin-empty-state glass";


    element.innerHTML = `

        <div>
            ◫
        </div>

        <h3>
            [NO CATEGORY TITLE]
        </h3>

        <p>
            [NO CATEGORY DESCRIPTION]
        </p>

        <button
            type="button"
            class="btn btn-primary"
            id="empty-add-category"
        >
            + Add First Category
        </button>

    `;


    element
        .querySelector(
            "#empty-add-category"
        )
        ?.addEventListener(
            "click",
            () => openCategoryModal()
        );


    return element;

}


function renderCategory(
    category
) {

    const itemCount =
        Number(
            category.itemCount ||
            0
        );


    const active =
        category.active !== false;


    return `

        <article
            class="
                admin-category-card
                glass
            "
            data-category-id="${escapeHTML(
                category.id ||
                ""
            )}"
        >

            <div
                class="
                    admin-category-card__drag
                "
                aria-hidden="true"
            >
                ⋮⋮
            </div>


            <div
                class="
                    admin-category-card__content
                "
            >

                <div
                    class="
                        admin-category-card__title
                    "
                >

                    <h3>
                        ${escapeHTML(
                            category.name ||
                            "[CATEGORY NAME]"
                        )}
                    </h3>

                    <span
                        class="
                            admin-category-status
                            ${active
                                ? "is-active"
                                : "is-inactive"}
                        "
                    >
                        ${active
                            ? "[ACTIVE LABEL]"
                            : "[INACTIVE LABEL]"}
                    </span>

                </div>


                <p>
                    ${escapeHTML(
                        category.description ||
                        "[NO CATEGORY DESCRIPTION]"
                    )}
                </p>


                <span
                    class="
                        admin-category-card__count
                    "
                >
                    ${itemCount}
                    ${itemCount === 1
                        ? "[ITEM SINGULAR]"
                        : "[ITEM PLURAL]"}
                </span>

            </div>


            <div
                class="
                    admin-category-card__actions
                "
            >

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-edit-category
                    data-id="${escapeHTML(
                        category.id ||
                        ""
                    )}"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="admin-icon-button"
                    data-toggle-category
                    data-id="${escapeHTML(
                        category.id ||
                        ""
                    )}"
                    aria-label="Toggle category"
                >
                    ${active
                        ? "Hide"
                        : "Show"}
                </button>


                <button
                    type="button"
                    class="admin-icon-button is-danger"
                    data-delete-category
                    data-id="${escapeHTML(
                        category.id ||
                        ""
                    )}"
                    aria-label="Delete category"
                >
                    Delete
                </button>

            </div>

        </article>

    `;

}


// =========================================================
// ACTIONS
// =========================================================

function bindCategoryActions() {

    document
        .querySelectorAll(
            "[data-edit-category]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const category =
                            categories.find(
                                item =>
                                    item.id ===
                                    button.dataset.id
                            );


                        if (category) {

                            openCategoryModal(
                                category
                            );

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-toggle-category]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await toggleCategory(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-category]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteCategory(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// =========================================================
// MODAL
// =========================================================

function initializeModal() {

    document
        .getElementById(
            "add-category-button"
        )
        ?.addEventListener(
            "click",
            () => openCategoryModal()
        );


    document
        .querySelectorAll(
            "[data-modal-close]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    closeCategoryModal
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

                closeCategoryModal();

            }

        }
    );

}


function openCategoryModal(
    category = null
) {

    const modal =
        document.getElementById(
            "category-modal"
        );


    const form =
        document.getElementById(
            "category-form"
        );


    const title =
        document.getElementById(
            "category-modal-title"
        );


    if (
        !modal ||
        !form
    ) {
        return;
    }


    editingCategoryId =
        category?.id ||
        null;


    form.reset();


    document.getElementById(
        "category-id"
    ).value =
        category?.id ||
        "";


    document.getElementById(
        "category-name"
    ).value =
        category?.name ||
        "";


    document.getElementById(
        "category-description"
    ).value =
        category?.description ||
        "";


    document.getElementById(
        "category-active"
    ).checked =
        category
            ? category.active !== false
            : true;


    if (title) {

        title.textContent =
            category
                ? "Edit Category"
                : "Add Category";

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
                    "category-name"
                )
                ?.focus();

        },
        50
    );

}


function closeCategoryModal() {

    const modal =
        document.getElementById(
            "category-modal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    editingCategoryId =
        null;

}


// =========================================================
// FORM
// =========================================================

function initializeCategoryForm() {

    const form =
        document.getElementById(
            "category-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "category-name"
                    )
                    .value
                    .trim();


            if (!name) {

                document
                    .getElementById(
                        "category-name-error"
                    )
                    .textContent =
                    "[CATEGORY NAME REQUIRED MESSAGE]";

                return;

            }


            const data = {

                name,

                description:
                    document
                        .getElementById(
                            "category-description"
                        )
                        .value
                        .trim(),

                active:
                    document
                        .getElementById(
                            "category-active"
                        )
                        .checked

            };


            try {

                const database =
                    await import(
                        "../firebase/database.js"
                    );


                if (
                    editingCategoryId
                ) {

                    if (
                        typeof database.updateCategory !==
                        "function"
                    ) {

                        throw new Error(
                            "category-update-not-configured"
                        );

                    }


                    await database.updateCategory(
                        editingCategoryId,
                        data
                    );


                    showToast(
                        "[CATEGORY UPDATED MESSAGE]",
                        "success"
                    );

                }

                else {

                    if (
                        typeof database.createCategory !==
                        "function"
                    ) {

                        throw new Error(
                            "category-create-not-configured"
                        );

                    }


                    await database.createCategory(
                        data
                    );


                    showToast(
                        "[CATEGORY CREATED MESSAGE]",
                        "success"
                    );

                }


                closeCategoryModal();

                await loadCategories();

            }

            catch (error) {

                console.error(
                    "Category save failed:",
                    error
                );


                showToast(
                    "[CATEGORY SAVE ERROR MESSAGE]",
                    "error"
                );

            }

        }
    );

}


// =========================================================
// TOGGLE
// =========================================================

async function toggleCategory(
    id
) {

    const category =
        categories.find(
            item =>
                item.id === id
        );


    if (!category) {
        return;
    }


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.updateCategory !==
            "function"
        ) {

            throw new Error(
                "category-update-not-configured"
            );

        }


        await database.updateCategory(
            id,
            {
                active:
                    category.active === false
            }
        );


        await loadCategories();


        showToast(
            "[CATEGORY STATUS UPDATED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[CATEGORY STATUS ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// DELETE
// =========================================================

async function deleteCategory(
    id
) {

    const category =
        categories.find(
            item =>
                item.id === id
        );


    if (!category) {
        return;
    }


    const confirmed =
        window.confirm(
            "[CATEGORY DELETE CONFIRMATION MESSAGE]"
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
            typeof database.deleteCategory !==
            "function"
        ) {

            throw new Error(
                "category-delete-not-configured"
            );

        }


        await database.deleteCategory(
            id
        );


        await loadCategories();


        showToast(
            "[CATEGORY DELETED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[CATEGORY DELETE ERROR MESSAGE]",
            "error"
        );

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
            "categories-toast"
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
        window.CZCategoriesToastTimer
    );


    window.CZCategoriesToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}


// =========================================================
// ESCAPE
// =========================================================

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
