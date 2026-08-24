/**
 * =========================================================
 * RegexX
 * Local Storage Manager
 * =========================================================
 *
 * Responsibilities:
 * - Save regex patterns
 * - Load saved patterns
 * - Delete patterns
 * - Clear all patterns
 * - Copy saved patterns
 * - Load patterns into Tester
 * - Persist data using localStorage
 * - Render Saved Patterns UI
 *
 * =========================================================
 */


/* =========================================================
   STORAGE CONFIGURATION
   ========================================================= */

const STORAGE_KEY = "regexx_saved_patterns";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const savedPatternsContainer =
    document.getElementById("savedPatterns");

const clearSavedBtn =
    document.getElementById("clearSavedBtn");


/* =========================================================
   GET SAVED PATTERNS
   ========================================================= */

function getSavedPatterns() {

    try {

        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        /*
         * Validate stored objects.
         */

        return parsed.filter(item =>
            item &&
            typeof item === "object" &&
            typeof item.pattern === "string"
        );

    } catch (error) {

        console.error(
            "RegexX: Unable to read saved patterns.",
            error
        );

        return [];
    }
}


/* =========================================================
   PERSIST SAVED PATTERNS
   ========================================================= */

function persistSavedPatterns(patterns) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(patterns)
        );

        return true;

    } catch (error) {

        console.error(
            "RegexX: Unable to save patterns.",
            error
        );

        return false;
    }
}


/* =========================================================
   GENERATE UNIQUE ID
   ========================================================= */

