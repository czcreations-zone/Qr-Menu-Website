export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

export function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }

    if (options.id) {
        element.id = options.id;
    }

    if (options.text !== undefined) {
        element.textContent = options.text;
    }

    if (options.html !== undefined) {
        element.innerHTML = options.html;
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    return element;
}

export function escapeHTML(value = "") {
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
}

export function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

export function getPathSegments() {
    return window.location.pathname
        .split("/")
        .filter(Boolean);
}

export function debounce(callback, delay = 300) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

export function throttle(callback, delay = 100) {
    let waiting = false;

    return (...args) => {
        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {
            waiting = false;
        }, delay);
    };
}

export function formatCurrency(
    value,
    currency = "INR"
) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return String(value);
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency
    }).format(numericValue);
}

export function formatDate(
    date,
    options = {}
) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        options
    ).format(parsedDate);
}

export function generateId(prefix = "id") {
    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return `${prefix}_${crypto.randomUUID()}`;
    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        String(email).trim()
    );
}

export function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
}

export function setText(selector, value) {
    const element = $(selector);

    if (element) {
        element.textContent =
            value ?? "";
    }

    return element;
}

export function setHTML(selector, value) {
    const element = $(selector);

    if (element) {
        element.innerHTML =
            value ?? "";
    }

    return element;
}

export function setAttribute(
    selector,
    attribute,
    value
) {
    const element = $(selector);

    if (element) {
        element.setAttribute(
            attribute,
            value
        );
    }

    return element;
}

export function safeStorageGet(
    storage,
    key
) {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
}

export function safeStorageSet(
    storage,
    key,
    value
) {
    try {
        storage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

export function safeStorageRemove(
    storage,
    key
) {
    try {
        storage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}
