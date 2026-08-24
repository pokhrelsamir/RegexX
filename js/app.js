/**
 * =========================================================
 * RegexX
 * Regular Expression Tester & Builder
 * Application Controller
 * =========================================================
 *
 * Responsibilities:
 * - Tab navigation
 * - Regex input handling
 * - Flag handling
 * - Theme switching
 * - Clear functionality
 * - Sample data
 * - Copy regex
 * - Save regex
 * - Toast notifications
 * - Application initialization
 *
 * Builder functionality is handled by builder.js.
 * Regex testing is handled by regex-engine.js.
 * Storage is handled by storage.js.
 */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");

const tabPanels =
    document.querySelectorAll(".tab-panel");

const regexInput =
    document.getElementById("regexInput");

const testInput =
    document.getElementById("testInput");

const clearBtn =
    document.getElementById("clearBtn");

const themeBtn =
    document.getElementById("themeBtn");

const sampleBtn =
    document.getElementById("sampleBtn");

const copyBtn =
    document.getElementById("copyBtn");

const flagPreview =
    document.getElementById("flagPreview");

const regexStatus =
    document.getElementById("regexStatus");

const statusValue =
    document.getElementById("statusValue");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   TAB NAVIGATION
   ========================================================= */

function activateTab(tabId) {

    navItems.forEach(nav => {

        nav.classList.toggle(
            "active",
            nav.dataset.tab === tabId
        );

    });


    tabPanels.forEach(panel => {

        panel.classList.toggle(
            "active",
            panel.id === tabId
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   TAB EVENTS
   ========================================================= */

navItems.forEach(nav => {

    nav.addEventListener(
        "click",
        () => {

            activateTab(
                nav.dataset.tab
            );

        }
    );

});


/* =========================================================
   GET ACTIVE FLAGS
   ========================================================= */

function getActiveFlags() {

    const flagInputs =
        document.querySelectorAll(
            '.flag-option input[type="checkbox"]'
        );


    return Array.from(flagInputs)
        .filter(input => input.checked)
        .map(input => input.value)
        .join("");
}


/* =========================================================
   UPDATE FLAG PREVIEW
   ========================================================= */

function updateFlagPreview() {

    if (!flagPreview) {
        return;
    }


    const flags =
        getActiveFlags();


    flagPreview.textContent =
        flags || " ";
}


/* =========================================================
   RUN REGEX TEST
   ========================================================= */

function runRegexTest() {

    if (
        window.RegexEngine &&
        typeof window.RegexEngine.test ===
        "function"
    ) {

        return window.RegexEngine.test(
            regexInput
                ? regexInput.value
                : "",
            testInput
                ? testInput.value
                : "",
            getActiveFlags()
        );

    }


    console.warn(
        "RegexX: RegexEngine.test() is unavailable."
    );


    return null;
}


/*
 * Make the application test function
 * available to other modules.
 */

window.runRegexTest =
    runRegexTest;


/* =========================================================
   FLAG EVENTS
   ========================================================= */

document
    .querySelectorAll(
        '.flag-option input[type="checkbox"]'
    )
    .forEach(input => {

        input.addEventListener(
            "change",
            () => {

                updateFlagPreview();

                runRegexTest();

            }
        );

    });


/* =========================================================
   REGEX INPUT EVENTS
   ========================================================= */

if (regexInput) {

    regexInput.addEventListener(
        "input",
        () => {

            runRegexTest();

        }
    );

}


/* =========================================================
   TEST INPUT EVENTS
   ========================================================= */

if (testInput) {

    testInput.addEventListener(
        "input",
        () => {

            runRegexTest();

        }
    );

}


/* =========================================================
   CLEAR APPLICATION
   ========================================================= */

function clearApplication() {

    if (regexInput) {
        regexInput.value = "";
    }


    if (testInput) {
        testInput.value = "";
    }


    /*
     * Restore default flag.
     */

    const flagInputs =
        document.querySelectorAll(
            '.flag-option input[type="checkbox"]'
        );


    flagInputs.forEach(input => {

        input.checked =
            input.value === "g";

    });


    updateFlagPreview();


    /*
     * Reset statistics.
     */

    setText(
        "statusValue",
        "Ready"
    );

    setText(
        "matchCount",
        "0"
    );

    setText(
        "groupCount",
        "0"
    );

    setText(
        "executionTime",
        "—"
    );


    /*
     * Reset status.
     */

    if (regexStatus) {

        regexStatus.textContent =
            "Ready";

        regexStatus.className =
            "status neutral";

    }


    /*
     * Reset highlight preview.
     */

    const preview =
        document.getElementById(
            "highlightPreview"
        );


    if (preview) {

        preview.innerHTML = `
            <span class="placeholder-text">
                Matches will appear here...
            </span>
        `;

    }


    /*
     * Reset match results.
     */

    const results =
        document.getElementById(
            "matchResults"
        );


    if (results) {

        results.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>No matches yet</h3>

                <p>
                    Enter a regex pattern and test text
                    to see matching results.
                </p>

            </div>

        `;

    }


    showToast(
        "RegexX has been cleared."
    );
}


/* =========================================================
   CLEAR BUTTON
   ========================================================= */

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        clearApplication
    );

}


/* =========================================================
   SAMPLE DATA
   ========================================================= */

function loadSample() {

    if (regexInput) {

        regexInput.value =
            "\\b\\w+@\\w+\\.\\w+\\b";

    }


    if (testInput) {

        testInput.value =
`Contact us at:
samir@example.com
admin@regexx.dev
hello@test.org

Invalid:
example.com
user@invalid`;

    }


    /*
     * Global + Ignore Case.
     */

    document
        .querySelectorAll(
            '.flag-option input[type="checkbox"]'
        )
        .forEach(input => {

            input.checked =
                input.value === "g" ||
                input.value === "i";

        });


    updateFlagPreview();

    runRegexTest();


    showToast(
        "Sample regex loaded."
    );
}


/* =========================================================
   SAMPLE BUTTON
   ========================================================= */

if (sampleBtn) {

    sampleBtn.addEventListener(
        "click",
        loadSample
    );

}


/* =========================================================
   COPY REGEX
   ========================================================= */

async function copyRegex() {

    const pattern =
        regexInput
            ? regexInput.value.trim()
            : "";


    if (!pattern) {

        showToast(
            "Enter a regex pattern first."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            pattern
        );


        showToast(
            "Regex copied to clipboard."
        );

    } catch (error) {

        console.error(
            "RegexX: Copy failed.",
            error
        );


        showToast(
            "Unable to copy regex."
        );

    }

}


/* =========================================================
   COPY BUTTON
   ========================================================= */

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        copyRegex
    );

}


/* =========================================================
   THEME
   ========================================================= */

const THEME_KEY =
    "regexx_theme";


function applyTheme(theme) {

    const isDark =
        theme === "dark";


    document.body.classList.toggle(
        "dark-theme",
        isDark
    );


    if (themeBtn) {

        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        themeBtn.title =
            isDark
                ? "Switch to light theme"
                : "Switch to dark theme";


        themeBtn.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light theme"
                : "Switch to dark theme"
        );

    }


    localStorage.setItem(
        THEME_KEY,
        isDark
            ? "dark"
            : "light"
    );
}


/* =========================================================
   TOGGLE THEME
   ========================================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.contains(
            "dark-theme"
        );


    applyTheme(
        isDark
            ? "light"
            : "dark"
    );
}


/* =========================================================
   THEME BUTTON
   ========================================================= */

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        toggleTheme
    );

}


/* =========================================================
   LOAD SAVED THEME
   ========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        savedTheme === "dark" ||
        savedTheme === "light"
    ) {

        applyTheme(
            savedTheme
        );

        return;
    }


    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    applyTheme(
        prefersDark
            ? "dark"
            : "light"
    );
}


/* =========================================================
   SAVE CURRENT REGEX
   ========================================================= */

function saveCurrentRegex() {

    if (
        typeof promptSavePattern ===
        "function"
    ) {

        promptSavePattern();

        return;
    }


    showToast(
        "Storage module is not available."
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Ctrl/Cmd + Enter
         */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            runRegexTest();

            showToast(
                "Regex test executed."
            );

        }


        /*
         * Ctrl/Cmd + Shift + S
         */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.shiftKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            saveCurrentRegex();

        }

    }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(message) {

    if (
        !toast ||
        !toastMessage
    ) {

        console.log(message);

        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/*
 * Expose globally.
 */

window.showToast =
    showToast;


/* =========================================================
   SAFE TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

    updateFlagPreview();

    initializeTheme();


    /*
     * Start on Tester.
     */

    activateTab(
        "tester"
    );


    /*
     * Initialize storage.
     */

    if (
        typeof initializeStorage ===
        "function"
    ) {

        initializeStorage();

    }


    /*
     * Run initial test if input exists.
     */

    if (
        regexInput &&
        regexInput.value.trim()
    ) {

        runRegexTest();

    }


    console.log(
        "RegexX initialized successfully."
    );
}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}