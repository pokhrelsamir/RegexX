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
 * - Persist data using localStorage
 * - Render Saved Patterns UI
 */


/* =========================================================
   STORAGE CONFIGURATION
   ========================================================= */

const STORAGE_KEY =
    "regexx_saved_patterns";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const savedPatternsContainer =
    document.getElementById(
        "savedPatterns"
    );

const clearSavedBtn =
    document.getElementById(
        "clearSavedBtn"
    );


/* =========================================================
   GET SAVED PATTERNS
   ========================================================= */

function getSavedPatterns() {

    try {

        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!stored) {

            return [];
        }


        const parsed =
            JSON.parse(stored);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "RegexX: Unable to read saved patterns.",
            error
        );

        return [];
    }
}


/* =========================================================
   SAVE DATA
   ========================================================= */

function persistSavedPatterns(
    patterns
) {

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
   GENERATE ID
   ========================================================= */

function generateSavedPatternId() {

    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeStorageHTML(
    value
) {

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

    if (!pattern || !pattern.trim()) {

        showStorageToast(
            "Enter a regex pattern first."
        );

        return false;
    }


    const savedPatterns =
        getSavedPatterns();


    const cleanPattern =
        pattern.trim();


    /*
     * Prevent duplicate regex patterns.
     */

    const duplicate =
        savedPatterns.find(
            item =>
                item.pattern ===
                cleanPattern
        );


    if (duplicate) {

        showStorageToast(
            "This regex is already saved."
        );

        return false;
    }


    const cleanName =
        name.trim() ||
        `Pattern ${savedPatterns.length + 1}`;


    const cleanDescription =
        description.trim() ||
        "Saved RegexX pattern";


    const newPattern = {

        id:
            generateSavedPatternId(),

        name:
            cleanName,

        pattern:
            cleanPattern,

        description:
            cleanDescription,

        createdAt:
            new Date().toISOString()

    };


    savedPatterns.unshift(
        newPattern
    );


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
   PROMPT SAVE
   ========================================================= */

function promptSavePattern() {

    if (
        typeof regexInput ===
        "undefined"
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
   DELETE PATTERN
   ========================================================= */

function deleteSavedPattern(
    id
) {

    const savedPatterns =
        getSavedPatterns();


    const pattern =
        savedPatterns.find(
            item =>
                item.id === id
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
            item =>
                item.id !== id
        );


    persistSavedPatterns(
        updated
    );


    renderSavedPatterns();


    showStorageToast(
        "Pattern deleted."
    );
}


/* =========================================================
   CLEAR ALL
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

async function copySavedPattern(
    id
) {

    const pattern =
        getSavedPatterns().find(
            item =>
                item.id === id
        );


    if (!pattern) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            pattern.pattern
        );


        showStorageToast(
            "Regex copied."
        );

    } catch (error) {

        console.error(
            error
        );

        showStorageToast(
            "Unable to copy regex."
        );
    }
}


/* =========================================================
   LOAD SAVED PATTERN
   ========================================================= */

function loadSavedPattern(
    id
) {

    const pattern =
        getSavedPatterns().find(
            item =>
                item.id === id
        );


    if (!pattern) {
        return;
    }


    /*
     * Load into Tester.
     */

    if (
        typeof regexInput !==
        "undefined"
    ) {

        regexInput.value =
            pattern.pattern;
    }


    /*
     * Activate Tester.
     */

    if (
        typeof navItems !==
        "undefined"
    ) {

        navItems.forEach(
            nav =>
                nav.classList.remove(
                    "active"
                )
        );
    }


    if (
        typeof tabPanels !==
        "undefined"
    ) {

        tabPanels.forEach(
            panel =>
                panel.classList.remove(
                    "active"
                )
        );
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
     * Run test.
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
     * Render cards.
     */

    savedPatternsContainer.innerHTML =
        patterns.map(
            pattern => `

                <article
                    class="saved-pattern-card"
                    data-id="${escapeStorageHTML(
                        pattern.id
                    )}"
                >

                    <div class="saved-pattern-header">

                        <div>

                            <h3>
                                ${escapeStorageHTML(
                                    pattern.name
                                )}
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
                        ${escapeStorageHTML(
                            pattern.description
                        )}
                    </p>


                    <div class="saved-code">

                        <code>
                            ${escapeStorageHTML(
                                pattern.pattern
                            )}
                        </code>

                    </div>


                    <div class="saved-actions">

                        <button
                            class="btn btn-primary btn-small saved-load-btn"
                            data-id="${escapeStorageHTML(
                                pattern.id
                            )}"
                            type="button"
                        >
                            🔎 Use in Tester
                        </button>


                        <button
                            class="btn btn-secondary btn-small saved-copy-btn"
                            data-id="${escapeStorageHTML(
                                pattern.id
                            )}"
                            type="button"
                        >
                            📋 Copy
                        </button>


                        <button
                            class="btn btn-danger btn-small saved-delete-btn"
                            data-id="${escapeStorageHTML(
                                pattern.id
                            )}"
                            type="button"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </article>

            `
        ).join("");


    attachSavedPatternEvents();
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatSavedDate(
    dateString
) {

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
   ATTACH EVENTS
   ========================================================= */

function attachSavedPatternEvents() {

    /*
     * Load buttons
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
     * Copy buttons
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
     * Delete buttons
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
   TOAST
   ========================================================= */

function showStorageToast(
    message
) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(message);

        return;
    }


    console.log(
        message
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