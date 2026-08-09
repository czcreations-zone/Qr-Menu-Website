let toastContainer = null;

function getToastContainer() {
    if (toastContainer) {
        return toastContainer;
    }

    toastContainer =
        document.createElement("div");

    toastContainer.className =
        "toast-container";

    toastContainer.setAttribute(
        "aria-live",
        "polite"
    );

    document.body.appendChild(
        toastContainer
    );

    return toastContainer;
}

export function showToast(
    message,
    type = "info",
    duration = 3500
) {
    const container =
        getToastContainer();

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast--${type}`;

    toast.setAttribute(
        "role",
        "status"
    );

    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add(
            "is-visible"
        );
    });

    setTimeout(() => {
        toast.classList.remove(
            "is-visible"
        );

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

export function showSuccess(
    message
) {
    showToast(
        message,
        "success"
    );
}

export function showError(
    message
) {
    showToast(
        message,
        "error"
    );
}

export function showWarning(
    message
) {
    showToast(
        message,
        "warning"
    );
}

export function showInfo(
    message
) {
    showToast(
        message,
        "info"
    );
}
