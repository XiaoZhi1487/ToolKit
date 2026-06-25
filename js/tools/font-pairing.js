// Tool :: Font Pairing Preview
(function () {
  var id = "font-pairing";
  var title = "Font Pairing";
  var icon = "\ud83d\udd24";
  var category = "Design";
  var description = "Preview Google Fonts combinations";
  window.toolMeta.push({ id, title, icon, category, description });

  var fonts = [
    { name: 'Roboto', category: 'sans-serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Lato', category: 'sans-serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Poppins', category: 'sans-serif' },
    { name: 'Inter', category: 'sans-serif' },
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Merriweather', category: 'serif' },
    { name: 'Lora', category: 'serif' },
    { name: 'PT Serif', category: 'serif' },
    { name: 'Oswald', category: 'sans-serif' },
    { name: 'Raleway', category: 'sans-serif' },
    { name: 'Nunito', category: 'sans-serif' },
    { name: 'Source Sans Pro', category: 'sans-serif' },
    { name: 'Fira Sans', category: 'sans-serif' },
    { name: 'Ubuntu', category: 'sans-serif' },
    { name: 'Roboto Condensed', category: 'sans-serif' },
    { name: 'Roboto Slab', category: 'serif' },
    { name: 'Crimson Text', category: 'serif' },
    { name: 'Work Sans', category: 'sans-serif' },
    { name: 'Josefin Sans', category: 'sans-serif' },
    { name: 'Quicksand', category: 'sans-serif' },
    { name: 'DM Sans', category: 'sans-serif' },
    { name: 'Mulish', category: 'sans-serif' },
  ];

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.font-pairing.heading") + "</label><select id=\"fpHeading\"></select></div>" +
        "  <div><label>" + __("tool.font-pairing.body") + "</label><select id=\"fpBody\"></select></div>" +
        "</div>" +
        "<label>" + __("tool.font-pairing.sampleText") + "</label>" +
        "<input type=\"text\" id=\"fpSampleText\" class=\"btn btn-secondary\" style=\"width:100%;text-align:left;padding:var(--spacing-sm);font-size:0.875rem\" value=\"The quick brown fox jumps over the lazy dog\">" +
        "<div id=\"fpPreview\" style=\"border:1px solid var(--bg-card-border);border-radius:var(--radius-md);padding:var(--spacing-lg);margin:var(--spacing-md) 0;min-height:200px\">" +
        "  <div id=\"fpHeadingPreview\" style=\"font-size:2rem;font-weight:700;margin-bottom:var(--spacing-md)\">The quick brown fox</div>" +
        "  <div id=\"fpBodyPreview\" style=\"font-size:1rem;line-height:1.6\">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.</div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"fpLoadBtn\">" + __("tool.font-pairing.load") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var headingSelect = document.getElementById("fpHeading");
      var bodySelect = document.getElementById("fpBody");
      var sampleText = document.getElementById("fpSampleText");
      var loadBtn = document.getElementById("fpLoadBtn");
      var headingPreview = document.getElementById("fpHeadingPreview");
      var bodyPreview = document.getElementById("fpBodyPreview");

      function populateSelect(sel, selectedIndex) {
        var groups = {};
        fonts.forEach(function (f) {
          if (!groups[f.category]) groups[f.category] = [];
          groups[f.category].push(f);
        });
        sel.innerHTML = Object.keys(groups).map(function (cat) {
          var opts = groups[cat].map(function (f) {
            return "<option value=\"" + f.name + "\">" + f.name + "</option>";
          }).join("");
          return "<optgroup label=\"" + cat + "\">" + opts + "</optgroup>";
        }).join("");
        if (selectedIndex !== undefined) sel.selectedIndex = selectedIndex;
      }

      populateSelect(headingSelect, 0);
      populateSelect(bodySelect, 6);

      function loadFonts() {
        var headingFont = headingSelect.value;
        var bodyFont = bodySelect.value;
        var text = sampleText.value || "The quick brown fox jumps over the lazy dog";
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(headingFont.replace(/ /g,'+')) + ':wght@400;700&family=' + encodeURIComponent(bodyFont.replace(/ /g,'+')) + ':wght@400;700&display=swap';
        document.head.appendChild(link);
        headingPreview.style.fontFamily = "'" + headingFont + "', " + (fonts.find(function(f){return f.name===headingFont;})||{}).category || 'sans-serif';
        headingPreview.textContent = text;
        bodyPreview.style.fontFamily = "'" + bodyFont + "', " + (fonts.find(function(f){return f.name===bodyFont;})||{}).category || 'sans-serif';
        bodyPreview.textContent = text + " " + text.toLowerCase();
        loadBtn.textContent = __("tool.font-pairing.loading");
        setTimeout(function () {
          loadBtn.textContent = __("tool.font-pairing.load");
        }, 3000);
      }

      loadBtn.addEventListener("click", loadFonts);
      loadFonts();
    },
    destroy: function () {}
  };
})();