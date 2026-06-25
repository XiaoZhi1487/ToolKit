(function () {
  var id = "ssl-parser";
  var title = "SSL Parser";
  var icon = "\ud83d\udd12";
  var category = "Security";
  var description = "Parse SSL certificate information";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\"></textarea>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-parse\">" + __('tool.' + id + '.parse') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-parse").addEventListener("click", function () {
        var cert = input.value;
        try {
          var certData = {};
          var issuerMatch = cert.match(/Issuer:([^\n]+)/);
          if (issuerMatch) certData.issuer = issuerMatch[1].trim();
          var subjectMatch = cert.match(/Subject:([^\n]+)/);
          if (subjectMatch) certData.subject = subjectMatch[1].trim();
          var notBeforeMatch = cert.match(/Not Before:([^\n]+)/);
          if (notBeforeMatch) certData.notBefore = notBeforeMatch[1].trim();
          var notAfterMatch = cert.match(/Not After :([^\n]+)/);
          if (notAfterMatch) certData.notAfter = notAfterMatch[1].trim();
          result.textContent = JSON.stringify(certData, null, 2);
        } catch (e) {
          result.textContent = "Cannot parse certificate. Please paste full certificate text.";
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();