export function setImage(
    imageElement,
    source,
    alt = ""
) {
    if (!imageElement) return;

    if (!source) {
        imageElement.removeAttribute(
            "src"
        );

        imageElement.alt = alt;

        return;
    }

    imageElement.src = source;
    imageElement.alt = alt;
}

export function createImage(
    source,
    alt = "",
    className = ""
) {
    const image =
        document.createElement("img");

    image.src = source;
    image.alt = alt;

    if (className) {
        image.className =
            className;
    }

    image.loading = "lazy";
    image.decoding = "async";

    return image;
}

export function handleImageError(
    image,
    fallback = "/assets/images/placeholders/image-placeholder.svg"
) {
    if (!image) return;

    image.addEventListener(
        "error",
        () => {
            if (
                image.dataset.fallbackApplied ===
                "true"
            ) {
                return;
            }

            image.dataset.fallbackApplied =
                "true";

            image.src = fallback;
        }
    );
}
