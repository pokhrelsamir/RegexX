/**
 * =========================================================
 * RegexX
 * Regex Builder
 * =========================================================
 *
 * Responsibilities:
 * - Visual regex construction
 * - Component insertion
 * - Regex preview
 * - Copy generated regex
 * - Clear builder
 *
 * NOTE:
 * - "Use in Tester" is handled by app.js
 * - This file intentionally does NOT declare
 *   builderUseBtn or useBuilderRegex()
 * =========================================================
 */


/* =========================================================
   BUILDER STATE
   ========================================================= */

let builderPattern = "";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const builderOutput =
    document.getElementById(
        "builderOutput"
    );

const builderCopyBtn =
    document.getElementById(
        "builderCopyBtn"
    );

const builderClearBtn =
    document.getElementById(
        "builderClearBtn"
    );

const builderButtons =
    document.querySelectorAll(
        ".builder-btn"
    );


/* =========================================================
   UPDATE BUILDER OUTPUT
   ========================================================= */

function updateBuilderOutput() {

    if (!builderOutput) {
        return;
    }


    if (!builderPattern) {

        builderOutput.textContent =
            "Start building your regex...";

        return;
    }


    builderOutput.textContent =
        builderPattern;
}


/* =========================================================
   ADD BUILDER COMPONENT
   ========================================================= */

function addBuilderComponent(
    component
) {

    if (!component) {
        return;
    }


    builderPattern += component;


    updateBuilderOutput();
}


/* =========================================================
   REMOVE LAST COMPONENT
   ========================================================= */

function removeLastBuilderComponent() {

    if (!builderPattern) {
        return;
    }


    /*
     * Remove escaped two-character tokens.
     *
     * Examples:
     * \d
     * \w
     * \s
     * \b
     * \D
     * \W
     * \S
     * \B
     */

    const escapedTokens = [
        "\\d",
        "\\w",
        "\\s",
        "\\b",
        "\\D",
        "\\W",
        "\\S",
        "\\B"
    ];


    const isEscapedToken =
        escapedTokens.some(
            token =>
                builderPattern.endsWith(
                    token
                )
        );


    if (isEscapedToken) {

        builderPattern =
            builderPattern.slice(
                0,
                -2
            );

    } else {

        builderPattern =
            builderPattern.slice(
                0,
                -1
            );

    }


    updateBuilderOutput();
}


/* =========================================================
   CLEAR BUILDER
   ========================================================= */

function clearBuilder() {

    builderPattern = "";


    updateBuilderOutput();


    showBuilderToast(
        "Builder cleared."
    );
}


/* =========================================================
   COPY BUILDER REGEX
   ========================================================= */

async function copyBuilderRegex() {

    if (!builderPattern) {

        showBuilderToast(
            "Nothing to copy."
        );

        return;
    }


    try {

        /*
         * Modern Clipboard API
         */

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {

            await navigator.clipboard.writeText(
                builderPattern
            );

        } else {

            /*
             * Fallback for local/file environments.
             */

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                builderPattern;


            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            document.execCommand(
                "copy"
            );


            textarea.remove();

        }


        showBuilderToast(
            "Regex copied."
        );

    } catch (error) {

        console.error(
            "RegexX: Builder copy failed.",
            error
        );


        showBuilderToast(
            "Unable to copy regex."
        );

    }
}


/* =========================================================
   BUILDER TOAST
   ========================================================= */

function showBuilderToast(
    message
) {

    /*
     * Use the global RegexX toast
     * created by app.js.
     */

    if (
        typeof window.showToast ===
        "function"
    ) {

        window.showToast(
            message
        );

        return;
    }


    console.log(
        "RegexX:",
        message
    );
}


/* =========================================================
   BUILDER BUTTON EVENTS
   ========================================================= */

builderButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const regex =
                    button.dataset.regex;


                if (!regex) {
                    return;
                }


                addBuilderComponent(
                    regex
                );

            }
        );

    }
);


/* =========================================================
   COPY BUTTON
   ========================================================= */

if (builderCopyBtn) {

    builderCopyBtn.addEventListener(
        "click",
        copyBuilderRegex
    );

}


/* =========================================================
   CLEAR BUTTON
   ========================================================= */

if (builderClearBtn) {

    builderClearBtn.addEventListener(
        "click",
        clearBuilder
    );

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const builderTab =
            document.getElementById(
                "builder"
            );


        /*
         * Only respond when Builder
         * tab is active.
         */

        if (
            !builderTab ||
            !builderTab.classList.contains(
                "active"
            )
        ) {

            return;
        }


        /* -------------------------------------------------
           BACKSPACE
        ------------------------------------------------- */

        if (
            event.key === "Backspace"
        ) {

            /*
             * Don't interfere with
             * form controls.
             */

            const tagName =
                event.target.tagName;


            if (
                tagName === "INPUT" ||
                tagName === "TEXTAREA" ||
                tagName === "SELECT" ||
                event.target.isContentEditable
            ) {

                return;
            }


            event.preventDefault();


            removeLastBuilderComponent();

        }


        /* -------------------------------------------------
           ESCAPE
        ------------------------------------------------- */

        if (
            event.key === "Escape"
        ) {

            clearBuilder();

        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

updateBuilderOutput();


console.log(
    "RegexX Builder initialized successfully."
);