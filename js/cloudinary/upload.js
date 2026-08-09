/*
=========================================================
CZ MENU PLATFORM
Cloudinary Upload
=========================================================
*/

import {
    CLOUDINARY_CONFIG
}
from
    "./config.js";


export function uploadImage(
    file,
    options = {}
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (!file) {

                reject(
                    new Error(
                        "[NO IMAGE SELECTED]"
                    )
                );

                return;

            }


            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            formData.append(
                "upload_preset",
                CLOUDINARY_CONFIG.uploadPreset
            );


            if (
                options.folder
            ) {

                formData.append(
                    "folder",
                    options.folder
                );

            }


            const xhr =
                new XMLHttpRequest();


            xhr.open(
                "POST",
                CLOUDINARY_CONFIG.uploadUrl
            );


            xhr.upload.addEventListener(
                "progress",
                event => {

                    if (
                        !event.lengthComputable
                    ) {

                        return;

                    }


                    const progress =
                        Math.round(
                            (
                                event.loaded /
                                event.total
                            ) *
                            100
                        );


                    if (
                        typeof options.onProgress ===
                        "function"
                    ) {

                        options.onProgress(
                            progress
                        );

                    }

                }
            );


            xhr.addEventListener(
                "load",
                () => {

                    if (
                        xhr.status >= 200 &&
                        xhr.status < 300
                    ) {

                        try {

                            const result =
                                JSON.parse(
                                    xhr.responseText
                                );


                            resolve(
                                {

                                    success:
                                        true,

                                    publicId:
                                        result.public_id,

                                    secureUrl:
                                        result.secure_url,

                                    url:
                                        result.secure_url,

                                    resourceType:
                                        result.resource_type,

                                    format:
                                        result.format,

                                    width:
                                        result.width,

                                    height:
                                        result.height,

                                    bytes:
                                        result.bytes,

                                    raw:
                                        result

                                }
                            );

                        }

                        catch {

                            reject(
                                new Error(
                                    "[INVALID CLOUDINARY RESPONSE]"
                                )
                            );

                        }

                        return;

                    }


                    let message =
                        "[CLOUDINARY UPLOAD FAILED]";


                    try {

                        const response =
                            JSON.parse(
                                xhr.responseText
                            );


                        message =
                            response
                                ?.error
                                ?.message ||
                            message;

                    }

                    catch {
                        // Keep default message.
                    }


                    reject(
                        new Error(
                            message
                        )
                    );

                }
            );


            xhr.addEventListener(
                "error",
                () => {

                    reject(
                        new Error(
                            "[CLOUDINARY NETWORK ERROR]"
                        )
                    );

                }
            );


            xhr.addEventListener(
                "abort",
                () => {

                    reject(
                        new Error(
                            "[CLOUDINARY UPLOAD CANCELLED]"
                        )
                    );

                }
            );


            xhr.send(
                formData
            );

        }
    );

                                  }
