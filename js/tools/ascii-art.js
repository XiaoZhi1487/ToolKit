// Tool :: ASCII Art Generator
(function () {
  var id = "ascii-art";
  var title = "ASCII Art Generator";
  var icon = "🎭";
  var category = "Developer";
  var description = "Convert text to ASCII art font";

  window.toolMeta.push({ id, title, icon, category, description });

  var chars = {
    'A': [' AA ', 'A  A', 'AAAA', 'A  A', 'A  A'],
    'B': ['BBB ', 'B  B', 'BBB ', 'B  B', 'BBB '],
    'C': [' CC ', 'C   ', 'C   ', 'C   ', ' CC '],
    'D': ['DD  ', 'D  D', 'D  D', 'D  D', 'DD  '],
    'E': ['EEE ', 'E   ', 'EEE ', 'E   ', 'EEE '],
    'F': ['FFFF', 'F   ', 'FFF ', 'F   ', 'F   '],
    'G': [' GG ', 'G   ', 'G GG', 'G  G', ' GG '],
    'H': ['H  H', 'H  H', 'HHHH', 'H  H', 'H  H'],
    'I': ['III', ' I ', ' I ', ' I ', 'III'],
    'J': ['  JJ', '   J', '   J', 'J  J', ' JJ '],
    'K': ['K  K', 'K K ', 'KK  ', 'K K ', 'K  K'],
    'L': ['L   ', 'L   ', 'L   ', 'L   ', 'LLLL'],
    'M': ['M   M', 'MM MM', 'M M M', 'M   M', 'M   M'],
    'N': ['N   N', 'NN  N', 'N N N', 'N  NN', 'N   N'],
    'O': [' OO ', 'O  O', 'O  O', 'O  O', ' OO '],
    'P': ['PPP ', 'P  P', 'PPP ', 'P   ', 'P   '],
    'Q': [' QQ ', 'Q  Q', 'Q  Q', ' Q Q', '  QQ'],
    'R': ['RRR ', 'R  R', 'RRR ', 'R R ', 'R  R'],
    'S': [' SSS', 'S   ', ' SS ', '   S', 'SSS '],
    'T': ['TTTT', ' T  ', ' T  ', ' T  ', ' T  '],
    'U': ['U  U', 'U  U', 'U  U', 'U  U', ' UU '],
    'V': ['V  V', 'V  V', 'V  V', ' VV ', ' V  '],
    'W': ['W   W', 'W   W', 'W W W', 'WW WW', 'W   W'],
    'X': ['X  X', ' X ', '  X', ' X ', 'X  X'],
    'Y': ['Y  Y', ' Y ', '  Y', '  Y', '  Y'],
    'Z': ['ZZZZ', '   Z', '  Z ', ' Z  ', 'ZZZZ'],
    '0': [' OO ', 'O  O', 'O  O', 'O  O', ' OO '],
    '1': [' 1 ', ' 11', '  1', '  1', ' 111'],
    '2': [' 22 ', '   2', '  2 ', ' 2  ', '2222'],
    '3': ['333 ', '   3', ' 33 ', '   3', '333 '],
    '4': ['  4 ', ' 44 ', '4 4 ', '4444', '  4 '],
    '5': ['5555', '5   ', '555 ', '   5', '555 '],
    '6': [' 66 ', '6   ', '666 ', '6  6', ' 66 '],
    '7': ['7777', '   7', '  7 ', ' 7  ', ' 7  '],
    '8': [' 88 ', '8  8', ' 88 ', '8  8', ' 88 '],
    '9': [' 99 ', '9  9', ' 999', '   9', ' 99 '],
    ' ': [' ', ' ', ' ', ' ', ' ']
  };

  function generateAscii(text) {
    var upper = text.toUpperCase();
    var lines = ['', '', '', '', ''];
    for (var i = 0; i < upper.length; i++) {
      var ch = upper[i];
      var font = chars[ch];
      if (!font) {
        // Use the character itself for unsupported chars
        for (var r = 0; r < 5; r++) {
          lines[r] += (r === 2 ? ch : ' ') + ' ';
        }
      } else {
        for (var r = 0; r < 5; r++) {
          if (i > 0) lines[r] += ' ';
          lines[r] += font[r];
        }
      }
    }
    return lines.join('\n');
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <label>" + __('tool.' + id + '.input') + "</label>",
        "  <textarea id=\"aaInput\" rows=\"3\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"aaRunBtn\">" + __('tool.' + id + '.generate') + "</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <pre id=\"aaOutput\" style=\"background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:12px;overflow:auto;font-family:monospace;line-height:1.2;min-height:100px;white-space:pre;margin:0\" spellcheck=\"false\"></pre>",
        "  <button class=\"btn btn-secondary\" id=\"aaCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("aaInput");
      var output = document.getElementById("aaOutput");
      var runBtn = document.getElementById("aaRunBtn");
      var copyBtn = document.getElementById("aaCopyBtn");

      function run() {
        if (!input.value.trim()) {
          output.textContent = "";
          return;
        }
        output.textContent = generateAscii(input.value);
      }

      runBtn.addEventListener("click", run);
      copyBtn.addEventListener("click", function () { copyToClipboard(output.textContent); });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
    },
    destroy: function () {}
  };
})();