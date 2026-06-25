// Tool :: Audio Waveform
(function () {
  var id = "audio-waveform";
  var title = "Audio Waveform";
  var icon = "\ud83c\udfb5";
  var category = "Media";
  var description = "Generate waveform visualization from audio files";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"awUpload\" accept=\"audio/*\" class=\"file-input\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:100px\"><label style=\"font-size:0.75rem\">" + __("tool.audio-waveform.color") + "</label><input type=\"color\" id=\"awColor\" class=\"tool-input\" value=\"#4f46e5\"></div>" +
        "  <div style=\"flex:1;min-width:100px\"><label style=\"font-size:0.75rem\">" + __("tool.audio-waveform.bgColor") + "</label><input type=\"color\" id=\"awBgColor\" class=\"tool-input\" value=\"#1e1e2e\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"awGenerateBtn\">" + __("tool.audio-waveform.generate") + "</button>" +
        "<div id=\"awCanvasWrap\" style=\"text-align:center;margin-top:8px\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"awDownloadBtn\" style=\"display:none\">" + __("tool.audio-waveform.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("awUpload");
      var color = document.getElementById("awColor");
      var bgColor = document.getElementById("awBgColor");
      var generateBtn = document.getElementById("awGenerateBtn");
      var canvasWrap = document.getElementById("awCanvasWrap");
      var downloadBtn = document.getElementById("awDownloadBtn");
      var audioCtx = null;
      var audioData = null;
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          audioCtx.decodeAudioData(ev.target.result, function(buffer) {
            audioData = buffer.getChannelData(0);
            generateWaveform();
          });
        };
        reader.readAsArrayBuffer(file);
      });
      function generateWaveform() {
        if (!audioData) return;
        var data = audioData;
        var w = 800, h = 200;
        var cvs = document.createElement("canvas");
        cvs.width = w;
        cvs.height = h;
        var ctx = cvs.getContext("2d");
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, w, h);
        var step = Math.ceil(data.length / w);
        var amp = h / 2;
        ctx.strokeStyle = color.value;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var i = 0; i < w; i++) {
          var min = 1.0, max = -1.0;
          for (var j = 0; j < step; j++) {
            var idx = i * step + j;
            if (idx < data.length) {
              var val = data[idx];
              if (val < min) min = val;
              if (val > max) max = val;
            }
          }
          ctx.moveTo(i, amp + min * amp);
          ctx.lineTo(i, amp + max * amp);
        }
        ctx.stroke();
        canvasWrap.innerHTML = "";
        canvasWrap.appendChild(cvs);
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = cvs.toDataURL();
          a.download = "waveform.png";
          a.click();
        };
      }
      generateBtn.addEventListener("click", generateWaveform);
      color.addEventListener("input", generateWaveform);
      bgColor.addEventListener("input", generateWaveform);
    },
    destroy: function () {}
  };
})();