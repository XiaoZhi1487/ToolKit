(function () {
  var id = "data-format-converter";
  var title = "Data Format";
  var icon = "\ud83d\udcc4";
  var category = "AI";
  var description = "Convert between JSONL/JSON/CSV formats";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder='{\"text\": \"hello\"}'></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.from') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-from\">" +
        "<option value=\"json\">JSON</option>" +
        "<option value=\"jsonl\">JSONL</option>" +
        "<option value=\"csv\">CSV</option>" +
        "</select>" +
        "<label>" + __('tool.' + id + '.to') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-to\">" +
        "<option value=\"json\">JSON</option>" +
        "<option value=\"jsonl\">JSONL</option>" +
        "<option value=\"csv\">CSV</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-convert\">" + __('tool.' + id + '.convert') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var fromInput = box.querySelector("#" + id + "-from");
      var toInput = box.querySelector("#" + id + "-to");

      function jsonToJsonl(json) {
        var arr = Array.isArray(json) ? json : [json];
        return arr.map(JSON.stringify).join('\n');
      }

      function jsonlToJson(jsonl) {
        return jsonl.split('\n').filter(Boolean).map(JSON.parse);
      }

      function jsonToCsv(json) {
        var arr = Array.isArray(json) ? json : [json];
        if (arr.length === 0) return '';
        var keys = Object.keys(arr[0]);
        var header = keys.join(',');
        var rows = arr.map(function (item) {
          return keys.map(function (k) {
            var val = item[k];
            return typeof val === 'string' && val.includes(',') ? '"' + val + '"' : val;
          }).join(',');
        });
        return header + '\n' + rows.join('\n');
      }

      function csvToJson(csv) {
        var lines = csv.split('\n').filter(Boolean);
        var keys = lines[0].split(',');
        return lines.slice(1).map(function (line) {
          var values = line.split(',');
          var obj = {};
          keys.forEach(function (k, i) {
            obj[k] = values[i];
          });
          return obj;
        });
      }

      box.querySelector("#" + id + "-convert").addEventListener("click", function () {
        try {
          var data;
          if (fromInput.value === 'json') {
            data = JSON.parse(input.value);
          } else if (fromInput.value === 'jsonl') {
            data = jsonlToJson(input.value);
          } else {
            data = csvToJson(input.value);
          }

          var result;
          if (toInput.value === 'json') {
            result = JSON.stringify(data, null, 2);
          } else if (toInput.value === 'jsonl') {
            result = jsonToJsonl(data);
          } else {
            result = jsonToCsv(data);
          }

          output.value = result;
        } catch (e) {
          output.value = e.message;
        }
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(output.value);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        output.value = '';
      });

      return box;
    }
  };
})();