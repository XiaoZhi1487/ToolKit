(function () {
  var id = "css-prefixer";
  var title = "CSS Prefixer";
  var icon = "\ud83c\udfaf";
  var category = "Developer";
  var description = "Auto add CSS vendor prefixes";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\".box { transform: rotate(45deg); }\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.removeRedundant') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-removeRedundant\" checked>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-prefix\">" + __('tool.' + id + '.prefix') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var removeRedundant = box.querySelector("#" + id + "-removeRedundant");

      var properties = {
        'transform': ['-webkit-', '-moz-'],
        'transform-origin': ['-webkit-', '-moz-'],
        'transition': ['-webkit-', '-moz-'],
        'transition-property': ['-webkit-', '-moz-'],
        'transition-duration': ['-webkit-', '-moz-'],
        'transition-timing-function': ['-webkit-', '-moz-'],
        'transition-delay': ['-webkit-', '-moz-'],
        'animation': ['-webkit-', '-moz-'],
        'animation-name': ['-webkit-', '-moz-'],
        'animation-duration': ['-webkit-', '-moz-'],
        'animation-timing-function': ['-webkit-', '-moz-'],
        'animation-delay': ['-webkit-', '-moz-'],
        'animation-iteration-count': ['-webkit-', '-moz-'],
        'animation-direction': ['-webkit-', '-moz-'],
        'animation-fill-mode': ['-webkit-', '-moz-'],
        'animation-play-state': ['-webkit-', '-moz-'],
        'backface-visibility': ['-webkit-', '-moz-'],
        'perspective': ['-webkit-', '-moz-'],
        'perspective-origin': ['-webkit-', '-moz-'],
        'filter': ['-webkit-'],
        'backdrop-filter': ['-webkit-'],
        'appearance': ['-webkit-', '-moz-'],
        'user-select': ['-webkit-', '-moz-'],
        'text-shadow': ['-webkit-'],
        'box-shadow': ['-webkit-', '-moz-'],
        'border-radius': ['-webkit-', '-moz-'],
        'border-image': ['-webkit-', '-moz-'],
        'background-clip': ['-webkit-', '-moz-'],
        'background-origin': ['-webkit-', '-moz-'],
        'background-size': ['-webkit-', '-moz-'],
        'columns': ['-webkit-', '-moz-'],
        'column-count': ['-webkit-', '-moz-'],
        'column-width': ['-webkit-', '-moz-'],
        'column-gap': ['-webkit-', '-moz-'],
        'column-rule': ['-webkit-', '-moz-'],
        'column-span': ['-webkit-', '-moz-'],
        'flex': ['-webkit-', '-moz-'],
        'flex-grow': ['-webkit-', '-moz-'],
        'flex-shrink': ['-webkit-', '-moz-'],
        'flex-basis': ['-webkit-', '-moz-'],
        'flex-direction': ['-webkit-', '-moz-'],
        'flex-wrap': ['-webkit-', '-moz-'],
        'justify-content': ['-webkit-', '-moz-'],
        'align-items': ['-webkit-', '-moz-'],
        'align-content': ['-webkit-', '-moz-'],
        'order': ['-webkit-', '-moz-'],
        'display': ['-webkit-box', '-moz-box', '-webkit-flex', '-moz-flex']
      };

      function prefixCSS(css) {
        var result = css;
        Object.keys(properties).forEach(function (prop) {
          var prefixes = properties[prop];
          var regex = new RegExp('(\\{|;\\s*)\\s*' + prop + '\\s*:', 'gi');
          result = result.replace(regex, function (match, before) {
            var prefixed = prefixes.map(function (p) {
              return before + p + prop + ':';
            }).join('');
            return prefixed + before + prop + ':';
          });
        });
        if (removeRedundant.checked) {
          result = result.replace(/-\w+-display:\s*box;/g, '');
        }
        return result;
      }

      box.querySelector("#" + id + "-prefix").addEventListener("click", function () {
        output.value = prefixCSS(input.value);
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