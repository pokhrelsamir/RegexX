/**
 * =========================================================
 * RegexX
 * Regular Expression Tester & Builder
 * =========================================================
 *
 * Responsibilities:
 * - Create regular expressions
 * - Validate regex syntax
 * - Execute regex tests
 * - Find matches
 * - Count capture groups
 * - Highlight matches
 * - Render match details
 * - Measure execution time
 */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const regexInputElement =
    document.getElementById("regexInput");

const testInputElement =
    document.getElementById("testInput");

const regexStatusElement =
    document.getElementById("regexStatus");

const statusValueElement =
    document.getElementById("statusValue");

const matchCountElement =
    document.getElementById("matchCount");

const groupCountElement =
    document.getElementById("groupCount");

const executionTimeElement =
    document.getElementById("executionTime");

const highlightPreviewElement =
    document.getElementById("highlightPreview");

const matchResultsElement =
    document.getElementById("matchResults");


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeRegexHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   GET FLAGS
   ========================================================= */

function getRegexFlags() {

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
   COUNT CAPTURE GROUPS
   ========================================================= */

function countCaptureGroups(pattern) {

    let count = 0;

    let escaped = false;

    let inCharacterClass = false;


    for (
        let index = 0;
        index < pattern.length;
        index++
    ) {

        const character =
            pattern[index];


        /*
         * Handle escaped characters.
         */

        if (escaped) {

            escaped = false;

            continue;
        }


        if (character === "\\") {

            escaped = true;

            continue;
        }


        /*
         * Character class:
         * [abc]
         */

        if (character === "[") {

            inCharacterClass = true;

            continue;
        }


        if (
            character === "]" &&
            inCharacterClass
        ) {

            inCharacterClass = false;

            continue;
        }


        if (inCharacterClass) {
            continue;
        }


        /*
         * Capture group.
         *
         * Count "(" unless it begins
         * a non-capturing/lookaround group.
         */

        if (character === "(") {

            if (
                pattern[index + 1] === "?"
            ) {

                continue;
            }


            count++;
        }

    }


    return count;
}


/* =========================================================
   SET STATUS
   ========================================================= */

function setRegexStatus(
    type,
    message
) {

    if (regexStatusElement) {

        regexStatusElement.textContent =
            message;

        regexStatusElement.className =
            `status ${type}`;

    }


    if (statusValueElement) {

        statusValueElement.textContent =
            message;

    }
}


/* =========================================================
   RESET RESULTS
   ========================================================= */

function resetResults() {

    if (matchCountElement) {

        matchCountElement.textContent =
            "0";

    }


    if (groupCountElement) {

        groupCountElement.textContent =
            "0";

    }


    if (executionTimeElement) {

        executionTimeElement.textContent =
            "—";

    }


    if (highlightPreviewElement) {

        highlightPreviewElement.innerHTML = `
            <span class="placeholder-text">
                Matches will appear here...
            </span>
        `;

    }


    if (matchResultsElement) {

        matchResultsElement.innerHTML = `

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

}


/* =========================================================
   HIGHLIGHT MATCHES
   ========================================================= */

function renderHighlightPreview(
    text,
    matches
) {

    if (!highlightPreviewElement) {
        return;
    }


    if (!text) {

        highlightPreviewElement.innerHTML = `
            <span class="placeholder-text">
                Enter test text to see matches...
            </span>
        `;

        return;
    }


    if (!matches.length) {

        highlightPreviewElement.innerHTML =
            escapeRegexHTML(text);

        return;
    }


    let html = "";

    let lastIndex = 0;


    matches.forEach(match => {

        const start =
            match.index;

        const end =
            start + match[0].length;


        /*
         * Add text before match.
         */

        html += escapeRegexHTML(
            text.slice(
                lastIndex,
                start
            )
        );


        /*
         * Add highlighted match.
         */

        const matchedText =
            match[0];


        /*
         * Empty matches need special handling.
         */

        if (matchedText.length === 0) {

            html += `
                <span
                    class="highlight"
                    title="Empty match"
                >
                    ↔
                </span>
            `;

        } else {

            html += `
                <span class="highlight">
                    ${escapeRegexHTML(
                        matchedText
                    )}
                </span>
            `;

        }


        lastIndex = end;

    });


    /*
     * Add remaining text.
     */

    html += escapeRegexHTML(
        text.slice(lastIndex)
    );


    highlightPreviewElement.innerHTML =
        html;
}


/* =========================================================
   RENDER MATCH DETAILS
   ========================================================= */

function renderMatchResults(
    matches
) {

    if (!matchResultsElement) {
        return;
    }


    if (!matches.length) {

        matchResultsElement.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>No matches found</h3>

                <p>
                    The regex is valid, but no matching
                    text was found.
                </p>

            </div>

        `;

        return;
    }


    matchResultsElement.innerHTML =
        matches.map(
            (match, index) => {

                const start =
                    match.index;

                const end =
                    start + match[0].length;


                return `

                    <div class="match-item">

                        <span class="match-number">
                            MATCH ${index + 1}
                        </span>

                        <span class="match-value">
                            ${escapeRegexHTML(
                                match[0]
                            )}
                        </span>

                        <span class="match-index">
                            ${start}–${end}
                        </span>

                    </div>

                `;

            }
        ).join("");
}


/* =========================================================
   CREATE MATCH ARRAY
   ========================================================= */

function executeRegex(
    regex,
    text
) {

    const matches = [];


    /*
     * Global and sticky regexes can use
     * exec() repeatedly.
     */

    if (
        regex.global ||
        regex.sticky
    ) {

        let match;


        /*
         * Prevent infinite loops with
         * zero-length matches.
         */

        while (
            (match = regex.exec(text)) !==
            null
        ) {

            matches.push({
                0:
                    match[0],

                index:
                    match.index,

                input:
                    match.input,

                groups:
                    match.groups || null,

                captures:
                    Array.from(match).slice(1)

            });


            if (
                match[0] === ""
            ) {

                regex.lastIndex++;
            }

        }

    } else {

        const match =
            regex.exec(text);


        if (match) {

            matches.push({
                0:
                    match[0],

                index:
                    match.index,

                input:
                    match.input,

                groups:
                    match.groups || null,

                captures:
                    Array.from(match).slice(1)

            });

        }

    }


    return matches;
}


/* =========================================================
   MAIN REGEX TEST
   ========================================================= */

function runRegexTest() {

    if (
        !regexInputElement ||
        !testInputElement
    ) {

        return;
    }


    const pattern =
        regexInputElement.value;


    const text =
        testInputElement.value;


    /*
     * Nothing entered.
     */

    if (!pattern.trim()) {

        setRegexStatus(
            "neutral",
            "Ready"
        );

        resetResults();

        return;
    }


    const flags =
        getRegexFlags();


    /*
     * Build regex.
     */

    let regex;


    try {

        regex =
            new RegExp(
                pattern,
                flags
            );

    } catch (error) {

        setRegexStatus(
            "invalid",
            "Invalid"
        );


        if (matchCountElement) {

            matchCountElement.textContent =
                "0";

        }


        if (groupCountElement) {

            groupCountElement.textContent =
                "0";

        }


        if (executionTimeElement) {

            executionTimeElement.textContent =
                "—";

        }


        if (highlightPreviewElement) {

            highlightPreviewElement.innerHTML = `

                <span class="placeholder-text">
                    Invalid regular expression.
                </span>

            `;

        }


        if (matchResultsElement) {

            matchResultsElement.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>Invalid regular expression</h3>

                    <p>
                        ${escapeRegexHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }


        return;
    }


    /*
     * Count groups.
     */

    const groups =
        countCaptureGroups(
            pattern
        );


    if (groupCountElement) {

        groupCountElement.textContent =
            String(groups);

    }


    /*
     * If no test text exists,
     * regex is still valid.
     */

    if (!text) {

        setRegexStatus(
            "valid",
            "Valid"
        );


        if (matchCountElement) {

            matchCountElement.textContent =
                "0";

        }


        if (executionTimeElement) {

            executionTimeElement.textContent =
                "—";

        }


        if (highlightPreviewElement) {

            highlightPreviewElement.innerHTML = `
                <span class="placeholder-text">
                    Enter test text to see matches...
                </span>
            `;

        }


        if (matchResultsElement) {

            matchResultsElement.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🔎
                    </div>

                    <h3>Ready to test</h3>

                    <p>
                        Enter some test text to find matches.
                    </p>

                </div>

            `;

        }


        return;
    }


    /*
     * Execute regex.
     */

    const startTime =
        performance.now();


    let matches;


    try {

        matches =
            executeRegex(
                regex,
                text
            );

    } catch (error) {

        console.error(
            "RegexX execution error:",
            error
        );


        setRegexStatus(
            "invalid",
            "Error"
        );

        return;
    }


    const endTime =
        performance.now();


    const executionTime =
        endTime - startTime;


    /*
     * Update statistics.
     */

    if (matchCountElement) {

        matchCountElement.textContent =
            String(matches.length);

    }


    if (executionTimeElement) {

        executionTimeElement.textContent =
            `${executionTime.toFixed(2)} ms`;

    }


    /*
     * Valid regex with matches.
     */

    if (matches.length > 0) {

        setRegexStatus(
            "valid",
            "Matched"
        );

    } else {

        setRegexStatus(
            "valid",
            "No Match"
        );

    }


    /*
     * Render UI.
     */

    renderHighlightPreview(
        text,
        matches
    );


    renderMatchResults(
        matches
    );


    /*
     * Return useful data for other modules.
     */

    return {
        regex,
        pattern,
        flags,
        text,
        matches,
        groups,
        executionTime
    };
}


/* =========================================================
   REGEX ENGINE API
   ========================================================= */

window.RegexEngine = {

    test:
        runRegexTest,

    execute:
        executeRegex,

    countGroups:
        countCaptureGroups,

    getFlags:
        getRegexFlags

};


/* =========================================================
   GLOBAL COMPATIBILITY
   ========================================================= */

window.runRegexTest =
    runRegexTest;


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeRegexEngine() {

    if (
        regexInputElement &&
        regexInputElement.value.trim()
    ) {

        runRegexTest();

    } else {

        resetResults();

    }

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
        initializeRegexEngine
    );

} else {

    initializeRegexEngine();

}