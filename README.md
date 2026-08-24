# 🔎 RegexX

> **A lightweight, interactive Regular Expression Tester, Builder, and Pattern Library built for developers and learners.**

RegexX is a modern browser-based tool for **creating, testing, exploring, and saving regular expressions**. It provides a clean interface for writing regex patterns, testing them against sample text, analyzing matches, building patterns visually, and managing reusable regex patterns.

No backend. No database. No complicated setup.

**Just open RegexX, write a pattern, and start testing.**

---

## ✨ Features

### 🧪 Regex Tester

* Write and test regular expressions instantly
* Test regex against custom text
* Real-time match detection
* Match count
* Capture group count
* Execution time
* Regex status feedback
* Highlighted matches
* Detailed match results

### 🚩 Regex Flags

Support for common JavaScript regex flags:

| Flag | Description |
| ---- | ----------- |
| `g`  | Global      |
| `i`  | Ignore Case |
| `m`  | Multiline   |
| `s`  | Dot All     |
| `u`  | Unicode     |
| `y`  | Sticky      |

Active flags are displayed directly in the tester interface.

### 🧱 Regex Builder

Build regular expressions using reusable building blocks instead of writing everything manually.

Useful for beginners who are learning:

* Character classes
* Quantifiers
* Anchors
* Groups
* Lookarounds
* Common regex structures

### 📚 Pattern Library

RegexX includes a collection of commonly used regex patterns.

| Category        | Patterns                                          |
| --------------- | ------------------------------------------------- |
| 📧 Email        | Email Address                                     |
| 🌐 Web          | URL, Hex Color                                    |
| 📱 Phone        | Phone Number                                      |
| 🔢 Numbers      | Integer, Decimal, Positive Number                 |
| 📅 Date & Time  | Date, Time, Date & Time                           |
| 👤 Account      | Username, Strong Password                         |
| 🌍 Network      | IPv4, IPv6, MAC Address                           |
| 💳 Finance      | Credit Card                                       |
| 🏷️ Development | HTML Tag, UUID                                    |
| 🔤 Text         | Letters, Lowercase, Uppercase, Alphanumeric, Word |
| 📮 Location     | US ZIP Code                                       |

### 🔎 Pattern Search & Filtering

* Search patterns by name
* Search by category
* Search descriptions
* Search regex expressions
* Search examples
* Filter patterns by category

### 💾 Saved Patterns

Save frequently used regex patterns directly in your browser.

Features:

* Save custom patterns
* Add pattern names
* Add descriptions
* Prevent duplicate patterns
* Load saved patterns into Tester
* Copy saved patterns
* Delete individual patterns
* Clear all saved patterns
* Persist patterns using `localStorage`

### 📋 Clipboard Support

Copy regex patterns with one click.

RegexX supports:

* Modern Clipboard API
* Fallback clipboard functionality for local development

### 🌙 Theme Support

Switch between:

* ☀️ Light Theme
* 🌙 Dark Theme

RegexX also respects the user's system color preference when no theme has been saved.

### 🧹 Clear & Sample Data

Quickly reset the tester or load sample data.

**Clear** resets:

* Regex pattern
* Test text
* Flags
* Match statistics
* Regex status
* Highlighted results

**Sample** loads a ready-to-test email regex example.

### ⌨️ Keyboard Shortcuts

| Shortcut           | Action         |
| ------------------ | -------------- |
| `Ctrl + Enter`     | Run Regex Test |
| `Cmd + Enter`      | Run Regex Test |
| `Ctrl + Shift + S` | Save Regex     |
| `Cmd + Shift + S`  | Save Regex     |

---

## 🖥️ Interface

RegexX is organized around several core sections:

```text
┌───────────────────────────────────────────┐
│                  RegexX                   │
├───────────────────────────────────────────┤
│ Tester │ Builder │ Patterns │ Saved       │
├───────────────────────────────────────────┤
│                                           │
│ Regex Pattern                             │
│ ┌───────────────────────────────────────┐ │
│ │ \b\w+@\w+\.\w+\b                     │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ Flags: g i m s u y                        │
│                                           │
│ Test Input                                │
│ ┌───────────────────────────────────────┐ │
│ │ samir@example.com                     │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ Matches │ Groups │ Execution Time         │
│                                           │
│ Highlighted Results                       │
└───────────────────────────────────────────┘
```

---

## 📸 Screenshots

Add screenshots of your application here.

### 🧪 Regex Tester

```md
![RegexX Tester](screenshots/tester.png)
```

### 🧱 Regex Builder

```md
![RegexX Builder](screenshots/builder.png)
```

### 📚 Pattern Library

```md
![RegexX Patterns](screenshots/patterns.png)
```

### 💾 Saved Patterns

```md
![RegexX Saved Patterns](screenshots/saved.png)
```

> Replace the image paths with your actual screenshot locations.

---

## 🛠️ Tech Stack

RegexX is built using standard web technologies.

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| HTML5             | Application structure            |
| CSS3              | Styling and responsive interface |
| JavaScript        | Application logic                |
| JavaScript RegExp | Regex processing                 |
| LocalStorage API  | Persistent saved patterns        |
| Clipboard API     | Copy functionality               |

### No Backend Required

RegexX runs entirely in the browser.

```text
Browser
   │
   ├── HTML
   ├── CSS
   ├── JavaScript
   │
   ├── Regex Engine
   ├── Pattern Library
   └── LocalStorage
```

---

## 📁 Project Structure

```text
RegexX/
│
├── index.html
├── README.md
├── LICENSE
│
├── css/
│   └── style.css
│
└── js/
    ├── app.js
    ├── regex-engine.js
    ├── builder.js
    ├── patterns.js
    └── storage.js
```

