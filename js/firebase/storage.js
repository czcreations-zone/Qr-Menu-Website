/*
=========================================================
CZ MENU PLATFORM
CENTRAL IMAGE STORAGE ADAPTER
=========================================================

IMAGE STORAGE PROVIDER:
Cloudinary

FIREBASE:
Authentication + Firestore only

IMPORTANT:
- Actual image files are stored in Cloudinary.
- Firestore stores image URLs / public IDs / metadata.
- Firebase Storage is NOT used for restaurant images.
- Cloudinary secrets must never be placed in frontend code.

This file acts as the central storage interface so the
rest of the application does not need to know the storage
provider.

Architecture:

Admin / Restaurant
        ↓
firebase/storage.js
        ↓
js/cloudinary/
        ↓
Cloudinary
        ↓
Image URL + Public ID
        ↓
Firestore
=========================================================
*/


import {
    uploadImage as uploadCloudinaryImage
}
from
    "../cloudinary/upload.js";


import {
    optimizedImageUrl,
    thumbnailUrl,
    avatarUrl,
    createImageUrl
}
from
    "../cloudinary/image.js";


// =========================================================
// GENERAL IMAGE UPLOAD
// =========================================================

/**
 * Upload any image to Cloudinary.
 *
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function uploadImage(
    file,
    options = {}
) {

    if (!file) {

        throw new Error(
            "[NO IMAGE SELECTED]"
        );

    }


    return uploadCloudinaryImage(
        file,
        options
    );

}


// =========================================================
// RESTAURANT IMAGE UPLOAD
// =========================================================

/**
 * Upload an image belonging to a restaurant.
 *
 * Recommended Cloudinary structure:
 *
 * cz-menu/
 *   restaurants/
 *     RESTAURANT_ID/
 *       logo/
 *       cover/
 *       menu/
 *       category/
 *       gallery/
 *       general/
 *
 * @param {File} file
 * @param {String} restaurantId
 * @param {String} category
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function uploadRestaurantImage(
    file,
    restaurantId,
    category = "general",
    options = {}
) {

    if (!file) {

        throw new Error(
            "[NO IMAGE SELECTED]"
        );

    }


    if (!restaurantId) {

        throw new Error(
            "[RESTAURANT ID REQUIRED]"
        );

    }


    const safeCategory =
        String(
            category ||
            "general"
        )
            .trim()
            .toLowerCase()
            .replace(
                /[^a-z0-9_-]/g,
                "-"
            );


    const folder =
        options.folder ||
        `cz-menu/restaurants/${restaurantId}/${safeCategory}`;


    return uploadCloudinaryImage(
        file,
        {

            ...options,

            folder

        }
    );

}


// =========================================================
// RESTAURANT LOGO
// =========================================================

/**
 * Upload restaurant logo.
 */
export async function uploadRestaurantLogo(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "logo",
        options
    );

}


// =========================================================
// RESTAURANT COVER
// =========================================================

/**
 * Upload restaurant cover image.
 */
export async function uploadRestaurantCover(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "cover",
        options
    );

}


// =========================================================
// MENU IMAGE
// =========================================================

/**
 * Upload a menu item image.
 */
export async function uploadMenuImage(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "menu",
        options
    );

}


// =========================================================
// CATEGORY IMAGE
// =========================================================

/**
 * Upload a category image.
 */
export async function uploadCategoryImage(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "category",
        options
    );

}


// =========================================================
// GALLERY IMAGE
// =========================================================

/**
 * Upload a restaurant gallery image.
 */
export async function uploadGalleryImage(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "gallery",
        options
    );

}


// =========================================================
// GENERAL RESTAURANT IMAGE
// =========================================================

/**
 * Upload a general restaurant image.
 */
export async function uploadGeneralRestaurantImage(
    file,
    restaurantId,
    options = {}
) {

    return uploadRestaurantImage(
        file,
        restaurantId,
        "general",
        options
    );

}


// =========================================================
// IMAGE URL
// =========================================================

/**
 * Generate an optimized Cloudinary image URL.
 *
 * Accepts either:
 *
 * - Cloudinary public ID
 * - Cloudinary result object
 * - Existing URL
 */
export function getImageUrl(
    image,
    width = 1200
) {

    const publicId =
        getPublicId(
            image
        );


    if (!publicId) {

        return getStoredImageUrl(
            image
        );

    }


    return optimizedImageUrl(
        publicId,
        width
    );

}


// =========================================================
// THUMBNAIL URL
// =========================================================

/**
 * Generate a thumbnail URL.
 */
