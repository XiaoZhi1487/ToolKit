(function () {
  var id = 'system-info';
  var title = 'System Info';
  var icon = '\u{1F4BB}';
  var category = 'Tools';
  var description = 'Detect OS, CPU, memory, disk, GPU info';
  window.toolMeta.push({ id: id, title: title, icon: icon, category: category, description: description });

  function detectOS() {
    var ua = navigator.userAgent;
    if (/Windows NT 11/i.test(ua)) return 'Windows 11';
    if (/Windows NT 10/i.test(ua)) return 'Windows 10';
    if (/Windows NT 6\.3/i.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6\.2/i.test(ua)) return 'Windows 8';
    if (/Windows NT 6\.1/i.test(ua)) return 'Windows 7';
    if (/Mac OS X (\d+[._]\d+)/.test(ua)) return 'macOS ' + RegExp.$1.replace('_', '.');
    if (/Linux/.test(ua)) return 'Linux';
    if (/Android (\d+\.?\d*)/.test(ua)) return 'Android ' + RegExp.$1;
    if (/(iPhone|iPad|iPod).*OS (\d+_\d+)/.test(ua)) return 'iOS ' + RegExp.$2.replace('_', '.');
    if (/CrOS/.test(ua)) return 'ChromeOS';
    return ua;
  }

  function detectBrowser() {
    var ua = navigator.userAgent;
    if (/Edg\/(\d+)/.test(ua)) return 'Edge ' + RegExp.$1;
    if (/Chrome\/(\d+)/.test(ua)) return 'Chrome ' + RegExp.$1;
    if (/Firefox\/(\d+)/.test(ua)) return 'Firefox ' + RegExp.$1;
    if (/Safari\/(\d+)/.test(ua) && !/Chrome/.test(ua)) return 'Safari ' + RegExp.$1;
    return ua;
  }

  function detectArch() {
    var ua = navigator.userAgent;
    if (/WOW64|Win64|x64|amd64/.test(ua)) return 'x64 (64-bit)';
    if (/x86_64/.test(ua)) return 'x64 (64-bit)';
    if (/arm64|aarch64/.test(ua)) return 'ARM64';
    if (/Win32|i686/.test(ua)) return 'x86 (32-bit)';
    return 'Unknown';
  }

  function detectConnection() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return 'Not available';
    var parts = [];
    if (conn.effectiveType) parts.push(conn.effectiveType.toUpperCase());
    if (conn.downlink) parts.push(conn.downlink + ' Mbps');
    if (conn.rtt) parts.push(conn.rtt + 'ms');
    return parts.join(' | ') || 'Unknown';
  }

  function formatBytes(bytes) {
    if (bytes === undefined || bytes === null) return 'Unknown';
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement('div');
      box.className = 'tool-body';
      box.innerHTML =
        '<div class="tool-header"><span class="tool-header-icon">' + icon + '</span><h2>' + __('tool.' + id + '.title') + '</h2></div>' +
        '<div class="tool-content">' +
        '<div class="btn-group" style="margin-bottom:16px">' +
        '<button class="btn btn-primary" id="si-detect">\u{1F50D} ' + __('tool.' + id + '.detect') + '</button>' +
        '<button class="btn" id="si-share" style="display:none">' + __('tool.' + id + '.shareBtn') + '</button>' +
        '</div>' +
        '<div id="si-result"></div>' +
        '</div>';

      var result = box.querySelector('#si-result');
      var detectBtn = box.querySelector('#si-detect');
      var shareBtn = box.querySelector('#si-share');
      var detectedData = null;

      function fmt(key, val, icon) {
        return '<div class="si-row" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--bg-surface);border:1px solid var(--bg-card-border);border-radius:var(--radius-md);margin-bottom:6px">' +
          '<span style="color:var(--text-secondary);font-size:0.9rem">' + (icon || '') + ' ' + key + '</span>' +
          '<span style="color:var(--text-primary);font-weight:500;font-size:0.95rem;text-align:right;max-width:60%">' + val + '</span>' +
          '</div>';
      }

      function detect() {
        result.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary)">\u23F3 ' + __('tool.' + id + '.detect') + '...</div>';

        var os = detectOS();
        var browser = detectBrowser();
        var arch = detectArch();
        var cpuCores = navigator.hardwareConcurrency || __('tool.' + id + '.unknown');
        var memory = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : __('tool.' + id + '.unknown') + ' ' + __('tool.' + id + '.memoryNote');
        var gpu = '无法检测';
        var screenInfo = window.screen.width + 'x' + window.screen.height + ' @ ' + (window.screen.colorDepth || 24) + 'bit';
        var conn = detectConnection();

        var html = '';
        html += fmt(__('tool.' + id + '.os'), os, '\u{1F4F1}');
        html += fmt(__('tool.' + id + '.browser'), browser, '\u{1F310}');
        html += fmt(__('tool.' + id + '.arch'), arch, '\u{2699}\uFE0F');
        html += fmt(__('tool.' + id + '.cpu'), cpuCores + ' ' + __('tool.' + id + '.cpuCores'), '\u{1F9E0}');
        html += fmt(__('tool.' + id + '.memory'), memory, '\u{1F4BE}');
        html += fmt(__('tool.' + id + '.gpu'), gpu, '\u{1F5A5}\uFE0F');
        html += fmt(__('tool.' + id + '.screen'), screenInfo, '\u{1F4F1}');
        html += fmt(__('tool.' + id + '.connection'), conn, '\u{1F4E1}');
        html += fmt(__('tool.' + id + '.disk'), '无法检测', '\u{1F4C0}');

        result.innerHTML = html;

        detectedData = { os: os, browser: browser, arch: arch, cpu: cpuCores, memory: memory, gpu: gpu, screen: screenInfo };
        shareBtn.style.display = 'inline-flex';

        // Battery
        if (navigator.getBattery) {
          navigator.getBattery().then(function (battery) {
            var level = Math.round(battery.level * 100) + '%';
            var charging = battery.charging ? __('tool.' + id + '.charging') : __('tool.' + id + '.notCharging');
            var batHtml = fmt(__('tool.' + id + '.battery'), level + ' (' + charging + ')', '\u{1F50B}');
            result.insertAdjacentHTML('beforeend', batHtml);
          });
        }
      }

      detectBtn.addEventListener('click', detect);

      shareBtn.addEventListener('click', function () {
        if (!detectedData) return;
        var lines = [];
        lines.push('=== ' + __('tool.' + id + '.title') + ' ===');
        lines.push('');lines.push(__('tool.' + id + '.os') + ': ' + detectedData.os);
        lines.push(__('tool.' + id + '.browser') + ': ' + detectedData.browser);
        lines.push(__('tool.' + id + '.arch') + ': ' + detectedData.arch);
        lines.push(__('tool.' + id + '.cpu') + ': ' + detectedData.cpu + ' ' + __('tool.' + id + '.cpuCores'));
        lines.push(__('tool.' + id + '.memory') + ': ' + detectedData.memory);
        lines.push(__('tool.' + id + '.gpu') + ': ' + detectedData.gpu);
        lines.push(__('tool.' + id + '.screen') + ': ' + detectedData.screen);
        copyToClipboard(lines.join('\n'));
      });

      // Auto-detect on init
      setTimeout(detect, 100);

      return box;
    }
  };
})();