// Tool :: Hash Generator
(function () {
  var id = "hash-generator";
  var title = "Hash Generator";
  var icon = "\ud83d\udd12";
  var category = "Security";
  var description = "Generate MD5, SHA-1, SHA-256, SHA-512 hashes of text";
  window.toolMeta.push({ id, title, icon, category, description });

  // Convert string to ArrayBuffer
  function strToBuf(str) {
    var encoder = new TextEncoder();
    return encoder.encode(str).buffer;
  }

  function bufToHex(buf) {
    var bytes = new Uint8Array(buf);
    var out = [];
    for (var i = 0; i < bytes.length; i++) {
      out.push(bytes[i].toString(16).padStart(2, "0"));
    }
    return out.join("");
  }

  async function generateHash(text, algo) {
    if (!text) return "";
    var buf = strToBuf(text);
    var hashBuf = await crypto.subtle.digest(algo, buf);
    return bufToHex(hashBuf);
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.hash-generator.inputText") + "</label>" +
        "<textarea id=\"hgInput\" rows=\"4\" placeholder=\"" + __("tool.hash-generator.placeholder") + "\">Hello World</textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"hgGenBtn\">" + __("tool.hash-generator.generateAll") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"hgClearBtn\">" + __("common.clear") + "</button>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\">" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary);font-family:var(--font-sans);margin-bottom:4px\">" + __("tool.hash-generator.md5") + "</div>" +
        "    <div id=\"hgMd5\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\">" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary);font-family:var(--font-sans);margin-bottom:4px\">" + __("tool.hash-generator.sha1") + "</div>" +
        "    <div id=\"hgSha1\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\">" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary);font-family:var(--font-sans);margin-bottom:4px\">" + __("tool.hash-generator.sha256") + "</div>" +
        "    <div id=\"hgSha256\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\">" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary);font-family:var(--font-sans);margin-bottom:4px\">" + __("tool.hash-generator.sha512") + "</div>" +
        "    <div id=\"hgSha512\">-</div>" +
        "  </div>" +
        "</div>" +
        "<div style=\"display:flex;gap:4px\">" +
        "  <button class=\"btn btn-secondary\" style=\"flex:1;font-size:0.75rem\" data-hash=\"md5\">" + __("tool.hash-generator.copyMd5") + "</button>" +
        "  <button class=\"btn btn-secondary\" style=\"flex:1;font-size:0.75rem\" data-hash=\"sha1\">" + __("tool.hash-generator.copySha1") + "</button>" +
        "  <button class=\"btn btn-secondary\" style=\"flex:1;font-size:0.75rem\" data-hash=\"sha256\">" + __("tool.hash-generator.copySha256") + "</button>" +
        "  <button class=\"btn btn-secondary\" style=\"flex:1;font-size:0.75rem\" data-hash=\"sha512\">" + __("tool.hash-generator.copySha512") + "</button>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("hgInput");
      var genBtn = document.getElementById("hgGenBtn");
      var clearBtn = document.getElementById("hgClearBtn");

      async function generate() {
        var text = input.value;
        if (!text) return;
        var results = await Promise.all([
          generateHash(text, "MD5"),
          generateHash(text, "SHA-1"),
          generateHash(text, "SHA-256"),
          generateHash(text, "SHA-512")
        ]);
        document.getElementById("hgMd5").textContent = results[0];
        document.getElementById("hgSha1").textContent = results[1];
        document.getElementById("hgSha256").textContent = results[2];
        document.getElementById("hgSha512").textContent = results[3];
      }

      genBtn.addEventListener("click", generate);
      clearBtn.addEventListener("click", function () {
        input.value = "";
        ["hgMd5", "hgSha1", "hgSha256", "hgSha512"].forEach(function (id) {
          document.getElementById(id).textContent = "-";
        });
      });

      document.querySelectorAll("[data-hash]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var el = document.getElementById("hg" + btn.dataset.hash.charAt(0).toUpperCase() + btn.dataset.hash.slice(1));
          if (el && el.textContent !== "-") copyToClipboard(el.textContent);
        });
      });

      generate();
    },
    destroy: function () {}
  };
})();