export function getThumbnailUrl(
    image,
    width = 500,
    height = 500
) {

    const publicId =
        getPublicId(
            image
        );


    if (!publicId) {

        return getStoredImageUrl(
            image
        );

    }


    return thumbnailUrl(
        publicId,
        width,
        height
    );

}


// =========================================================
// AVATAR / LOGO URL
// =========================================================

/**
 * Generate a circular/square optimized avatar or logo URL.
 */
export function getAvatarUrl(
    image,
    size = 300
) {

    const publicId =
        getPublicId(
            image
        );


    if (!publicId) {

        return getStoredImageUrl(
            image
        );

    }


    return avatarUrl(
        publicId,
        size
    );

}


// =========================================================
// ORIGINAL / DIRECT CLOUDINARY URL
// =========================================================

/**
 * Generate a direct Cloudinary image URL.
 */
export function getOriginalImageUrl(
    image
) {

    const publicId =
        getPublicId(
            image
        );


    if (!publicId) {

        return getStoredImageUrl(
            image
        );

    }


    return createImageUrl(
        publicId
    );

}


// =========================================================
// IMAGE OBJECT NORMALIZATION
// =========================================================

/**
 * Normalize Cloudinary's upload response into one
 * predictable object for Firestore.
 */
export function normalizeImageResult(
    result
) {

    if (!result) {

        return {

            url:
                "",

            secureUrl:
                "",

            publicId:
                "",

            resourceType:
                "image",

            format:
                "",

            width:
                0,

            height:
                0,

            bytes:
                0

        };

    }


    return {

        url:
            result.secureUrl ||
            result.url ||
            "",

        secureUrl:
            result.secureUrl ||
            result.url ||
            "",

        publicId:
            result.publicId ||
            result.public_id ||
            "",

        resourceType:
            result.resourceType ||
            result.resource_type ||
            "image",

        format:
            result.format ||
            "",

        width:
            Number(
                result.width ||
                0
            ),

        height:
            Number(
                result.height ||
                0
            ),

        bytes:
            Number(
                result.bytes ||
                0
            )

    };

}


// =========================================================
// GET PUBLIC ID
// =========================================================

/**
 * Extract a Cloudinary public ID from:
 *
 * - public ID string
 * - Cloudinary upload result
 * - stored Firestore image object
 */
export function getPublicId(
    image
) {

    if (!image) {

        return "";

    }


    if (
        typeof image ===
        "string"
    ) {

        /*
        If this is already a Cloudinary URL,
        try to extract the public ID.
        Otherwise assume it is a public ID.
        */

        if (
            image.includes(
                "res.cloudinary.com"
            )
        ) {

            return extractPublicIdFromUrl(
                image
            );

        }


        return image;

    }


    return (
        image.publicId ||
        image.public_id ||
        ""
    );

}


// =========================================================
// STORED IMAGE URL
// =========================================================

/**
 * Safely obtain an already stored image URL.
 */
export function getStoredImageUrl(
    image
) {

    if (!image) {

        return "";

    }


    if (
        typeof image ===
        "string"
    ) {

        return image;

    }


    return (
        image.secureUrl ||
        image.secure_url ||
        image.url ||
        image.imageUrl ||
        image.imageURL ||
        ""
    );

}


// =========================================================
// IMAGE SOURCE
// =========================================================

/**
 * Return the best available source for an image.
 *
 * Priority:
 *
 * 1. Existing secure URL
 * 2. Cloudinary public ID
 * 3. Existing image URL
 */
export function resolveImageSource(
    image,
    width = 1200
) {

    if (!image) {

        return "";

    }


    const existingUrl =
        getStoredImageUrl(
            image
        );


    const publicId =
        getPublicId(
            image
        );


    if (
        publicId &&
        (
            !existingUrl ||
            existingUrl.includes(
                "res.cloudinary.com"
            )
        )
    ) {

        return optimizedImageUrl(
            publicId,
            width
        );

    }


    return existingUrl;

}


// =========================================================
// IMAGE METADATA
// =========================================================

/**
 * Create a clean Firestore-ready image object.
 */
export function createImageData(
    result,
    additionalData = {}
) {

    const normalized =
        normalizeImageResult(
            result
        );


    return {

        imageUrl:
            normalized.secureUrl,

        imagePublicId:
            normalized.publicId,

        imageFormat:
            normalized.format,

        imageWidth:
            normalized.width,

        imageHeight:
            normalized.height,

        imageBytes:
            normalized.bytes,

        ...additionalData

    };

}


// =========================================================
// VALIDATE IMAGE FILE
// =========================================================

/**
 * Basic browser-side image validation.
 *
 * This improves UX but is NOT a security boundary.
 * Cloudinary configuration and upload restrictions
 * remain authoritative.
 */
