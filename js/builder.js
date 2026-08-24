/**
 * =========================================================
 * RegexX
 * Regex Builder
 * =========================================================
 *
 * Responsibilities:
 * - Visual regex construction
 * - Component insertion
 * - Custom token insertion
 * - Regex preview
 * - Copy generated regex
 * - Send regex to Tester
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

const builderUseBtn =
    document.getElementById(
        "builderUseBtn"
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
   ADD COMPONENT
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
     * Remove escaped tokens.
     */

    if (
        builderPattern.endsWith("\\d") ||
        builderPattern.endsWith("\\w") ||
        builderPattern.endsWith("\\s") ||
        builderPattern.endsWith("\\b") ||
        builderPattern.endsWith("\\D") ||
        builderPattern.endsWith("\\W") ||
        builderPattern.endsWith("\\S") ||
        builderPattern.endsWith("\\B")
    ) {

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

        await navigator.clipboard.writeText(
            builderPattern
        );


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
   USE BUILDER REGEX IN TESTER
   ========================================================= */

function useBuilderRegex() {

    if (!builderPattern) {

        showBuilderToast(
            "Build a regex first."
        );

        return;
    }


    /*
     * Get Tester input.
     */

    const regexInput =
        document.getElementById(
            "regexInput"
        );


    if (!regexInput) {

        showBuilderToast(
            "Tester input not found."
        );

        return;
    }


    /*
     * Load pattern.
     */

    regexInput.value =
        builderPattern;


    /*
     * Switch to Tester.
     */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    const tabPanels =
        document.querySelectorAll(
            ".tab-panel"
        );


    navItems.forEach(nav => {

        nav.classList.toggle(
            "active",
            nav.dataset.tab === "tester"
        );

    });


    tabPanels.forEach(panel => {

        panel.classList.toggle(
            "active",
            panel.id === "tester"
        );

    });


    /*
     * Run test.
     */

    if (
        typeof window.RegexEngine !==
        "undefined" &&
        typeof window.RegexEngine.test ===
        "function"
    ) {

        const testInput =
            document.getElementById(
                "testInput"
            );


        const flags =
            Array.from(
                document.querySelectorAll(
                    '.flag-option input[type="checkbox"]:checked'
                )
            )
            .map(input => input.value)
            .join("");


        window.RegexEngine.test(
            regexInput.value,
            testInput
                ? testInput.value
                : "",
            flags
        );

    }


    showBuilderToast(
        "Regex loaded into Tester."
    );
}


/* =========================================================
   BUILDER TOAST
   ========================================================= */

function showBuilderToast(
    message
) {

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
   COPY
   ========================================================= */

if (builderCopyBtn) {

    builderCopyBtn.addEventListener(
        "click",
        copyBuilderRegex
    );

}


/* =========================================================
   CLEAR
   ========================================================= */

if (builderClearBtn) {

    builderClearBtn.addEventListener(
        "click",
        clearBuilder
    );

}


/* =========================================================
   USE IN TESTER
   ========================================================= */

if (builderUseBtn) {

    builderUseBtn.addEventListener(
        "click",
        useBuilderRegex
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


        if (
            !builderTab ||
            !builderTab.classList.contains(
                "active"
            )
        ) {

            return;
        }


        /*
         * Backspace
         */

        if (
            event.key === "Backspace"
        ) {

            /*
             * Don't interfere with
             * actual form controls.
             */

            const tag =
                event.target.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {

                return;
            }


            event.preventDefault();

            removeLastBuilderComponent();

        }


        /*
         * Escape
         */

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