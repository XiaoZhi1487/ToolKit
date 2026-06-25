// Tool :: Color Converter
(function () {
  var id = "color-converter";
  var title = "Color Converter";
  var icon = "\ud83c\udfa8";
  var category = "Converter";
  var description = "Convert between HEX, RGB, HSL, HSV color formats";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.color-converter.input") + "</label>" +
        "<input type=\"text\" id=\"ccInput\" class=\"tool-input\" placeholder=\"" + __("tool.color-converter.placeholder") + "\" value=\"#ff0000\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.color-converter.fromFormat") + "</label><select id=\"ccFrom\" class=\"tool-input\"><option value=\"hex\">HEX</option><option value=\"rgb\">RGB</option><option value=\"hsl\">HSL</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.color-converter.toFormat") + "</label><select id=\"ccTo\" class=\"tool-input\"><option value=\"hex\">HEX</option><option value=\"rgb\">RGB</option><option value=\"hsl\">HSL</option><option value=\"hsv\">HSV</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"ccConvertBtn\">" + __("tool.color-converter.convert") + "</button>" +
        "<div class=\"flex-row\" style=\"gap:12px;margin-top:8px;align-items:center\">" +
        "  <div id=\"ccSwatch\" style=\"width:48px;height:48px;border-radius:8px;border:2px solid var(--border)\"></div>" +
        "  <div style=\"font-family:var(--font-mono);font-size:1rem;font-weight:500\" id=\"ccResult\">-</div>" +
        "</div>" +
        "<button class=\"btn btn-secondary\" id=\"ccCopyBtn\">" + __("tool.color-converter.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("ccInput");
      var from = document.getElementById("ccFrom");
      var to = document.getElementById("ccTo");
      var convertBtn = document.getElementById("ccConvertBtn");
      var swatch = document.getElementById("ccSwatch");
      var result = document.getElementById("ccResult");
      var copyBtn = document.getElementById("ccCopyBtn");
      function parseColor(str, fmt) {
        str = str.trim();
        if (fmt === "hex") {
          var h = str.replace("#", "");
          if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
          var r = parseInt(h.substr(0,2),16);
          var g = parseInt(h.substr(2,2),16);
          var b = parseInt(h.substr(4,2),16);
          return {r:r,g:g,b:b};
        }
        if (fmt === "rgb") {
          var m = str.match(/(\d+)/g);
          if (m) return {r:parseInt(m[0]),g:parseInt(m[1]),b:parseInt(m[2])};
        }
        if (fmt === "hsl") {
          var m = str.match(/([\d.]+)/g);
          if (m) {
            var h = parseFloat(m[0]), s = parseFloat(m[1])/100, l = parseFloat(m[2])/100;
            return hslToRgb(h,s,l);
          }
        }
        return null;
      }
      function hslToRgb(h,s,l) {
        var c = (1 - Math.abs(2*l-1)) * s;
        var x = c * (1 - Math.abs((h/60)%2-1));
        var m = l - c/2;
        var r,g,b;
        if (h < 60) {r=c;g=x;b=0;}
        else if (h < 120) {r=x;g=c;b=0;}
        else if (h < 180) {r=0;g=c;b=x;}
        else if (h < 240) {r=0;g=x;b=c;}
        else if (h < 300) {r=x;g=0;b=c;}
        else {r=c;g=0;b=x;}
        return {r:Math.round((r+m)*255),g:Math.round((g+m)*255),b:Math.round((b+m)*255)};
      }
      function rgbToHsl(r,g,b) {
        r/=255; g/=255; b/=255;
        var max=Math.max(r,g,b), min=Math.min(r,g,b);
        var h,s,l=(max+min)/2;
        if (max===min) {h=s=0;}
        else {
          var d=max-min;
          s = l>0.5 ? d/(2-max-min) : d/(max+min);
          if (max===r) h=(g-b)/d+(g<b?6:0);
          else if (max===g) h=(b-r)/d+2;
          else h=(r-g)/d+4;
          h/=6;
        }
        return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
      }
      function rgbToHsv(r,g,b) {
        r/=255; g/=255; b/=255;
        var max=Math.max(r,g,b), min=Math.min(r,g,b);
        var h,s,v=max;
        var d=max-min;
        s = max===0 ? 0 : d/max;
        if (max===min) h=0;
        else if (max===r) h=(g-b)/d+(g<b?6:0);
        else if (max===g) h=(b-r)/d+2;
        else h=(r-g)/d+4;
        h/=6;
        return {h:Math.round(h*360),s:Math.round(s*100),v:Math.round(v*100)};
      }
      function formatColor(r,g,b,fmt) {
        if (fmt === "hex") return "#" + [r,g,b].map(function(v){return ("0"+v.toString(16)).slice(-2);}).join("");
        if (fmt === "rgb") return "rgb("+r+","+g+","+b+")";
        if (fmt === "hsl") {
          var hsl = rgbToHsl(r,g,b);
          return "hsl("+hsl.h+","+hsl.s+"%,"+hsl.l+"%)";
        }
        if (fmt === "hsv") {
          var hsv = rgbToHsv(r,g,b);
          return "hsv("+hsv.h+","+hsv.s+"%,"+hsv.v+"%)";
        }
      }
      function convert() {
        var c = parseColor(input.value, from.value);
        if (!c) { result.textContent = "Invalid"; return; }
        var fmt = formatColor(c.r,c.g,c.b,to.value);
        result.textContent = fmt;
        swatch.style.background = formatColor(c.r,c.g,c.b,"hex");
      }
      convertBtn.addEventListener("click", convert);
      copyBtn.addEventListener("click", function() { if (result.textContent !== "-") copyToClipboard(result.textContent); });
      convert();
    },
    destroy: function () {}
  };
})();