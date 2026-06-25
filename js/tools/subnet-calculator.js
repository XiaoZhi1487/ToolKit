(function () {
  var id = "subnet-calculator";
  var title = "Subnet Calculator";
  var icon = "\ud83d\uddf7";
  var category = "Developer";
  var description = "Calculate IPv4 subnet information";
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
        "<label>" + __('tool.' + id + '.ip') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-ip\" placeholder=\"192.168.1.1\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.mask') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-mask\" placeholder=\"255.255.255.0\">" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-calculate\">" + __('tool.' + id + '.calculate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var ipInput = box.querySelector("#" + id + "-ip");
      var maskInput = box.querySelector("#" + id + "-mask");
      var result = box.querySelector("#" + id + "-result");

      function ipToInt(ip) {
        return ip.split('.').reduce(function (acc, octet) {
          return (acc << 8) + parseInt(octet, 10);
        }, 0) >>> 0;
      }

      function intToIp(int) {
        return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
      }

      function maskToCidr(mask) {
        return mask.split('.').reduce(function (acc, octet) {
          return acc + (parseInt(octet, 10).toString(2).match(/1/g) || []).length;
        }, 0);
      }

      box.querySelector("#" + id + "-calculate").addEventListener("click", function () {
        try {
          var ip = ipInput.value.trim();
          var mask = maskInput.value.trim();
          var ipInt = ipToInt(ip);
          var maskInt = ipToInt(mask);
          var networkInt = ipInt & maskInt;
          var broadcastInt = networkInt | (~maskInt >>> 0);
          var firstHostInt = networkInt + 1;
          var lastHostInt = broadcastInt - 1;
          var totalHosts = Math.pow(2, 32 - maskToCidr(mask)) - 2;
          var usableHosts = totalHosts > 0 ? totalHosts : 0;

          var info = {
            network: intToIp(networkInt),
            broadcast: intToIp(broadcastInt),
            firstHost: intToIp(firstHostInt),
            lastHost: intToIp(lastHostInt),
            cidr: '/' + maskToCidr(mask),
            totalHosts: Math.pow(2, 32 - maskToCidr(mask)),
            usableHosts: usableHosts
          };

          result.textContent = JSON.stringify(info, null, 2);
        } catch (e) {
          result.textContent = e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        ipInput.value = '';
        maskInput.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();