function generateSavedPatternId() {

    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeStorageHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SAVE PATTERN
   ========================================================= */

function savePattern(
    pattern,
    name = "",
    description = ""
) {

    if (
        typeof pattern !== "string" ||
        !pattern.trim()
    ) {

        showStorageToast(
            "Enter a regex pattern first."
        );

        return false;
    }


    const cleanPattern =
        pattern.trim();


    const savedPatterns =
        getSavedPatterns();


    /*
     * Prevent duplicate patterns.
     */

    const duplicate =
        savedPatterns.some(
            item =>
                item.pattern === cleanPattern
        );


    if (duplicate) {

        showStorageToast(
            "This regex is already saved."
        );

        return false;
    }


    const cleanName =
        typeof name === "string" && name.trim()
            ? name.trim()
            : `Pattern ${savedPatterns.length + 1}`;


    const cleanDescription =
        typeof description === "string" &&
        description.trim()
            ? description.trim()
            : "Saved RegexX pattern";


    const newPattern = {

        id: generateSavedPatternId(),

        name: cleanName,

        pattern: cleanPattern,

        description: cleanDescription,

        createdAt: new Date().toISOString()

    };


    savedPatterns.unshift(newPattern);


    const saved =
        persistSavedPatterns(
            savedPatterns
        );


    if (!saved) {

        showStorageToast(
            "Unable to save pattern."
        );

        return false;
    }


    renderSavedPatterns();


    showStorageToast(
        "Pattern saved successfully."
    );


    return true;
}


/* =========================================================
   PROMPT SAVE PATTERN
   ========================================================= */

function promptSavePattern() {

    if (
        typeof regexInput === "undefined" ||
        !regexInput
    ) {
        return;
    }


    const pattern =
        regexInput.value.trim();


    if (!pattern) {

        showStorageToast(
            "Enter a regex pattern first."
        );

        return;
    }


    const name =
        window.prompt(
            "Pattern name:",
            "My Regex Pattern"
        );


    /*
     * User cancelled.
     */

    if (name === null) {
        return;
    }


    const description =
        window.prompt(
            "Description:",
            "Custom RegexX pattern"
        );


    if (description === null) {
        return;
    }


    savePattern(
        pattern,
        name,
        description
    );
}


/* =========================================================
   DELETE SAVED PATTERN
   ========================================================= */

function deleteSavedPattern(id) {

    const savedPatterns =
        getSavedPatterns();


    const pattern =
        savedPatterns.find(
            item => item.id === id
        );


    if (!pattern) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${pattern.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const updated =
        savedPatterns.filter(
            item => item.id !== id
        );


    if (
        !persistSavedPatterns(updated)
    ) {

        showStorageToast(
            "Unable to delete pattern."
        );

        return;
    }


    renderSavedPatterns();


    showStorageToast(
        "Pattern deleted."
    );
}


/* =========================================================
   CLEAR ALL SAVED PATTERNS
   ========================================================= */

function clearAllSavedPatterns() {

    const savedPatterns =
        getSavedPatterns();


    if (!savedPatterns.length) {

        showStorageToast(
            "No saved patterns to clear."
        );

        return;
    }


    const confirmed =
        window.confirm(
            "Delete all saved regex patterns?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    renderSavedPatterns();


    showStorageToast(
        "All saved patterns cleared."
    );
}


/* =========================================================
   COPY SAVED PATTERN
   ========================================================= */

async function copySavedPattern(id) {

    const pattern =
        getSavedPatterns().find(
            item => item.id === id
        );


    if (!pattern) {
        return;
    }


    try {

        await copyTextToClipboard(
            pattern.pattern
        );


        showStorageToast(
            "Regex copied."
        );

    } catch (error) {

        console.error(
            "RegexX: Copy failed.",
            error
        );

        showStorageToast(
            "Unable to copy regex."
        );
    }
}


/* =========================================================
   CLIPBOARD HELPER
   ========================================================= */

async function copyTextToClipboard(text) {

    /*
     * Modern Clipboard API.
     */

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(text);

        return;
    }


    /*
     * Fallback for local development.
     */

    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const successful =
        document.execCommand("copy");

    textarea.remove();


    if (!successful) {
        throw new Error("Clipboard copy failed.");
    }
}


/* =========================================================
   LOAD SAVED PATTERN
   ========================================================= */

function loadSavedPattern(id) {

    const pattern =
        getSavedPatterns().find(
            item => item.id === id
        );


    if (!pattern) {
        return;
    }


    /*
     * Load regex into Tester.
     */

    if (
        typeof regexInput !== "undefined" &&
        regexInput
    ) {

        regexInput.value =
            pattern.pattern;
    }


    /*
     * Activate Tester navigation.
     */

    if (
        typeof navItems !== "undefined"
    ) {

        navItems.forEach(nav => {

            nav.classList.remove(
                "active"
            );

        });
    }


    /*
     * Activate Tester panel.
     */

    if (
        typeof tabPanels !== "undefined"
    ) {

        tabPanels.forEach(panel => {

            panel.classList.remove(
                "active"
            );

        });
    }


    const testerNav =
        document.querySelector(
            '[data-tab="tester"]'
        );


    const testerPanel =
        document.getElementById(
            "tester"
        );


    if (testerNav) {

        testerNav.classList.add(
            "active"
        );
    }


    if (testerPanel) {

        testerPanel.classList.add(
            "active"
        );
    }


    /*
     * Run RegexX tester.
     */

    if (
        typeof runRegexTest ===
        "function"
    ) {

        runRegexTest();
    }


    showStorageToast(
        `"${pattern.name}" loaded into Tester.`
    );
}


/* =========================================================
   RENDER SAVED PATTERNS
   ========================================================= */

function renderSavedPatterns() {

    if (!savedPatternsContainer) {
        return;
    }


    const patterns =
        getSavedPatterns();


    /*
     * Empty state.
     */

    if (!patterns.length) {

        savedPatternsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💾
                </div>

                <h3>
                    No saved patterns
                </h3>

                <p>
                    Your saved regex patterns will
                    appear here.
                </p>

            </div>

        `;

        return;
    }


    /*
     * Render saved patterns.
     */

    savedPatternsContainer.innerHTML =
        patterns.map(pattern => {

            const safeId =
                escapeStorageHTML(
                    pattern.id
                );

            const safeName =
                escapeStorageHTML(
                    pattern.name ||
                    "Unnamed Pattern"
                );

            const safeDescription =
                escapeStorageHTML(
                    pattern.description ||
                    "Saved RegexX pattern"
                );

            const safePattern =
                escapeStorageHTML(
                    pattern.pattern
                );

            return `

                <article
                    class="saved-pattern-card"
                    data-id="${safeId}"
                >

                    <div class="saved-pattern-header">

                        <div>

                            <h3>
                                ${safeName}
                            </h3>

                            <span class="saved-date">
                                Saved
                                ${formatSavedDate(
                                    pattern.createdAt
                                )}
                            </span>

                        </div>

                    </div>


                    <p class="saved-description">
                        ${safeDescription}
                    </p>


                    <div class="saved-code">

                        <code>
                            ${safePattern}
                        </code>

                    </div>


                    <div class="saved-actions">

                        <button
                            class="btn btn-primary btn-small saved-load-btn"
                            data-id="${safeId}"
                            type="button"
                        >
                            🔎 Use in Tester
                        </button>


                        <button
                            class="btn btn-secondary btn-small saved-copy-btn"
                            data-id="${safeId}"
                            type="button"
                        >
                            📋 Copy
                        </button>


                        <button
                            class="btn btn-danger btn-small saved-delete-btn"
                            data-id="${safeId}"
                            type="button"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    attachSavedPatternEvents();
}


/* =========================================================
   FORMAT SAVED DATE
   ========================================================= */

function formatSavedDate(dateString) {

    if (!dateString) {
        return "recently";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "recently";
    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


/* =========================================================
   ATTACH SAVED PATTERN EVENTS
   ========================================================= */

function attachSavedPatternEvents() {

    /*
     * Load buttons.
     */

    document
        .querySelectorAll(
            ".saved-load-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    loadSavedPattern(
                        button.dataset.id
                    );

                }
            );

        });


    /*
     * Copy buttons.
     */

    document
        .querySelectorAll(
            ".saved-copy-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    copySavedPattern(
                        button.dataset.id
                    );

                }
            );

        });


    /*
     * Delete buttons.
     */

    document
        .querySelectorAll(
            ".saved-delete-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSavedPattern(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================================================
   STORAGE TOAST
   ========================================================= */

function showStorageToast(message) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(message);

        return;
    }


    console.log(
        `RegexX: ${message}`
    );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeStorage() {

    renderSavedPatterns();
}


/* =========================================================
   EVENTS
   ========================================================= */

if (clearSavedBtn) {

    clearSavedBtn.addEventListener(
        "click",
        clearAllSavedPatterns
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStorage
    );

} else {

    initializeStorage();
}