// Tool :: Text Reverser
(function () {
  var id = "text-reverser";
  var title = "Text Reverser";
  var icon = "\ud83d\udd04";
  var category = "Text";
  var description = "Reverse text, words, or line order";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-reverser.input") + "</label>" +
        "<textarea id=\"trvInput\" rows=\"6\" placeholder=\"Hello World\nLine Two\nLine Three\"></textarea>" +
        "<div class=\"flex-row\" style=\"gap:6px;flex-wrap:wrap\">" +
        "  <button class=\"btn btn-sm\" id=\"trvReverseText\">" + __("tool.text-reverser.reverseText") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"trvReverseWords\">" + __("tool.text-reverser.reverseWords") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"trvReverseLines\">" + __("tool.text-reverser.reverseLines") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"trvInvertCase\">" + __("tool.text-reverser.invertCase") + "</button>" +
        "</div>" +
        "<label>" + __("tool.text-reverser.result") + "</label>" +
        "<textarea id=\"trvOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"trvCopyBtn\">" + __("tool.text-reverser.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("trvInput");
      var output = document.getElementById("trvOutput");
      var copyBtn = document.getElementById("trvCopyBtn");
      function reverseText() {
        output.value = input.value.split("").reverse().join("");
      }
      function reverseWords() {
        output.value = input.value.split(" ").reverse().join(" ");
      }
      function reverseLines() {
        output.value = input.value.split("\n").reverse().join("\n");
      }
      function invertCase() {
        var text = input.value;
        var result = "";
        for (var i = 0; i < text.length; i++) {
          var ch = text.charAt(i);
          if (ch === ch.toUpperCase()) result += ch.toLowerCase();
          else result += ch.toUpperCase();
        }
        output.value = result;
      }
      document.getElementById("trvReverseText").addEventListener("click", reverseText);
      document.getElementById("trvReverseWords").addEventListener("click", reverseWords);
      document.getElementById("trvReverseLines").addEventListener("click", reverseLines);
      document.getElementById("trvInvertCase").addEventListener("click", invertCase);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();