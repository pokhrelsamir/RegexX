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
 * - Integration with Regex Engine
 * - Integration with Builder
 * - Integration with Storage
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

            const tabId =
                nav.dataset.tab;

            activateTab(tabId);

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
   RUN REGEX TEST
   ========================================================= */

function runRegexTest() {

    /*
     * Preferred Regex Engine API
     */

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


    /*
     * Compatibility fallback.
     */

    if (
        typeof window.regexEngineTest ===
        "function"
    ) {

        return window.regexEngineTest(
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
        "RegexX: Regex Engine is not available."
    );


    return null;
}


/* =========================================================
   REGEX INPUT EVENTS
   ========================================================= */

if (regexInput) {

    regexInput.addEventListener(
        "input",
        () => {

            updateFlagPreview();

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
     * Restore default flags.
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


    if (regexStatus) {

        regexStatus.textContent =
            "Ready";

        regexStatus.className =
            "status neutral";

    }


    /*
     * Reset highlighted preview.
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

                <h3>
                    No matches yet
                </h3>

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
     * Global + Ignore Case
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

    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );


        if (themeBtn) {

            themeBtn.textContent =
                "☀️";

            themeBtn.title =
                "Switch to light theme";

            themeBtn.setAttribute(
                "aria-label",
                "Switch to light theme"
            );

        }

    } else {

        document.body.classList.remove(
            "dark-theme"
        );


        if (themeBtn) {

            themeBtn.textContent =
                "🌙";

            themeBtn.title =
                "Switch to dark theme";

            themeBtn.setAttribute(
                "aria-label",
                "Switch to dark theme"
            );

        }

    }


    localStorage.setItem(
        THEME_KEY,
        theme
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


    /*
     * Respect system preference.
     */

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
         * Run regex test.
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
         * Save current regex.
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
 * Expose toast globally.
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
     * Tester is the initial tab.
     */

    activateTab(
        "tester"
    );


    /*
     * Initialize storage if available.
     */

    if (
        typeof initializeStorage ===
        "function"
    ) {

        initializeStorage();

    }


    /*
     * Run initial test if values exist.
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