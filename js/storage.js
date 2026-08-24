/**
 * =========================================================
 * RegexX
 * Local Storage Manager
 * =========================================================
 *
 * Responsibilities:
 * - Save regex patterns
 * - Load saved patterns
 * - Delete saved patterns
 * - Clear all saved patterns
 * - Copy saved patterns
 * - Load patterns into Tester
 * - Persist data with localStorage
 * - Render saved-pattern UI
 * =========================================================
 */


/* =========================================================
   CONFIGURATION
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
   STORAGE
   ========================================================= */

/**
 * Get saved regex patterns.
 *
 * @returns {Array<Object>}
 */
function getSavedPatterns() {
    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const patterns =
            JSON.parse(stored);

        if (!Array.isArray(patterns)) {
            return [];
        }

        return patterns.filter(
            pattern =>
                pattern &&
                typeof pattern === "object" &&
                typeof pattern.pattern === "string"
        );

    } catch (error) {
        console.error(
            "RegexX: Failed to read saved patterns.",
            error
        );

        return [];
    }
}


/**
 * Save patterns to localStorage.
 *
 * @param {Array<Object>} patterns
 * @returns {boolean}
 */
function persistSavedPatterns(patterns) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(patterns)
        );

        return true;

    } catch (error) {
        console.error(
            "RegexX: Failed to persist saved patterns.",
            error
        );

        return false;
    }
}


/**
 * Generate a unique ID.
 *
 * @returns {string}
 */
