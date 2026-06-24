# ToolKit · QianGong — Tool Development Guide

This document describes how to add new tools to the ToolKit project. Follow this guide if you are an AI coding agent extending the tool collection.

---

## Architecture Overview

Every tool is a **self-contained IIFE** (Immediately Invoked Function Expression) that registers itself into:

- `window.toolMeta` — metadata array used for search, filtering, and the homepage grid
- `window.tools` — the tool implementation with `render()`, `init()`, `destroy()` lifecycle

The core app (`js/app.js`) handles navigation, search, category filtering, theme toggling, and URL routing automatically. You only need to create one file and register it in `index.html`.

---

## Step-by-step: Adding a Tool

### 1. Create the file

Path: `js/tools/your-tool-name.js`

### 2. File template

```js
// Tool :: Your Tool Name
(function () {
  var id = "your-tool-name";
  var title = "Your Tool Name";
  var icon = "\ud83d\udd27";
  var category = "Developer";
  var description = "Short description for the card (max 80 chars)";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id: id, title: title, icon: icon,

    /* --- Render: return the tool DOM element --- */
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + title + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <label>Input</label>",
        "  <textarea id=\"myInput\" rows=\"4\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"myBtn\">Run</button>",
        "  </div>",
        "  <div class=\"output-box\" id=\"myOutput\">Result</div>",
        "</div>"
      ].join("");
      return box;
    },

    /* --- Init: bind events, run initial state --- */
    init: function () {
      var input = document.getElementById("myInput");
      var btn = document.getElementById("myBtn");
      var output = document.getElementById("myOutput");

      btn.addEventListener("click", function () {
        output.textContent = doSomething(input.value);
      });
    },

    /* --- Destroy: cleanup timers, intervals, observers --- */
    destroy: function () {
      // clearInterval(this._timer);
      // this._observer.disconnect();
    }
  };
})();
```

### 3. Register the script

Add a `<script>` tag at the bottom of `index.html`:

```html
<script src="js/tools/your-tool-name.js"></script>
```

---

## Lifecycle & Requirements

| Method    | When it runs              | What to do                              |
|-----------|---------------------------|----------------------------------------|
| render()  | User clicks the tool card | Build and return a DOM element. Use var, never const/let. |
| init()    | After render() DOM is attached | Bind addEventListener, populate initial state, start timers. |
| destroy() | User navigates away       | Clear setInterval, setTimeout, ResizeObserver, disconnect websockets. |

### Rules

1. **Use var not const/let** — the IIFE is re-executable; var allows redeclaration.
2. **Use function expressions not arrow functions** in object methods.
3. **IDs must be unique** — prefix every DOM id with your tool name.
4. **Use CSS classes from style.css** — .btn, .btn-primary, .btn-secondary, .output-box, .tool-body, .tool-header, .tool-content, .btn-group, .grid-2, .flex-row, .tab-bar, .tab-btn, .toggle-wrap, .strength-meter.
5. **Clean up in destroy()** — timers, intervals, and observers must be cleared.
6. **render() returns a Node** — it must return a single DOM element, not a string.
7. **Strings use + concatenation** — prefer array .join("") over template literals.
8. **Register right away** — the IIFE must push to toolMeta and tools synchronously.

---

## Categories

| Category       | Used for                                           |
|---------------|----------------------------------------------------|
| "Developer"    | JSON, Base64, URL, UUID, Regex, Timestamp, Hash, CSV |
| "Text"         | Text Analyzer, Markdown Preview, Case Converter, Diff |
| "Security"     | Password Generator, Hash Generator                 |
| "Design"       | Color Palette                                      |
| "Productivity" | Pomodoro                                           |
| "Media"        | QR Code, Image to Base64                           |
| "Converter"    | Number Base, Case Converter, Timestamp, CSV        |

---

## Available Icons

- Developer: wrench (tool), gear, braces {}, key
- Text: memo, chart, magnifying glass
- Media: camera, image frame
- Security: lock, key
- Productivity: timer, checkmark
- Design: palette, square
- Converter: arrows, left-right arrow

Use any Unicode emoji. Prefer the category-matching suggestions above.

---

## Testing Checklist

Before committing a new tool, verify:

- [ ] render() returns a valid DOM element
- [ ] All IDs are prefixed with tool name
- [ ] init() binds event listeners to elements that exist
- [ ] destroy() clears timers/observers
- [ ] No const or let — use var
- [ ] toolMeta.push() and window.tools[id] are set
- [ ] Script is registered in index.html
- [ ] Works in dark mode and light mode
- [ ] Responsive on mobile (test at 375px width)

---

## Example: Minimal Tool

```js
// Tool :: Hello World
(function () {
  var id = "hello-world";
  var title = "Hello World";
  var icon = "\ud83d\udc4b";
  var category = "Developer";
  var description = "A minimal example tool";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"output-box\" id=\"helloOutput\">Hello, World!</div>" +
        "</div>";
      return box;
    },
    init: function () {},
    destroy: function () {}
  };
})();
```

Now go build something useful.
