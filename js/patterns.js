/**
 * =========================================================
 * RegexX
 * Pattern Library
 * =========================================================
 *
 * Responsibilities:
 * - Store common regex patterns
 * - Render pattern cards
 * - Search patterns
 * - Filter by category
 * - Copy regex
 * - Load patterns into Tester
 */


/* =========================================================
   PATTERN DATA
   ========================================================= */

const REGEX_PATTERNS = [

    /* =====================================================
       EMAIL
    ===================================================== */

    {
        id: "email",
        name: "Email Address",
        category: "Email",
        icon: "📧",
        description:
            "Matches common email addresses.",

        regex:
            "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}",

        example:
            "samir@example.com"
    },


    /* =====================================================
       URL
    ===================================================== */

    {
        id: "url",
        name: "URL",
        category: "Web",
        icon: "🌐",
        description:
            "Matches HTTP and HTTPS URLs.",

        regex:
            "https?:\\/\\/(?:www\\.)?[^\\s]+",

        example:
            "https://example.com"
    },


    /* =====================================================
       PHONE
    ===================================================== */

    {
        id: "phone",
        name: "Phone Number",
        category: "Phone",
        icon: "📱",
        description:
            "Matches common phone number formats.",

        regex:
            "\\+?[0-9]{1,3}[\\s.-]?[0-9]{3,4}[\\s.-]?[0-9]{3,4}",

        example:
            "+977-9812345678"
    },


    /* =====================================================
       NUMBERS
    ===================================================== */

    {
        id: "integer",
        name: "Integer",
        category: "Numbers",
        icon: "🔢",
        description:
            "Matches positive and negative whole numbers.",

        regex:
            "-?\\d+",

        example:
            "-125"
    },


    {
        id: "decimal",
        name: "Decimal Number",
        category: "Numbers",
        icon: "🔢",
        description:
            "Matches integers and decimal numbers.",

        regex:
            "-?\\d+(?:\\.\\d+)?",

        example:
            "125.50"
    },


    {
        id: "positive-number",
        name: "Positive Number",
        category: "Numbers",
        icon: "➕",
        description:
            "Matches positive integers and decimals.",

        regex:
            "\\d+(?:\\.\\d+)?",

        example:
            "42.75"
    },


    /* =====================================================
       DATE & TIME
    ===================================================== */

    {
        id: "date",
        name: "Date",
        category: "Date & Time",
        icon: "📅",
        description:
            "Matches common YYYY-MM-DD date formats.",

        regex:
            "\\d{4}-\\d{2}-\\d{2}",

        example:
            "2026-08-24"
    },


    {
        id: "time",
        name: "Time",
        category: "Date & Time",
        icon: "⏰",
        description:
            "Matches 24-hour HH:MM time format.",

        regex:
            "(?:[01]\\d|2[0-3]):[0-5]\\d",

        example:
            "20:45"
    },


    {
        id: "datetime",
        name: "Date & Time",
        category: "Date & Time",
        icon: "🕐",
        description:
            "Matches ISO-style date and time.",

        regex:
            "\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d",

        example:
            "2026-08-24T20:45"
    },


    /* =====================================================
       USERNAME & PASSWORD
    ===================================================== */

    {
        id: "username",
        name: "Username",
        category: "Account",
        icon: "👤",
        description:
            "Matches usernames containing letters, numbers, and underscores.",

        regex:
            "^[A-Za-z0-9_]{3,20}$",

        example:
            "samir_123"
    },


    {
        id: "strong-password",
        name: "Strong Password",
        category: "Account",
        icon: "🔐",
        description:
            "Requires uppercase, lowercase, number, and special character.",

        regex:
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$",

        example:
            "Strong@123"
    },


    /* =====================================================
       IP ADDRESS
    ===================================================== */

    {
        id: "ipv4",
        name: "IPv4 Address",
        category: "Network",
        icon: "🌐",
        description:
            "Matches IPv4-style addresses.",

        regex:
            "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",

        example:
            "192.168.1.100"
    },


    {
        id: "ipv6",
        name: "IPv6 Address",
        category: "Network",
        icon: "🌍",
        description:
            "Matches a simplified IPv6 address format.",

        regex:
            "(?:[0-9A-Fa-f]{1,4}:){2,7}[0-9A-Fa-f]{1,4}",

        example:
            "2001:db8::1"
    },


    /* =====================================================
       CREDIT CARD
    ===================================================== */

    {
        id: "credit-card",
        name: "Credit Card",
        category: "Finance",
        icon: "💳",
        description:
            "Matches common 13–19 digit card number formats.",

        regex:
            "\\b(?:\\d[ -]*?){13,19}\\b",

        example:
            "4111 1111 1111 1111"
    },


    /* =====================================================
       HEX COLOR
    ===================================================== */

    {
        id: "hex-color",
        name: "Hex Color",
        category: "Web",
        icon: "🎨",
        description:
            "Matches 3 or 6 digit hexadecimal colors.",

        regex:
            "#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\\b",

        example:
            "#6366f1"
    },


    /* =====================================================
       HTML TAG
    ===================================================== */

    {
        id: "html-tag",
        name: "HTML Tag",
        category: "Development",
        icon: "🏷️",
        description:
            "Matches basic HTML opening and closing tags.",

        regex:
            "<\\/?[A-Za-z][^>]*>",

        example:
            "<div>"
    },


    /* =====================================================
       ALPHABETIC
    ===================================================== */

    {
        id: "letters",
        name: "Letters Only",
        category: "Text",
        icon: "🔤",
        description:
            "Matches strings containing only alphabetic characters.",

        regex:
            "^[A-Za-z]+$",

        example:
            "RegexX"
    },


    {
        id: "lowercase",
        name: "Lowercase Only",
        category: "Text",
        icon: "🔡",
        description:
            "Matches strings containing only lowercase letters.",

        regex:
            "^[a-z]+$",

        example:
            "regexx"
    },


    {
        id: "uppercase",
        name: "Uppercase Only",
        category: "Text",
        icon: "🔠",
        description:
            "Matches strings containing only uppercase letters.",

        regex:
            "^[A-Z]+$",

        example:
            "REGEXX"
    },


    /* =====================================================
       ALPHANUMERIC
    ===================================================== */

    {
        id: "alphanumeric",
        name: "Alphanumeric",
        category: "Text",
        icon: "🔤",
        description:
            "Matches letters and numbers only.",

        regex:
            "^[A-Za-z0-9]+$",

        example:
            "RegexX2026"
    },


    /* =====================================================
       WHITESPACE
    ===================================================== */

    {
        id: "whitespace",
        name: "Whitespace",
        category: "Text",
        icon: "⬜",
        description:
            "Matches whitespace characters.",

        regex:
            "\\s+",

        example:
            "   "
    },


    /* =====================================================
       WORD
    ===================================================== */

    {
        id: "word",
        name: "Word",
        category: "Text",
        icon: "📝",
        description:
            "Matches word characters.",

        regex:
            "\\b\\w+\\b",

        example:
            "RegexX"
    },


    /* =====================================================
       ZIP CODE
    ===================================================== */

    {
        id: "zip-code",
        name: "US ZIP Code",
        category: "Location",
        icon: "📮",
        description:
            "Matches five-digit US ZIP codes with optional extension.",

        regex:
            "\\b\\d{5}(?:-\\d{4})?\\b",

        example:
            "10001-1234"
    },


    /* =====================================================
       MAC ADDRESS
    ===================================================== */

    {
        id: "mac-address",
        name: "MAC Address",
        category: "Network",
        icon: "🖧",
        description:
            "Matches common colon-separated MAC addresses.",

        regex:
            "(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}",

        example:
            "00:1A:2B:3C:4D:5E"
    },


    /* =====================================================
       UUID
    ===================================================== */

    {
        id: "uuid",
        name: "UUID",
        category: "Development",
        icon: "🆔",
        description:
            "Matches standard UUID version formats.",

        regex:
            "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}",

        example:
            "550e8400-e29b-41d4-a716-446655440000"
    }

];