export function validateImageFile(
    file,
    options = {}
) {

    if (!file) {

        return {

            valid:
                false,

            error:
                "[NO IMAGE SELECTED]"

        };

    }


    const allowedTypes =
        options.allowedTypes ||
        [

            "image/jpeg",

            "image/png",

            "image/webp",

            "image/gif",

            "image/avif"

        ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return {

            valid:
                false,

            error:
                "[UNSUPPORTED IMAGE TYPE]"

        };

    }


    const maxSizeMB =
        Number(
            options.maxSizeMB ||
            8
        );


    const maxSize =
        maxSizeMB *
        1024 *
        1024;


    if (
        file.size >
        maxSize
    ) {

        return {

            valid:
                false,

            error:
                "[IMAGE TOO LARGE]"

        };

    }


    return {

        valid:
            true,

        error:
            ""

    };

}


// =========================================================
// DELETE
// =========================================================

/**
 * Image deletion must NOT be performed directly from
 * browser code using a Cloudinary API Secret.
 *
 * This function intentionally fails until the secure
 * deletion endpoint is connected.
 */
export async function deleteImage() {

    throw new Error(
        "[CLOUDINARY DELETE REQUIRES SECURE SERVER-SIDE ACTION]"
    );

}


// =========================================================
// DELETE RESTAURANT IMAGE
// =========================================================

export async function deleteRestaurantImage(
    image
) {

    const publicId =
        getPublicId(
            image
        );


    if (!publicId) {

        throw new Error(
            "[IMAGE PUBLIC ID REQUIRED]"
        );

    }


    return deleteImage(
        publicId
    );

}


// =========================================================
// EXTRACT PUBLIC ID FROM CLOUDINARY URL
// =========================================================

function extractPublicIdFromUrl(
    url
) {

    try {

        const parsed =
            new URL(
                url
            );


        const parts =
            parsed.pathname
                .split(
                    "/"
                )
                .filter(
                    Boolean
                );


        const uploadIndex =
            parts.indexOf(
                "upload"
            );


        if (
            uploadIndex ===
            -1
        ) {

            return "";

        }


        let publicParts =
            parts.slice(
                uploadIndex + 1
            );


        /*
        Remove Cloudinary transformation
        segments such as:

        f_auto,q_auto,w_800
        */

        if (
            publicParts.length &&
            (
                publicParts[0].includes(
                    "f_"
                ) ||
                publicParts[0].includes(
                    "q_"
                ) ||
                publicParts[0].includes(
                    "w_"
                ) ||
                publicParts[0].includes(
                    "c_"
                ) ||
                publicParts[0].includes(
                    "h_"
                )
            )
        ) {

            publicParts =
                publicParts.slice(
                    1
                );

        }


        /*
        Remove file extension.
        */

        const lastIndex =
            publicParts.length -
            1;


        if (
            lastIndex >=
            0
        ) {

            publicParts[
                lastIndex
            ] =
                publicParts[
                    lastIndex
                ].replace(
                    /\.[^/.]+$/,
                    ""
                );

        }


        return publicParts.join(
            "/"
        );

    }

    catch {

        return "";

    }

}


// =========================================================
// IMAGE FALLBACK
// =========================================================

/**
 * Attach a safe fallback to an image element.
 */
export function applyImageFallback(
    imageElement,
    fallbackUrl = ""
) {

    if (!imageElement) {

        return;

    }


    imageElement.addEventListener(
        "error",
        () => {

            if (
                fallbackUrl &&
                imageElement.src !==
                    fallbackUrl
            ) {

                imageElement.src =
                    fallbackUrl;

                return;

            }


            imageElement.removeAttribute(
                "src"
            );

            imageElement.classList.add(
                "image-load-failed"
            );

        },
        {
            once:
                true
        }
    );

}


// =========================================================
// LAZY IMAGE HELPER
// =========================================================

/**
 * Set up an image element with an optimized source.
 */
export function setImageSource(
    imageElement,
    image,
    options = {}
) {

    if (!imageElement) {

        return;

    }


    const width =
        options.width ||
        1200;


    const source =
        resolveImageSource(
            image,
            width
        );


    if (!source) {

        return;

    }


    if (
        options.alt !==
        undefined
    ) {

        imageElement.alt =
            options.alt;

    }


    if (
        options.loading
    ) {

        imageElement.loading =
            options.loading;

    }

    else {

        imageElement.loading =
            "lazy";

    }


    if (
        options.fallback
    ) {

        applyImageFallback(
            imageElement,
            options.fallback
        );

    }


    imageElement.src =
        source;

}
