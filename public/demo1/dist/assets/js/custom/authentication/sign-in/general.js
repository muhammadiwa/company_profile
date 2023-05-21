"use strict";

var KTSigninGeneral = (function () {
    var form = document.querySelector("#kt_sign_in_form");
    var submitBtn = document.querySelector("#kt_sign_in_submit");
    var validation;

    return {
        init: function () {
            validation = FormValidation.formValidation(form, {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: "Email address is required",
                            },
                            emailAddress: {
                                message:
                                    "The value is not a valid email address",
                            },
                        },
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "The password is required",
                            },
                        },
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: "",
                    }),
                },
            });

            submitBtn.addEventListener("click", function (event) {
                event.preventDefault();

                validation.validate().then(function (status) {
                    if (status === "Valid") {
                        submitBtn.setAttribute("data-kt-indicator", "on");
                        submitBtn.disabled = true;

                        // Send login request to the server
                        fetch("/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": document
                                    .querySelector('meta[name="csrf-token"]')
                                    .getAttribute("content"),
                            },
                            body: JSON.stringify({
                                email: form.querySelector('[name="email"]')
                                    .value,
                                password:
                                    form.querySelector('[name="password"]')
                                        .value,
                            }),
                        })
                            .then(function (response) {
                                if (response.ok) {
                                    return response.json();
                                } else {
                                    throw new Error("Login failed");
                                }
                            })
                            .then(function (data) {
                                // Check if the response is JSON or a plain string
                                if (typeof data === "object") {
                                    // Login success
                                    submitBtn.removeAttribute(
                                        "data-kt-indicator"
                                    );
                                    submitBtn.disabled = false;

                                    Swal.fire({
                                        text: "You have successfully logged in!",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary",
                                        },
                                    }).then(function () {
                                        form.querySelector(
                                            '[name="email"]'
                                        ).value = "";
                                        form.querySelector(
                                            '[name="password"]'
                                        ).value = "";

                                        // Redirect to dashboard
                                        window.location.href =
                                            data.redirect || "/dashboard";
                                    });
                                } else {
                                    // Login failed
                                    submitBtn.removeAttribute(
                                        "data-kt-indicator"
                                    );
                                    submitBtn.disabled = false;

                                    Swal.fire({
                                        text:
                                            data ||
                                            "Sorry, email or password is incorrect.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary",
                                        },
                                    });
                                }
                            })
                            .catch(function (error) {
                                console.error(error);
                                submitBtn.removeAttribute("data-kt-indicator");
                                submitBtn.disabled = false;
                            });
                    }
                });
            });
        },
    };
})();

KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