/* =========================================================
   PATTERN STATE
   ========================================================= */

let currentPatternSearch = "";
let currentPatternCategory = "All";


/* =========================================================
   DOM ELEMENT
   ========================================================= */

const patternGrid =
    document.getElementById(
        "patternGrid"
    );


/* =========================================================
   GET CATEGORIES
   ========================================================= */

function getPatternCategories() {

    return [
        "All",
        ...new Set(
            REGEX_PATTERNS.map(
                pattern =>
                    pattern.category
            )
        )
    ];
}


/* =========================================================
   FILTER PATTERNS
   ========================================================= */

function getFilteredPatterns() {

    return REGEX_PATTERNS.filter(
        pattern => {

            const matchesCategory =
                currentPatternCategory ===
                    "All" ||
                pattern.category ===
                    currentPatternCategory;


            const search =
                currentPatternSearch
                    .trim()
                    .toLowerCase();


            if (!search) {

                return matchesCategory;
            }


            const searchableText = [

                pattern.name,

                pattern.category,

                pattern.description,

                pattern.regex,

                pattern.example

            ]
                .join(" ")
                .toLowerCase();


            return (
                matchesCategory &&
                searchableText.includes(
                    search
                )
            );

        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapePatternHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   RENDER CATEGORY FILTER
   ========================================================= */

function renderPatternFilters() {

    const categories =
        getPatternCategories();


    const existingFilter =
        document.getElementById(
            "patternFilters"
        );


    if (existingFilter) {

        existingFilter.remove();
    }


    const filterContainer =
        document.createElement(
            "div"
        );


    filterContainer.id =
        "patternFilters";

    filterContainer.className =
        "pattern-filters";


    filterContainer.innerHTML = `

        <div class="pattern-search">

            <span class="search-icon">
                🔎
            </span>

            <input
                id="patternSearch"
                type="search"
                placeholder="Search patterns..."
                autocomplete="off"
            >

        </div>


        <div class="pattern-categories">

            ${categories.map(
                category => `

                    <button
                        class="
                            pattern-category
                            ${
                                category ===
                                currentPatternCategory
                                    ? "active"
                                    : ""
                            }
                        "
                        data-category="${escapePatternHTML(
                            category
                        )}"
                        type="button"
                    >
                        ${escapePatternHTML(
                            category
                        )}
                    </button>

                `
            ).join("")}

        </div>

    `;


    /*
     * Insert before pattern grid.
     */

    patternGrid.parentNode.insertBefore(
        filterContainer,
        patternGrid
    );


    const searchInput =
        document.getElementById(
            "patternSearch"
        );


    searchInput.addEventListener(
        "input",
        event => {

            currentPatternSearch =
                event.target.value;

            renderPatternCards();
        }
    );


    filterContainer
        .querySelectorAll(
            ".pattern-category"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentPatternCategory =
                        button.dataset.category;

                    renderPatternFilters();

                    renderPatternCards();
                }
            );

        });

}


