let loadingElement = null;

export function showLoading(
    message = "Loading..."
) {
    if (loadingElement) {
        return;
    }

    loadingElement =
        document.createElement("div");

    loadingElement.className =
        "loading-overlay";

    loadingElement.setAttribute(
        "aria-live",
        "polite"
    );

    loadingElement.innerHTML = `
        <div
            class="loading-content"
            role="status"
        >
            <div class="loading-spinner"></div>

            <p>
                ${message}
            </p>
        </div>
    `;

    document.body.appendChild(
        loadingElement
    );
}

export function hideLoading() {
    if (!loadingElement) {
        return;
    }

    loadingElement.remove();

    loadingElement = null;
}
