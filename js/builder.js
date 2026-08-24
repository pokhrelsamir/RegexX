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


    builderPattern +=
        component;


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
     * Remove two-character escaped tokens.
     *
     * Examples:
     * \d
     * \w
     * \s
     * \D
     * \W
     * \b
     * \B
     */

    const escapedTokens = [
        "\\d",
        "\\w",
        "\\s",
        "\\D",
        "\\W",
        "\\b",
        "\\B"
    ];


    const matchedToken =
        escapedTokens.find(
            token =>
                builderPattern.endsWith(
                    token
                )
        );


    if (matchedToken) {

        builderPattern =
            builderPattern.slice(
                0,
                -matchedToken.length
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
   USE IN TESTER
   ========================================================= */

function useBuilderRegex() {

    if (!builderPattern) {

        showBuilderToast(
            "Build a regex first."
        );

        return;
    }


    /*
     * Tester input.
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


    regexInput.value =
        builderPattern;


    /*
     * Activate Tester tab.
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
            nav.dataset.tab ===
                "tester"
        );

    });


    tabPanels.forEach(panel => {

        panel.classList.toggle(
            "active",
            panel.id === "tester"
        );

    });


    /*
     * Run RegexX test.
     */

    if (
        typeof window.runRegexTest ===
        "function"
    ) {

        window.runRegexTest();

    }


    showBuilderToast(
        "Regex loaded into Tester."
    );
}


/* =========================================================
   TOAST
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
   BUILDER COMPONENT EVENTS
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
   USE BUTTON
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
         * Never interfere with
         * text inputs.
         */

        const tagName =
            event.target?.tagName;


        if (
            tagName === "INPUT" ||
            tagName === "TEXTAREA"
        ) {

            return;
        }


        /*
         * Backspace:
         * remove last component.
         */

        if (
            event.key ===
            "Backspace"
        ) {

            event.preventDefault();

            removeLastBuilderComponent();

        }


        /*
         * Escape:
         * clear builder.
         */

        if (
            event.key ===
            "Escape"
        ) {

            clearBuilder();

        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

updateBuilderOutput();