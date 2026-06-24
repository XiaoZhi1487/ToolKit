// ToolKit :: Utility helpers

function $id(id) { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
  showCopyFeedback();
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

let _copyTimer;
function showCopyFeedback(msg) {
  const el = $id('copyFeedback') || (() => {
    const d = document.createElement('div');
    d.id = 'copyFeedback'; d.className = 'copy-feedback';
    document.body.appendChild(d);
    return d;
  })();
  el.textContent = msg || '已复制';
  el.classList.add('show');
  clearTimeout(_copyTimer);
  _copyTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// Tool registry
window.tools = {};
window.toolMeta = [];
