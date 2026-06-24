// Tool :: Password Generator
(function () {
  var id = "password-generator";
  var title = "Password Generator";
  var icon = "\uD83D\uDD10";
  var category = "Security";
  var description = "Generate strong passwords with custom length and character types";

  window.toolMeta.push({ id, title, icon, category, description });

  var LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  var UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var DIGITS = "0123456789";
  var SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

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
        "  <div class=\"flex-row\">",
        "    <label style=\"flex:1\">" + __('tool.' + id + '.length') + ": <strong id=\"pwLenLabel\">16</strong></label>",
        "    <span style=\"color:var(--text-tertiary);font-size:0.75rem\">8 \u2013 64</span>",
        "  </div>",
        "  <input type=\"range\" id=\"pwLength\" min=\"8\" max=\"64\" value=\"16\">",
        "  <label class=\"toggle-wrap\"><input type=\"checkbox\" id=\"pwUpper\" checked><span class=\"toggle-label\">" + __('tool.' + id + '.uppercase') + "</span></label>",
        "  <label class=\"toggle-wrap\"><input type=\"checkbox\" id=\"pwLower\" checked><span class=\"toggle-label\">" + __('tool.' + id + '.lowercase') + "</span></label>",
        "  <label class=\"toggle-wrap\"><input type=\"checkbox\" id=\"pwDigits\" checked><span class=\"toggle-label\">" + __('tool.' + id + '.digits') + "</span></label>",
        "  <label class=\"toggle-wrap\"><input type=\"checkbox\" id=\"pwSymbols\"><span class=\"toggle-label\">" + __('tool.' + id + '.symbols') + "</span></label>",
        "  <label class=\"toggle-wrap\"><input type=\"checkbox\" id=\"pwExcludeAmbiguous\"><span class=\"toggle-label\">" + __('tool.' + id + '.excludeAmbiguous') + "</span></label>",
        "  <div class=\"mt-2\">",
        "    <label>" + __('tool.' + id + '.strength') + "</label>",
        "    <div class=\"strength-meter\" id=\"pwMeter\">",
        "      <div class=\"strength-bar\"></div>",
        "      <div class=\"strength-bar\"></div>",
        "      <div class=\"strength-bar\"></div>",
        "      <div class=\"strength-bar\"></div>",
        "    </div>",
        "  </div>",
        "  <div class=\"output-box mt-2\" id=\"pwOutput\">",
        "    <span id=\"pwResult\">" + __('tool.' + id + '.clickGen') + "</span>",
        "    <button class=\"copy-btn\" id=\"pwCopyBtn\">" + __('common.copy') + "</button>",
        "  </div>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"pwGenBtn\">" + __('tool.' + id + '.genPassword') + "</button>",
        "  </div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var lenEl = document.getElementById("pwLength");
      var lenLabel = document.getElementById("pwLenLabel");
      var genBtn = document.getElementById("pwGenBtn");
      var output = document.getElementById("pwResult");
      var copyBtn = document.getElementById("pwCopyBtn");
      var meter = document.getElementById("pwMeter");
      var self = this;

      function update() {
        var len = +lenEl.value;
        lenLabel.textContent = len;
        var pw = self._generate(len);
        output.textContent = pw;
        self._updateMeter(pw, meter);
      }

      lenEl.addEventListener("input", update);
      genBtn.addEventListener("click", update);
      copyBtn.addEventListener("click", function () {
        copyToClipboard(output.textContent);
      });

      update();
    },
    destroy: function () {},

    _generate: function (len) {
      var chars = "";
      if (document.getElementById("pwLower").checked) chars += LOWERCASE;
      if (document.getElementById("pwUpper").checked) chars += UPPERCASE;
      if (document.getElementById("pwDigits").checked) chars += DIGITS;
      if (document.getElementById("pwSymbols").checked) chars += SYMBOLS;

      if (!chars) chars = LOWERCASE + UPPERCASE + DIGITS;

      if (document.getElementById("pwExcludeAmbiguous").checked) {
        chars = chars.replace(/[il1Lo0O]/g, "");
      }

      var result = "";
      var array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (var i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }
      return result;
    },

    _updateMeter: function (pw, meter) {
      var bars = meter.querySelectorAll(".strength-bar");
      var score = 0;
      if (pw.length >= 12) score++;
      if (pw.length >= 20) score++;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
      if (/\d/.test(pw)) score++;
      if (/[^a-zA-Z0-9]/.test(pw)) score++;

      var levels = ["weak", "medium", "strong", "strong"];
      bars.forEach(function (b, i) {
        b.className = "strength-bar";
        if (i < score) b.classList.add("active", levels[i] || "strong");
      });
    }
  };
})();