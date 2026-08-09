/*
=========================================================
CZ MENU PLATFORM
Cloudinary Image Utilities
=========================================================
*/

import {
    CLOUDINARY_CONFIG
}
from
    "./config.js";


export function createImageUrl(
    publicId,
    transformations = ""
) {

    if (!publicId) {

        return "";

    }


    const base =
        `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;


    if (
        transformations
    ) {

        return (
            `${base}/${transformations}/${publicId}`
        );

    }


    return (
        `${base}/${publicId}`
    );

}


export function optimizedImageUrl(
    publicId,
    width = 1200
) {

    return createImageUrl(
        publicId,
        [
            `f_auto`,
            `q_auto`,
            `c_limit`,
            `w_${Math.max(
                100,
                Number(width) || 1200
            )}`
        ].join(
            ","
        )
    );

}


export function thumbnailUrl(
    publicId,
    width = 500,
    height = 500
) {

    return createImageUrl(
        publicId,
        [
            `f_auto`,
            `q_auto`,
            `c_fill`,
            `w_${Math.max(
                100,
                Number(width) || 500
            )}`,
            `h_${Math.max(
                100,
                Number(height) || 500
            )}`
        ].join(
            ","
        )
    );

}


export function avatarUrl(
    publicId,
    size = 300
) {

    const safeSize =
        Math.max(
            100,
            Number(size) || 300
        );


    return createImageUrl(
        publicId,
        [
            "f_auto",
            "q_auto",
            "c_fill",
            `w_${safeSize}`,
            `h_${safeSize}`,
            "r_max"
        ].join(
            ","
        )
    );

}
