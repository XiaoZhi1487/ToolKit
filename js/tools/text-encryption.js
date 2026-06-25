// Tool :: Text Encryption
(function () {
  var id = "text-encryption";
  var title = "Text Encryption";
  var icon = "🔒";
  var category = "Developer";
  var description = "Encrypt or decrypt text with a password using AES";

  window.toolMeta.push({ id, title, icon, category, description });

  function bufToBase64(buf) {
    var binary = "";
    var bytes = new Uint8Array(buf);
    for (var i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToBuf(base64) {
    var binary = atob(base64);
    var len = binary.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function encryptText(text, password) {
    return new Promise(function (resolve, reject) {
      try {
        var enc = new TextEncoder();
        var encPwd = enc.encode(password);
        crypto.subtle.importKey('raw', encPwd, 'PBKDF2', false, ['deriveKey']).then(function (keyMaterial) {
          var salt = crypto.getRandomValues(new Uint8Array(16));
          crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
          ).then(function (key) {
            var iv = crypto.getRandomValues(new Uint8Array(12));
            crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(text)).then(function (encrypted) {
              var combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
              combined.set(salt, 0);
              combined.set(iv, salt.length);
              combined.set(new Uint8Array(encrypted), salt.length + iv.length);
              resolve(bufToBase64(combined.buffer));
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  function decryptText(encoded, password) {
    return new Promise(function (resolve, reject) {
      try {
        var data = base64ToBuf(encoded);
        var salt = data.slice(0, 16);
        var iv = data.slice(16, 28);
        var ciphertext = data.slice(28);
        var enc = new TextEncoder();
        var encPwd = enc.encode(password);
        crypto.subtle.importKey('raw', encPwd, 'PBKDF2', false, ['deriveKey']).then(function (keyMaterial) {
          crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
          ).then(function (key) {
            crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ciphertext).then(function (decrypted) {
              resolve(new TextDecoder().decode(decrypted));
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
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
        "  <div class=\"tab-bar\" id=\"teTabBar\">",
        "    <button class=\"tab-btn active\" data-mode=\"encrypt\">" + __('tool.' + id + '.encrypt') + "</button>",
        "    <button class=\"tab-btn\" data-mode=\"decrypt\">" + __('tool.' + id + '.decrypt') + "</button>",
        "  </div>",
        "  <div id=\"teEncryptPanel\">",
        "    <label>" + __('tool.' + id + '.text') + "</label>",
        "    <textarea id=\"teInput\" rows=\"4\" placeholder=\"" + __('tool.' + id + '.encryptPlaceholder') + "\" spellcheck=\"false\"></textarea>",
        "    <label>" + __('tool.' + id + '.password') + "</label>",
        "    <input type=\"password\" id=\"tePassword\" placeholder=\"" + __('tool.' + id + '.passwordPlaceholder') + "\" style=\"width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);box-sizing:border-box\" />",
        "    <div class=\"btn-group\" style=\"margin-top:8px\">",
        "      <button class=\"btn btn-primary\" id=\"teRunBtn\">" + __('tool.' + id + '.encrypt') + "</button>",
        "    </div>",
        "    <label style=\"margin-top:12px\">" + __('tool.' + id + '.result') + "</label>",
        "    <textarea id=\"teOutput\" rows=\"4\" readonly spellcheck=\"false\"></textarea>",
        "    <button class=\"btn btn-secondary\" id=\"teCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "    <div id=\"teError\" style=\"font-size:0.8125rem;color:var(--red);min-height:20px\"></div>",
        "  </div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("teInput");
      var password = document.getElementById("tePassword");
      var output = document.getElementById("teOutput");
      var error = document.getElementById("teError");
      var runBtn = document.getElementById("teRunBtn");
      var copyBtn = document.getElementById("teCopyBtn");
      var tabBar = document.getElementById("teTabBar");
      var mode = "encrypt";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        runBtn.textContent = mode === "encrypt"
          ? __('tool.' + id + '.encrypt')
          : __('tool.' + id + '.decrypt');
        input.placeholder = mode === "encrypt"
          ? __('tool.' + id + '.encryptPlaceholder')
          : __('tool.' + id + '.decryptPlaceholder');
        output.value = "";
        error.textContent = "";
      });

      function run() {
        output.value = "";
        error.textContent = "";
        var pwd = password.value;
        if (!pwd) {
          error.textContent = "Please enter a password";
          return;
        }
        var text = input.value.trim();
        if (!text) {
          error.textContent = "Please enter text";
          return;
        }

        if (mode === "encrypt") {
          encryptText(text, pwd).then(function (result) {
            output.value = result;
          }).catch(function (e) {
            error.textContent = "Encryption error: " + e.message;
          });
        } else {
          decryptText(text, pwd).then(function (result) {
            output.value = result;
          }).catch(function () {
            error.textContent = __('tool.' + id + '.error');
          });
        }
      }

      runBtn.addEventListener("click", run);
      copyBtn.addEventListener("click", function () { copyToClipboard(output.value); });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
      password.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
    },
    destroy: function () {}
  };
})();