/* =========================================================
   RENDER PATTERN CARDS
   ========================================================= */

function renderPatternCards() {

    const patterns =
        getFilteredPatterns();


    if (!patterns.length) {

        patternGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔍
                </div>

                <h3>
                    No patterns found
                </h3>

                <p>
                    Try another search term
                    or category.
                </p>

            </div>

        `;

        return;
    }


    patternGrid.innerHTML =
        patterns.map(
            pattern => `

                <article
                    class="pattern-card"
                    data-pattern-id="${pattern.id}"
                >

                    <div class="pattern-card-header">

                        <div class="pattern-icon">
                            ${pattern.icon}
                        </div>

                        <div>

                            <h3>
                                ${escapePatternHTML(
                                    pattern.name
                                )}
                            </h3>

                            <span class="pattern-category-label">
                                ${escapePatternHTML(
                                    pattern.category
                                )}
                            </span>

                        </div>

                    </div>


                    <p class="pattern-description">
                        ${escapePatternHTML(
                            pattern.description
                        )}
                    </p>


                    <div class="pattern-code">

                        <code>
                            ${escapePatternHTML(
                                pattern.regex
                            )}
                        </code>

                    </div>


                    <div class="pattern-example">

                        <span>
                            Example
                        </span>

                        <code>
                            ${escapePatternHTML(
                                pattern.example
                            )}
                        </code>

                    </div>


                    <div class="pattern-actions">

                        <button
                            class="btn btn-secondary btn-small pattern-copy-btn"
                            data-id="${pattern.id}"
                            type="button"
                        >
                            📋 Copy
                        </button>


                        <button
                            class="btn btn-primary btn-small pattern-use-btn"
                            data-id="${pattern.id}"
                            type="button"
                        >
                            🔎 Use
                        </button>

                    </div>

                </article>

            `
        ).join("");


    attachPatternActions();
}


/* =========================================================
   GET PATTERN
   ========================================================= */

function getPatternById(id) {

    return REGEX_PATTERNS.find(
        pattern =>
            pattern.id === id
    );
}


/* =========================================================
   COPY PATTERN
   ========================================================= */

async function copyPattern(id) {

    const pattern =
        getPatternById(id);


    if (!pattern) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            pattern.regex
        );


        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                `${pattern.name} copied`
            );
        }

    } catch {

        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                "Unable to copy pattern"
            );
        }
    }
}


/* =========================================================
   USE PATTERN IN TESTER
   ========================================================= */

function usePattern(id) {

    const pattern =
        getPatternById(id);


    if (!pattern) {
        return;
    }


    /*
     * Tester input comes from app.js.
     */

    if (
        typeof regexInput !==
        "undefined"
    ) {

        regexInput.value =
            pattern.regex;
    }


    /*
     * Activate Tester tab.
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
     * Run regex immediately.
     */

    if (
        typeof runRegexTest ===
        "function"
    ) {

        runRegexTest();
    }


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            `${pattern.name} loaded into Tester`
        );
    }
}


/* =========================================================
   ATTACH CARD ACTIONS
   ========================================================= */

function attachPatternActions() {

    document
        .querySelectorAll(
            ".pattern-copy-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    copyPattern(
                        button.dataset.id
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".pattern-use-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    usePattern(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================================================
   INITIALIZE PATTERN LIBRARY
   ========================================================= */

function initializePatternLibrary() {

    if (!patternGrid) {
        return;
    }


    renderPatternFilters();

    renderPatternCards();
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePatternLibrary
    );

} else {

    initializePatternLibrary();
}