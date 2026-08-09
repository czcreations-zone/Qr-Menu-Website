import {
    isEmpty,
    isValidEmail
} from "./utils.js";

export function validateRequired(
    value,
    fieldName = "This field"
) {
    if (isEmpty(value)) {
        return {
            valid: false,
            message: `${fieldName} is required.`
        };
    }

    return {
        valid: true,
        message: ""
    };
}

export function validateEmail(
    email
) {
    if (isEmpty(email)) {
        return {
            valid: false,
            message: "Email is required."
        };
    }

    if (!isValidEmail(email)) {
        return {
            valid: false,
            message: "Enter a valid email address."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

export function validatePassword(
    password,
    minimumLength = 6
) {
    if (isEmpty(password)) {
        return {
            valid: false,
            message: "Password is required."
        };
    }

    if (
        String(password).length <
        minimumLength
    ) {
        return {
            valid: false,
            message:
                `Password must contain at least ` +
                `${minimumLength} characters.`
        };
    }

    return {
        valid: true,
        message: ""
    };
}

export function validateForm(
    form,
    rules = {}
) {
    const errors = {};

    Object.entries(rules).forEach(
        ([fieldName, validators]) => {
            const field =
                form.elements[fieldName];

            if (!field) return;

            const value = field.value;

            for (
                const validator of validators
            ) {
                const result =
                    validator(value);

                if (!result.valid) {
                    errors[fieldName] =
                        result.message;

                    break;
                }
            }
        }
    );

    return {
        valid:
            Object.keys(errors).length ===
            0,

        errors
    };
}

export function displayFormErrors(
    form,
    errors
) {
    form.querySelectorAll(
        "[data-form-error]"
    ).forEach(element => {
        element.textContent = "";
    });

    Object.entries(errors).forEach(
        ([fieldName, message]) => {
            const errorElement =
                form.querySelector(
                    `[data-form-error="${fieldName}"]`
                );

            if (errorElement) {
                errorElement.textContent =
                    message;
            }
        }
    );
}