function generateSavedPatternId() {
    return [
        Date.now().toString(36),
        Math.random()
            .toString(36)
            .slice(2, 10)
    ].join("-");
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

/**
 * Escape dynamic values before inserting
 * them into HTML.
 *
 * @param {*} value
 * @returns {string}
 */
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

/**
 * Save a regex pattern.
 *
 * @param {string} pattern
 * @param {string} name
 * @param {string} description
 * @returns {boolean}
 */
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


    /* -------------------------------------------------------
       Prevent duplicates
       ------------------------------------------------------- */

    const alreadySaved =
        savedPatterns.some(
            item =>
                item.pattern === cleanPattern
        );

    if (alreadySaved) {
        showStorageToast(
            "This regex is already saved."
        );

        return false;
    }


    /* -------------------------------------------------------
       Normalize metadata
       ------------------------------------------------------- */

    const cleanName =
        typeof name === "string" &&
        name.trim()
            ? name.trim()
            : `Pattern ${savedPatterns.length + 1}`;

    const cleanDescription =
        typeof description === "string" &&
        description.trim()
            ? description.trim()
            : "Saved RegexX pattern";


    /* -------------------------------------------------------
       Create pattern
       ------------------------------------------------------- */

    const newPattern = {
        id: generateSavedPatternId(),
        name: cleanName,
        pattern: cleanPattern,
        description: cleanDescription,
        createdAt: new Date().toISOString()
    };


    /* -------------------------------------------------------
       Save newest pattern first
       ------------------------------------------------------- */

    savedPatterns.unshift(
        newPattern
    );


    if (
        !persistSavedPatterns(
            savedPatterns
        )
    ) {
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
   PROMPT SAVE
   ========================================================= */

/**
 * Save the current Tester regex
 * using user-provided metadata.
 */
function promptSavePattern() {
    if (
        typeof regexInput === "undefined" ||
        !regexInput
    ) {
        showStorageToast(
            "Regex input is unavailable."
        );

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


    /* -------------------------------------------------------
       Pattern name
       ------------------------------------------------------- */

    const name =
        window.prompt(
            "Pattern name:",
            "My Regex Pattern"
        );

    if (name === null) {
        return;
    }


    /* -------------------------------------------------------
       Pattern description
       ------------------------------------------------------- */

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
   DELETE PATTERN
   ========================================================= */

/**
 * Delete a saved regex pattern.
 *
 * @param {string} id
 */
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


    const updatedPatterns =
        savedPatterns.filter(
            item => item.id !== id
        );


    if (
        !persistSavedPatterns(
            updatedPatterns
        )
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
   CLEAR ALL
   ========================================================= */

/**
 * Delete every saved regex pattern.
 */
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


    try {
        localStorage.removeItem(
            STORAGE_KEY
        );

        renderSavedPatterns();

        showStorageToast(
            "All saved patterns cleared."
        );

    } catch (error) {
        console.error(
            "RegexX: Failed to clear patterns.",
            error
        );

        showStorageToast(
            "Unable to clear saved patterns."
        );
    }
}


/* =========================================================
   CLIPBOARD
   ========================================================= */

/**
 * Copy text to clipboard.
 *
 * @param {string} text
 * @returns {Promise<void>}
 */
async function copyTextToClipboard(text) {

    /* Modern Clipboard API. */
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(
            text
        );

        return;
    }


    /* Legacy fallback. */
    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.setAttribute(
        "readonly",
        ""
    );

    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";

    document.body.appendChild(
        textarea
    );

    textarea.focus();
    textarea.select();

    const successful =
        document.execCommand("copy");

    textarea.remove();

    if (!successful) {
        throw new Error(
            "Clipboard copy failed."
        );
    }
}


/**
 * Copy a saved pattern.
 *
 * @param {string} id
 */
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
   LOAD INTO TESTER
   ========================================================= */

/**
 * Load a saved regex into the Tester.
 *
 * @param {string} id
 */
function loadSavedPattern(id) {
    const pattern =
        getSavedPatterns().find(
            item => item.id === id
        );

    if (!pattern) {
        return;
    }


    /* -------------------------------------------------------
       Load regex
       ------------------------------------------------------- */

    if (
        typeof regexInput !== "undefined" &&
        regexInput
    ) {
        regexInput.value =
            pattern.pattern;
    }


    /* -------------------------------------------------------
       Activate Tester navigation
       ------------------------------------------------------- */

    if (
        typeof navItems !== "undefined"
    ) {
        navItems.forEach(nav => {
            nav.classList.toggle(
                "active",
                nav.dataset.tab === "tester"
            );
        });
    }


    /* -------------------------------------------------------
       Activate Tester panel
       ------------------------------------------------------- */

    if (
        typeof tabPanels !== "undefined"
    ) {
        tabPanels.forEach(panel => {
            panel.classList.toggle(
                "active",
                panel.id === "tester"
            );
        });
    }


    /* -------------------------------------------------------
       Run RegexX engine
       ------------------------------------------------------- */

    if (
        typeof window.RegexEngine !==
            "undefined" &&
        typeof window.RegexEngine.test ===
            "function"
    ) {
        window.RegexEngine.test();
    } else if (
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
   DATE FORMAT
   ========================================================= */

/**
 * Format saved-pattern date.
 *
 * @param {string} dateString
 * @returns {string}
 */
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
   RENDER
   ========================================================= */

/**
 * Render all saved patterns.
 */
function renderSavedPatterns() {
    if (!savedPatternsContainer) {
        return;
    }

    const patterns =
        getSavedPatterns();


    /* -------------------------------------------------------
       Empty state
       ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       Pattern cards
       ------------------------------------------------------- */

    savedPatternsContainer.innerHTML =
        patterns
            .map(pattern => {

                const id =
                    escapeStorageHTML(
                        pattern.id
                    );

                const name =
                    escapeStorageHTML(
                        pattern.name ||
                        "Unnamed Pattern"
                    );

                const description =
                    escapeStorageHTML(
                        pattern.description ||
                        "Saved RegexX pattern"
                    );

                const regex =
                    escapeStorageHTML(
                        pattern.pattern
                    );

                const date =
                    formatSavedDate(
                        pattern.createdAt
                    );


                return `
                    <article
                        class="saved-pattern-card"
                        data-id="${id}"
                    >

                        <div class="saved-pattern-header">

                            <div>

                                <h3>
                                    ${name}
                                </h3>

                                <span class="saved-date">
                                    Saved ${date}
                                </span>

                            </div>

                        </div>


                        <p class="saved-description">
                            ${description}
                        </p>


                        <div class="saved-code">
                            <code>
                                ${regex}
                            </code>
                        </div>


                        <div class="saved-actions">

                            <button
                                class="btn btn-primary btn-small saved-load-btn"
                                data-id="${id}"
                                type="button"
                            >
                                🔎 Use in Tester
                            </button>

                            <button
                                class="btn btn-secondary btn-small saved-copy-btn"
                                data-id="${id}"
                                type="button"
                            >
                                📋 Copy
                            </button>

                            <button
                                class="btn btn-danger btn-small saved-delete-btn"
                                data-id="${id}"
                                type="button"
                            >
                                🗑️ Delete
                            </button>

                        </div>

                    </article>
                `;
            })
            .join("");

    attachSavedPatternEvents();
}


/* =========================================================
   EVENT HANDLERS
   ========================================================= */

/**
 * Attach events to saved-pattern buttons.
 */
function attachSavedPatternEvents() {

    /* Load buttons. */
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


    /* Copy buttons. */
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


    /* Delete buttons. */
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
   TOAST
   ========================================================= */

/**
 * Display storage-related notifications.
 *
 * @param {string} message
 */
function showStorageToast(message) {
    if (
        typeof window.showToast ===
        "function"
    ) {
        window.showToast(message);

        return;
    }

    console.log(
        `RegexX: ${message}`
    );
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.RegexStorage = {
    get: getSavedPatterns,
    save: savePattern,
    delete: deleteSavedPattern,
    clear: clearAllSavedPatterns,
    load: loadSavedPattern,
    copy: copySavedPattern,
    render: renderSavedPatterns
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

/**
 * Initialize storage UI.
 */
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
   DOM READY
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