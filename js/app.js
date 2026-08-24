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
 * - Keyboard shortcuts
 * - Toast notifications
 * - Application initialization
 *
 * NOTE:
 * Builder functionality is handled by builder.js.
 * Storage functionality is handled by storage.js.
 * Regex execution is handled by regex-engine.js.
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

const saveBtn =
    document.getElementById("saveBtn");

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
   RUN REGEX TEST
   ========================================================= */

function runRegexTest() {

    const pattern =
        regexInput
            ? regexInput.value
            : "";

    const text =
        testInput
            ? testInput.value
            : "";

    const flags =
        getActiveFlags();


    /*
     * Primary Regex Engine API.
     */

    if (
        window.RegexEngine &&
        typeof window.RegexEngine.test ===
        "function"
    ) {

        try {

            return window.RegexEngine.test(
                pattern,
                text,
                flags
            );

        } catch (error) {

            console.error(
                "RegexX: Regex engine error.",
                error
            );

            return null;
        }
    }


    /*
     * Compatibility API.
     */

    if (
        typeof window.regexEngineTest ===
        "function"
    ) {

        try {

            return window.regexEngineTest(
                pattern,
                text,
                flags
            );

        } catch (error) {

            console.error(
                "RegexX: Regex engine error.",
                error
            );

            return null;
        }
    }


    console.warn(
        "RegexX: Regex Engine is not available."
    );


    return null;
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

    /*
     * Clear regex.
     */

    if (regexInput) {

        regexInput.value = "";

    }


    /*
     * Clear test text.
     */

    if (testInput) {

        testInput.value = "";

    }


    /*
     * Restore global flag.
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
     * Reset status.
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
     * Reset highlighted matches.
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
     * Reset match details.
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

    /*
     * Email regex.
     */

    if (regexInput) {

        regexInput.value =
            "\\b\\w+@\\w+\\.\\w+\\b";

    }


    /*
     * Sample test data.
     */

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
     * Enable Global + Ignore Case.
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

        /*
         * Modern Clipboard API.
         */

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {

            await navigator.clipboard.writeText(
                pattern
            );

        } else {

            /*
             * Fallback for environments where
             * Clipboard API is unavailable.
             */

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                pattern;


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
   SAVE BUTTON
   ========================================================= */

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveCurrentRegex
    );

}


/* =========================================================
   THEME
   ========================================================= */

const THEME_KEY =
    "regexx_theme";


/* =========================================================
   APPLY THEME
   ========================================================= */

function applyTheme(theme) {

    const selectedTheme =
        theme === "dark"
            ? "dark"
            : "light";


    if (
        selectedTheme ===
        "dark"
    ) {

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


    try {

        localStorage.setItem(
            THEME_KEY,
            selectedTheme
        );

    } catch (error) {

        console.warn(
            "RegexX: Unable to save theme.",
            error
        );

    }
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

    let savedTheme = null;


    try {

        savedTheme =
            localStorage.getItem(
                THEME_KEY
            );

    } catch (error) {

        console.warn(
            "RegexX: Unable to read saved theme.",
            error
        );

    }


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
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Ctrl/Cmd + Enter
         *
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
         *
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

        console.log(
            message
        );

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
 *
 * Used by:
 * - storage.js
 * - builder.js
 * - patterns.js
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

    /*
     * Update flags.
     */

    updateFlagPreview();


    /*
     * Initialize theme.
     */

    initializeTheme();


    /*
     * Tester is the initial tab.
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
     * Run initial test if
     * a pattern already exists.
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