---

## 🧩 JavaScript Modules

### `app.js`

Main application controller.

Handles:

* Tab navigation
* Regex input
* Test input
* Regex flags
* Theme switching
* Sample data
* Clear functionality
* Copy functionality
* Save functionality
* Keyboard shortcuts
* Toast notifications
* Application initialization

### `regex-engine.js`

Responsible for executing and analyzing regular expressions.

Handles:

* Regex compilation
* Regex validation
* Matching
* Match statistics
* Capture groups
* Execution information
* Result rendering

### `builder.js`

Controls the Regex Builder.

Provides reusable components for constructing regex patterns.

### `patterns.js`

Contains the RegexX pattern library.

Handles:

* Pattern definitions
* Pattern search
* Category filtering
* Pattern cards
* Copy pattern
* Use pattern in Tester

### `storage.js`

Manages saved regex patterns.

Handles:

* `localStorage`
* Save
* Load
* Delete
* Clear
* Copy
* Saved pattern rendering

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.compokhrelsamir/RegexX.git
```

### 2. Navigate to the Project

```bash
cd RegexX
```

### 3. Open the Application

Simply open:

```text
index.html
```

in your browser.

No package installation is required.

---

## 🌐 Run with a Local Server

For the best development experience, use a local server.

### VS Code Live Server

Open the project in VS Code and launch `index.html` using **Live Server**.

### Python

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 🧪 Example

Try this regex:

```regex
\b\w+@\w+\.\w+\b
```

With:

```text
Contact us at:
samir@example.com
admin@regexx.dev
hello@test.org

Invalid:
example.com
user@invalid
```

RegexX will identify the valid email addresses.

---

## 💾 Data Storage

Saved regex patterns are stored locally using the browser's `localStorage`.

Storage key:

```text
regexx_saved_patterns
```

A saved pattern contains information such as:

```json
{
  "id": "pattern-id",
  "name": "Email Pattern",
  "pattern": "\\b\\w+@\\w+\\.\\w+\\b",
  "description": "Matches email addresses",
  "createdAt": "2026-08-24T00:00:00.000Z"
}
```

### 🔐 Privacy

RegexX does not require an account or backend database.

Saved patterns remain inside the browser's local storage.

Clearing browser storage may remove saved patterns.

---

## 📱 Responsive Design

RegexX is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The interface adapts to different screen sizes while keeping the regex tester easy to use.

---

## 🎯 Use Cases

RegexX can be useful for:

* 👨‍💻 Developers
* 🎓 Students
* 🧑‍🏫 Programming instructors
* 🔐 Security learners
* 🧪 QA engineers
* 📊 Data analysts
* 🌐 Web developers
* 📝 Technical learners

Common tasks include:

* Validating emails
* Extracting URLs
* Finding phone numbers
* Testing IP addresses
* Validating usernames
* Checking passwords
* Extracting numbers
* Matching dates
* Finding HTML tags
* Testing custom patterns

---

## 🧠 Learning Regex

RegexX can also be used as a learning tool.

### Common Regex Symbols

| Symbol  | Meaning               |
| ------- | --------------------- |
| `.`     | Any character         |
| `\d`    | Digit                 |
| `\w`    | Word character        |
| `\s`    | Whitespace            |
| `^`     | Start of string       |
| `$`     | End of string         |
| `*`     | Zero or more          |
| `+`     | One or more           |
| `?`     | Zero or one           |
| `{n}`   | Exactly n times       |
| `{n,m}` | Between n and m times |
| `[]`    | Character class       |
| `()`    | Capturing group       |
| `\|`    | Alternation           |
| `\b`    | Word boundary         |

---

## ⚡ Design Goals

RegexX focuses on:

* **Simplicity** — Easy to understand and use
* **Speed** — Instant browser-based processing
* **Learning** — Helpful for beginners
* **Reusability** — Save and reuse patterns
* **Privacy** — No backend required
* **Accessibility** — Clear interface and feedback
* **Maintainability** — Modular JavaScript architecture

---

## 🔮 Future Improvements

Possible future enhancements include:

* Regex explanation generator
* Regex syntax highlighting
* Import/export saved patterns
* JSON export
* Regex history
* More pattern categories
* Advanced builder components
* Regex performance analysis
* Shareable regex links
* Custom pattern collections
* Additional keyboard shortcuts
* More accessibility improvements
* Progressive Web App support

---

## 🤝 Contributing

Contributions are welcome!

### Fork the Repository

```bash
git fork https://github.com/yourusername/RegexX
```

### Create a Branch

```bash
git checkout -b feature/new-feature
```

### Make Your Changes

Improve the application, fix bugs, or add new functionality.

### Commit

```bash
git commit -m "Add new regex feature"
```

### Push

```bash
git push origin feature/new-feature
```

Then create a Pull Request.

---

## 🐛 Bug Reports

If you discover a bug, please open an issue with:

* Description of the problem
* Steps to reproduce
* Expected behavior
* Actual behavior
* Browser and version
* Screenshots, if applicable

---

## 📄 License

RegexX is open-source software licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for more information.

---

## 👨‍💻 Author

**Samir Pokhrel**

B.Sc. CSIT Student & Developer

### 🔗 Connect

* GitHub: `https://github.com/yourusername`
* Portfolio: `https://yourportfolio.com`

> Replace the placeholder links with your actual profiles.

---

## ⭐ Support

If you find RegexX useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report bugs
* 💡 Suggest features
* 🤝 Contribute improvements

---

## 🔎 RegexX

**Write. Test. Build. Save. Master Regex.**

Made using HTML, CSS & JavaScript.

**© 2026 Samir Pokhrel**
