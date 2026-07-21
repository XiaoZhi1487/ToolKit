(function () {
  var id = 'screenshot-annotate';
  var title = 'Screenshot Annotate';
  var icon = '\u270F\uFE0F';
  var category = 'Tools';
  var description = 'Upload image, draw arrows, boxes, text, download annotated';
  window.toolMeta.push({ id: id, title: title, icon: icon, category: category, description: description });

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement('div');
      box.className = 'tool-body';
      box.innerHTML =
        '<div class="tool-header"><span class="tool-header-icon">' + icon + '</span><h2>' + __('tool.' + id + '.title') + '</h2></div>' +
        '<div class="tool-content">' +
        // Toolbar
        '<div class="annotate-toolbar" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">' +
        '<label class="btn btn-primary" style="cursor:pointer">' +
        '\u{1F4C1} ' + __('tool.' + id + '.upload') +
        '<input type="file" accept="image/*" id="sa-file" style="display:none">' +
        '</label>' +
        '<div class="btn-group" style="display:flex;gap:4px">' +
        '<button class="btn btn-sm sa-tool" data-tool="arrow" title="' + __('tool.' + id + '.arrow') + '">\u2197\uFE0F</button>' +
        '<button class="btn btn-sm sa-tool" data-tool="rect" title="' + __('tool.' + id + '.rect') + '">\u25A1</button>' +
        '<button class="btn btn-sm sa-tool" data-tool="circle" title="' + __('tool.' + id + '.circle') + '">\u25CB</button>' +
        '<button class="btn btn-sm sa-tool" data-tool="text" title="' + __('tool.' + id + '.text') + '">T</button>' +
        '</div>' +
        '<label style="display:flex;align-items:center;gap:4px;font-size:0.85rem;color:var(--text-secondary)">' + __('tool.' + id + '.color') +
        '<input type="color" id="sa-color" value="#e74c3c" style="width:32px;height:32px;border:none;padding:0;cursor:pointer;border-radius:4px;background:none">' +
        '</label>' +
        '<label style="display:flex;align-items:center;gap:4px;font-size:0.85rem;color:var(--text-secondary)">' + __('tool.' + id + '.size') +
        '<select id="sa-size" class="input" style="width:60px;padding:4px 6px">' +
        '<option value="2">2px</option>' +
        '<option value="4" selected>4px</option>' +
        '<option value="6">6px</option>' +
        '<option value="8">8px</option>' +
        '<option value="12">12px</option>' +
        '</select>' +
        '</label>' +
        '<button class="btn btn-sm" id="sa-undo">\u21A9 ' + __('tool.' + id + '.undo') + '</button>' +
        '<button class="btn btn-sm btn-danger" id="sa-clear">\u2716 ' + __('tool.' + id + '.clear') + '</button>' +
        '<button class="btn btn-sm" id="sa-download" style="display:none">\u{1F4E5} ' + __('tool.' + id + '.download') + '</button>' +
        '</div>' +
        // Canvas container
        '<div class="annotate-canvas-wrap" style="position:relative;border:2px dashed var(--bg-card-border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-surface);min-height:300px;display:flex;align-items:center;justify-content:center">' +
        '<canvas id="sa-canvas" style="max-width:100%;max-height:80vh;display:none;cursor:crosshair"></canvas>' +
        '<div id="sa-placeholder" style="text-align:center;padding:60px 20px;color:var(--text-secondary)">' +
        '\u{1F4DD} ' + __('tool.' + id + '.placeholder') +
        '</div>' +
        '</div>' +
        '</div>';

      var canvas = box.querySelector('#sa-canvas');
      var ctx = canvas.getContext('2d');
      var placeholder = box.querySelector('#sa-placeholder');
      var colorInput = box.querySelector('#sa-color');
      var sizeSelect = box.querySelector('#sa-size');
      var undoBtn = box.querySelector('#sa-undo');
      var clearBtn = box.querySelector('#sa-clear');
      var downloadBtn = box.querySelector('#sa-download');
      var fileInput = box.querySelector('#sa-file');

      var img = new Image();
      var isDrawing = false;
      var currentTool = 'arrow';
      var startX = 0, startY = 0;
      var actions = [];
      var currentPath = null;
      var textInput = null;

      function setActiveTool(tool) {
        currentTool = tool;
        box.querySelectorAll('.sa-tool').forEach(function (b) {
          b.classList.toggle('btn-primary', b.dataset.tool === tool);
        });
      }

      function saveState() {
        if (canvas.width > 0 && canvas.height > 0) {
          actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      }

      function undo() {
        if (actions.length === 0) return;
        var prev = actions.pop();
        ctx.putImageData(prev, 0, 0);
      }

      function clearCanvas() {
        if (!img.src) return;
        actions = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      function loadImage(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          img.onload = function () {
            // Scale to fit
            var maxW = window.innerWidth - 120;
            var maxH = window.innerHeight - 300;
            var w = img.width;
            var h = img.height;
            if (w > maxW) { h = h * maxW / w; w = maxW; }
            if (h > maxH) { w = w * maxH / h; h = maxH; }
            canvas.width = Math.round(w);
            canvas.height = Math.round(h);
            canvas.style.display = 'block';
            placeholder.style.display = 'none';
            actions = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            downloadBtn.style.display = 'inline-flex';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * (canvas.width / rect.width),
          y: (clientY - rect.top) * (canvas.height / rect.height)
        };
      }

      function drawArrow(x1, y1, x2, y2) {
        var headLen = Math.min(20, Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)) * 0.3);
        var angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }

      function onPointerDown(e) {
        if (!img.src) return;
        e.preventDefault();
        isDrawing = true;
        var pos = getPos(e);
        startX = pos.x; startY = pos.y;

        if (currentTool === 'text') {
          saveState();
          var text = prompt('Enter text:');
          if (text) {
            ctx.fillStyle = colorInput.value;
            var fontSize = parseInt(sizeSelect.value) * 4;
            ctx.font = 'bold ' + fontSize + 'px sans-serif';
            ctx.fillText(text, startX, startY);
          }
          isDrawing = false;
          return;
        }

        saveState();
        ctx.strokeStyle = colorInput.value;
        ctx.fillStyle = colorInput.value;
        ctx.lineWidth = parseInt(sizeSelect.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      function onPointerMove(e) {
        if (!isDrawing || currentTool === 'text') return;
        e.preventDefault();
        var pos = getPos(e);

        // Restore to saved state
        if (actions.length > 0) {
          ctx.putImageData(actions[actions.length - 1], 0, 0);
        }

        ctx.strokeStyle = colorInput.value;
        ctx.fillStyle = colorInput.value;
        ctx.lineWidth = parseInt(sizeSelect.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (currentTool === 'arrow') {
          drawArrow(startX, startY, pos.x, pos.y);
        } else if (currentTool === 'rect') {
          ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
        } else if (currentTool === 'circle') {
          var rx = Math.abs(pos.x - startX) / 2;
          var ry = Math.abs(pos.y - startY) / 2;
          var cx = (startX + pos.x) / 2;
          var cy = (startY + pos.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      function onPointerUp(e) {
        if (!isDrawing) return;
        isDrawing = false;
      }

      // Mouse events
      canvas.addEventListener('mousedown', onPointerDown);
      canvas.addEventListener('mousemove', onPointerMove);
      canvas.addEventListener('mouseup', onPointerUp);
      canvas.addEventListener('mouseleave', function () { isDrawing = false; });

      // Touch events
      canvas.addEventListener('touchstart', onPointerDown, { passive: false });
      canvas.addEventListener('touchmove', onPointerMove, { passive: false });
      canvas.addEventListener('touchend', onPointerUp, { passive: false });

      // Tool buttons
      box.querySelectorAll('.sa-tool').forEach(function (btn) {
        btn.addEventListener('click', function () { setActiveTool(this.dataset.tool); });
      });
      setActiveTool('arrow');

      // File input
      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) loadImage(this.files[0]);
      });

      // Undo
      undoBtn.addEventListener('click', undo);

      // Clear
      clearBtn.addEventListener('click', function () {
        if (img.src && confirm('Clear all annotations?')) clearCanvas();
      });

      // Download
      downloadBtn.addEventListener('click', function () {
        var link = document.createElement('a');
        link.download = 'annotated.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });

      // Drag & drop
      box.querySelector('.annotate-canvas-wrap').addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.borderColor = 'var(--accent-1)';
      });
      box.querySelector('.annotate-canvas-wrap').addEventListener('dragleave', function () {
        this.style.borderColor = 'var(--bg-card-border)';
      });
      box.querySelector('.annotate-canvas-wrap').addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.borderColor = 'var(--bg-card-border)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
      });

      return box;
    }
  };
})();