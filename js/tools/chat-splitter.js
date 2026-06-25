(function () {
  var id = "chat-splitter";
  var title = "Chat Splitter";
  var icon = "\ud83d\udcac";
  var category = "AI";
  var description = "Split chat conversations into turns";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"User: Hello\\nAssistant: Hi there\\nUser: How are you?\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.user') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-user\" value=\"User:\">" +
        "<label>" + __('tool.' + id + '.assistant') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-assistant\" value=\"Assistant:\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-split\">" + __('tool.' + id + '.split') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var userPrefix = box.querySelector("#" + id + "-user");
      var assistantPrefix = box.querySelector("#" + id + "-assistant");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-split").addEventListener("click", function () {
        var lines = input.value.split('\n');
        var turns = [];
        var currentTurn = null;

        lines.forEach(function (line) {
          if (line.startsWith(userPrefix.value)) {
            if (currentTurn) turns.push(currentTurn);
            currentTurn = { role: 'user', content: line.substring(userPrefix.value.length).trim() };
          } else if (line.startsWith(assistantPrefix.value)) {
            if (currentTurn) turns.push(currentTurn);
            currentTurn = { role: 'assistant', content: line.substring(assistantPrefix.value.length).trim() };
          } else if (currentTurn) {
            currentTurn.content += '\n' + line.trim();
          }
        });

        if (currentTurn) turns.push(currentTurn);
        result.textContent = JSON.stringify(turns, null, 2);
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();