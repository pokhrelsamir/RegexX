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
    document.getElementById("builderOutput");

const builderCopyBtn =
    document.getElementById("builderCopyBtn");

const builderClearBtn =
    document.getElementById("builderClearBtn");

const builderUseBtn =
    document.getElementById("builderUseBtn");

const builderButtons =
    document.querySelectorAll(
        ".builder-btn"
    );


/* =========================================================
   UPDATE BUILDER OUTPUT
   ========================================================= */

function updateBuilderOutput() {

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
     * Remove escaped tokens such as:
     *
     * \d
     * \w
     * \s
     * \b
     */

    if (
        builderPattern.endsWith("\\d") ||
        builderPattern.endsWith("\\w") ||
        builderPattern.endsWith("\\s") ||
        builderPattern.endsWith("\\b")
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
        "Builder cleared"
    );
}


/* =========================================================
   COPY BUILDER REGEX
   ========================================================= */

async function copyBuilderRegex() {

    if (!builderPattern) {

        showBuilderToast(
            "Nothing to copy"
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            builderPattern
        );

        showBuilderToast(
            "Regex copied"
        );

    } catch {

        showBuilderToast(
            "Unable to copy regex"
        );
    }
}


/* =========================================================
   USE IN TESTER
   ========================================================= */

function useBuilderRegex() {

    if (!builderPattern) {

        showBuilderToast(
            "Build a regex first"
        );

        return;
    }


    /*
     * Send generated regex to
     * the tester input.
     */

    regexInput.value =
        builderPattern;


    /*
     * Switch to Tester tab.
     */

    navItems.forEach(
        nav =>
            nav.classList.remove(
                "active"
            )
    );


    tabPanels.forEach(
        panel =>
            panel.classList.remove(
                "active"
            )
    );


    document
        .querySelector(
            '[data-tab="tester"]'
        )
        .classList.add("active");


    document
        .getElementById("tester")
        .classList.add("active");


    /*
     * Run the regex immediately.
     */

    runRegexTest();


    showBuilderToast(
        "Regex loaded into Tester"
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showBuilderToast(message) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(message);

        return;
    }


    console.log(message);
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

        /*
         * Backspace while Builder is active
         */

        const builderTab =
            document.getElementById(
                "builder"
            );


        if (
            builderTab &&
            builderTab.classList.contains(
                "active"
            ) &&
            event.key === "Backspace"
        ) {

            /*
             * Don't interfere with
             * actual input fields.
             */

            if (
                event.target.tagName ===
                "INPUT" ||
                event.target.tagName ===
                "TEXTAREA"
            ) {

                return;
            }


            event.preventDefault();

            removeLastBuilderComponent();
        }


        /*
         * Escape clears builder
         */

        if (
            builderTab &&
            builderTab.classList.contains(
                "active"
            ) &&
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