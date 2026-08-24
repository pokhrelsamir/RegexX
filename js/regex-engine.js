/**
 * =========================================================
 * RegexX
 * Regular Expression Engine
 * ========================================================= *
 *
 * Responsibilities:
 * - Build regular expressions
 * - Validate patterns
 * - Execute regex matches
 * - Extract match information
 * - Count capture groups
 * - Generate highlight ranges
 * - Measure execution time
 */


/* =========================================================
   CREATE REGEX
   ========================================================= */

/**
 * Creates a JavaScript RegExp object.
 *
 * @param {string} pattern
 * @param {string} flags
 * @returns {RegExp}
 */
function createRegex(pattern, flags = "") {

    try {

        return new RegExp(pattern, flags);

    } catch (error) {

        throw new Error(
            error.message || "Invalid regular expression."
        );
    }
}


/* =========================================================
   VALIDATE REGEX
   ========================================================= */

/**
 * Validates a regex pattern.
 *
 * @param {string} pattern
 * @param {string} flags
 * @returns {Object}
 */
function validateRegex(pattern, flags = "") {

    if (!pattern) {

        return {
            valid: false,
            message: "Enter a regular expression."
        };
    }

    try {

        new RegExp(pattern, flags);

        return {
            valid: true,
            message: "Valid regex."
        };

    } catch (error) {

        return {
            valid: false,
            message: error.message || "Invalid regex."
        };
    }
}


/* =========================================================
   COUNT CAPTURE GROUPS
   ========================================================= */

/**
 * Counts capturing groups.
 *
 * This intentionally handles the common JavaScript
 * regex cases used by RegexX.
 *
 * @param {string} pattern
 * @returns {number}
 */
function countCaptureGroups(pattern) {

    if (!pattern) {
        return 0;
    }

    let count = 0;
    let escaped = false;
    let insideCharacterClass = false;

    for (let i = 0; i < pattern.length; i++) {

        const char = pattern[i];

        if (escaped) {

            escaped = false;
            continue;
        }

        if (char === "\\") {

            escaped = true;
            continue;
        }

        if (char === "[") {

            insideCharacterClass = true;
            continue;
        }

        if (char === "]") {

            insideCharacterClass = false;
            continue;
        }

        if (
            char === "(" &&
            !insideCharacterClass
        ) {

            /*
             * (?=...)
             * (?!...)
             * (?:...)
             * (?<=...)
             * (?<!...)
             * (?<name>...)
             *
             * are non-standard capturing syntaxes,
             * except named groups (?<name>...).
             */

            if (pattern[i + 1] === "?") {

                if (pattern[i + 2] === "<") {

                    const next = pattern[i + 3];

                    /*
                     * (?<=...)
                     * (?<!...)
                     */

                    if (
                        next === "=" ||
                        next === "!"
                    ) {

                        continue;
                    }

                    /*
                     * (?<name>...)
                     */

                    count++;
                }

                continue;
            }

            count++;
        }
    }

    return count;
}


/* =========================================================
   EXECUTE REGEX
   ========================================================= */

/**
 * Executes a regex against text.
 *
 * @param {string} pattern
 * @param {string} flags
 * @param {string} text
 * @returns {Object}
 */
function executeRegex(
    pattern,
    flags,
    text
) {

    const startTime = performance.now();

    const validation =
        validateRegex(pattern, flags);

    if (!validation.valid) {

        return {
            valid: false,
            error: validation.message,
            matches: [],
            count: 0,
            groups: 0,
            executionTime: 0
        };
    }


    if (!text) {

        return {
            valid: true,
            error: null,
            matches: [],
            count: 0,
            groups: countCaptureGroups(pattern),
            executionTime:
                performance.now() - startTime
        };
    }


    const regex =
        createRegex(pattern, flags);


    const matches = [];


    /*
     * Global and sticky regexes can use exec()
     * repeatedly.
     */

    if (
        flags.includes("g") ||
        flags.includes("y")
    ) {

        let match;

        while (
            (match = regex.exec(text)) !== null
        ) {

            matches.push(
                createMatchObject(match)
            );


            /*
             * Prevent infinite loops with
             * zero-length matches.
             */

            if (match[0] === "") {

                regex.lastIndex++;
            }
        }

    } else {

        const match =
            regex.exec(text);

        if (match) {

            matches.push(
                createMatchObject(match)
            );
        }
    }


    const executionTime =
        performance.now() - startTime;


    return {

        valid: true,

        error: null,

        matches,

        count: matches.length,

        groups:
            countCaptureGroups(pattern),

        executionTime
    };
}


/* =========================================================
   MATCH OBJECT
   ========================================================= */

/**
 * Converts native RegExp match data
 * into a clean RegexX object.
 *
 * @param {RegExpExecArray} match
 * @returns {Object}
 */
function createMatchObject(match) {

    const groups = [];

    /*
     * Standard numbered capture groups.
     */

    for (
        let i = 1;
        i < match.length;
        i++
    ) {

        groups.push({

            index: i,

            value:
                match[i] !== undefined
                    ? match[i]
                    : null
        });
    }


    /*
     * Named groups.
     */

    const namedGroups =
        match.groups || {};


    return {

        value: match[0],

        index: match.index,

        length: match[0].length,

        end:
            match.index +
            match[0].length,

        groups,

        namedGroups
    };
}


/* =========================================================
   HIGHLIGHT RANGES
   ========================================================= */

/**
 * Returns match ranges for highlighting.
 *
 * @param {Array} matches
 * @returns {Array}
 */
function getHighlightRanges(matches) {

    return matches.map(match => ({

        start: match.index,

        end: match.end,

        value: match.value
    }));
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

/**
 * Prevents user-provided text from being
 * interpreted as HTML.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeRegexHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   BUILD HIGHLIGHTED HTML
   ========================================================= */

/**
 * Creates highlighted HTML from text and
 * match ranges.
 *
 * @param {string} text
 * @param {Array} matches
 * @returns {string}
 */
function buildHighlightedHTML(
    text,
    matches
) {

    if (!text) {

        return `
            <span class="placeholder-text">
                Matches will appear here...
            </span>
        `;
    }


    if (!matches.length) {

        return escapeRegexHTML(text);
    }


    let output = "";
    let cursor = 0;


    matches.forEach((match, index) => {

        const start = match.index;
        const end = match.end;


        /*
         * Add normal text before match.
         */

        output += escapeRegexHTML(
            text.slice(cursor, start)
        );


        /*
         * Add highlighted match.
         */

        output += `
            <span
                class="highlight"
                title="Match ${index + 1}"
            >${escapeRegexHTML(match.value)}</span>
        `;


        cursor = end;

    });


    /*
     * Add remaining text.
     */

    output += escapeRegexHTML(
        text.slice(cursor)
    );


    return output;
}


/* =========================================================
   FORMAT EXECUTION TIME
   ========================================================= */

/**
 * Formats execution time for the UI.
 *
 * @param {number} milliseconds
 * @returns {string}
 */
function formatExecutionTime(
    milliseconds
) {

    if (
        !Number.isFinite(milliseconds)
    ) {

        return "—";
    }


    if (milliseconds < 1) {

        return "< 1 ms";
    }


    return `${milliseconds.toFixed(2)} ms`;
}