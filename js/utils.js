// ToolKit :: Utility helpers

/* ---------- i18n Multi-language System ---------- */
var _lang = 'zh-CN';
var _langMap = {
  'zh-CN': {
    'brand': '千工',
    'search.placeholder': '搜索工具…',
    'cat.all': '全部',
    'home.title': '实用工具集',
    'home.subtitle': '免费 · 在线 · 无需安装',
    'home.tools.count': '{n} 个工具 · 持续增长中',
    'home.noMatch': '没有找到匹配的工具',
    'back': '返回',
    'footer.license': '开源 · 自由使用',
    'footer.goal': '目标：',
    'footer.tools': '实用工具',
    'theme.light': '切换亮色主题',
    'theme.dark': '切换暗色主题',
    'lang.switch': 'English',
    'copy.done': '已复制',
    // Categories
    'cat.Developer': '开发者',
    'cat.Text': '文本',
    'cat.Security': '安全',
    'cat.Design': '设计',
    'cat.Media': '媒体',
    'cat.Converter': '转换',
    'cat.Productivity': '生产力',
    // Common UI
    'common.input': '输入',
    'common.result': '结果',
    'common.copy': '复制',
    'common.clear': '清空',
    'common.run': '执行',
    'common.execute': '执行',
    'common.convert': '转换',
    'common.generate': '生成',
    'common.swap': '互换',
    'common.waiting': '等待输入…',
    'common.noMatches': '无匹配',
    // Tool meta: titles & descriptions
    'tool.json-formatter.title': 'JSON 格式化',
    'tool.json-formatter.desc': '格式化、压缩和验证 JSON 数据',
    'tool.json-formatter.tabFormat': '格式化',
    'tool.json-formatter.tabCompress': '压缩',
    'tool.json-formatter.waiting': '等待输入…',
    'tool.base64.title': 'Base64 编解码',
    'tool.base64.desc': '将文本/文件编码为 Base64，或将 Base64 解码回文本',
    'tool.url-encoder.title': 'URL 编解码',
    'tool.url-encoder.desc': '编码或解码 URL 字符串',
    'tool.url-encoder.tabEncode': '编码',
    'tool.url-encoder.tabDecode': '解码',
    'tool.uuid-generator.title': 'UUID 生成器',
    'tool.uuid-generator.desc': '生成 UUID v4 / v7 以及批量生成',
    'tool.uuid-generator.batchCount': '批量数量',
    'tool.uuid-generator.copyAll': '复制全部',
    'tool.regex-tester.title': '正则测试器',
    'tool.regex-tester.desc': '使用实时匹配高亮测试文本的正则表达式',
    'tool.timestamp-converter.title': '时间戳转换器',
    'tool.timestamp-converter.desc': '在 Unix 时间戳和可读日期之间转换',
    'tool.hash-generator.title': '哈希生成器',
    'tool.hash-generator.desc': '生成文本的 MD5、SHA-1、SHA-256、SHA-512 哈希值',
    'tool.csv-json.title': 'CSV ↔ JSON',
    'tool.csv-json.desc': '将 CSV 数据转换为 JSON，或将 JSON 转换为 CSV',
    'tool.password-generator.title': '密码生成器',
    'tool.password-generator.desc': '生成强密码，支持自定义长度和字符类型',
    'tool.password-generator.length': '长度',
    'tool.password-generator.uppercase': '大写字母 (A-Z)',
    'tool.password-generator.lowercase': '小写字母 (a-z)',
    'tool.password-generator.digits': '数字 (0-9)',
    'tool.password-generator.symbols': '特殊符号 (!@#$)',
    'tool.password-generator.excludeAmbiguous': '排除易混淆字符 (il1Lo0O)',
    'tool.password-generator.strength': '强度',
    'tool.password-generator.clickGen': '点击生成',
    'tool.password-generator.genPassword': '生成密码',
    'tool.text-analyzer.title': '文本分析器',
    'tool.text-analyzer.desc': '全面的文本统计：字数、字符数、行数、段落数、唯一词数、可读性',
    'tool.markdown-preview.title': 'Markdown 预览',
    'tool.markdown-preview.desc': '实时 Markdown 编辑器，支持 HTML 预览',
    'tool.case-converter.title': '大小写转换',
    'tool.case-converter.desc': '在大小写、驼峰、蛇形、烤肉串等格式之间转换文本',
    'tool.color-palette.title': '调色板',
    'tool.color-palette.desc': '颜色选择器，支持 HEX/RGB/HSL 转换和配色方案生成',
    'tool.pomodoro.title': '番茄钟',
    'tool.pomodoro.desc': '专注计时器，支持自定义时长和暂停',
    'tool.pomodoro.focus': '专注时间',
    'tool.pomodoro.start': '开始',
    'tool.pomodoro.pause': '暂停',
    'tool.pomodoro.reset': '重置',
    'tool.pomodoro.focusDuration': '专注时长（分钟）',
    'tool.pomodoro.autoReset': '完成后自动重置',
    'tool.pomodoro.running': '运行中',
    'tool.pomodoro.focusing': '专注中…',
    'tool.pomodoro.timeUp': '时间到！',
    'tool.pomodoro.paused': '已暂停',
    'tool.qr-generator.title': '二维码生成器',
    'tool.qr-generator.desc': '从文本或 URL 生成二维码，支持自定义颜色和大小',
    'tool.image-to-base64.title': '图片转 Base64',
    'tool.image-to-base64.desc': '上传图片并获取其 Base64 数据 URL',
    'tool.lorem-ipsum.title': 'Lorem Ipsum 生成器',
    'tool.lorem-ipsum.desc': '生成各种长度和格式的占位文本',
    'tool.html-entity.title': 'HTML 实体转换器',
    'tool.html-entity.desc': '编码或解码 HTML 实体字符',
    'tool.number-base.title': '进制转换器',
    'tool.number-base.desc': '在二进制、八进制、十进制和十六进制之间转换数字',
    'tool.text-diff.title': '文本对比工具',
    'tool.text-diff.desc': '逐行比较两段文本并高亮差异',
    'tool.text-diff.originalText': '原始文本',
    'tool.text-diff.changedText': '修改后文本',
    'tool.text-diff.compare': '对比',
    'tool.text-diff.difference': '差异',
    'tool.text-diff.added': '新增',
    'tool.text-diff.removed': '删除',
    // Tool internal UI
    'tool.html-entity.tabEncode': '编码',
    'tool.html-entity.tabDecode': '解码',
    'tool.html-entity.enterText': '输入文本',
    'tool.base64.tabEncode': '编码',
    'tool.base64.tabDecode': '解码',
    'tool.base64.tabFile': '文件转 Base64',
    'tool.base64.enterText': '输入文本',
    'tool.base64.enterBase64': '输入 Base64',
    'tool.base64.uploadFile': '上传文件',
    'tool.base64.clickToSelect': '点击选择文件',
    'tool.base64.fileSelected': '已选择文件',
    'tool.qr-generator.textOrUrl': '文本或 URL',
    'tool.qr-generator.enterText': '输入文本或 URL',
    'tool.qr-generator.foreground': '前景色',
    'tool.qr-generator.background': '背景色',
    'tool.qr-generator.generate': '生成二维码',
    'tool.qr-generator.downloadPng': '下载 PNG',
    'tool.image-to-base64.uploadImage': '上传图片',
    'tool.image-to-base64.copyBase64': '复制 Base64',
    'tool.image-to-base64.base64DataUrl': 'Base64 数据 URL',
    'tool.image-to-base64.dragDrop': '或拖拽图片到此处',
    'tool.image-to-base64.dropHere': '拖拽图片到此处',
    'tool.image-to-base64.dropAnother': '拖拽另一张图片',
    'tool.markdown-preview.markdown': 'Markdown',
    'tool.markdown-preview.preview': '预览',
    'tool.markdown-preview.copyHtml': '复制 HTML',
    'tool.lorem-ipsum.type': '类型',
    'tool.lorem-ipsum.words': '单词',
    'tool.lorem-ipsum.sentences': '句子',
    'tool.lorem-ipsum.paragraphs': '段落',
    'tool.lorem-ipsum.count': '数量',
    'tool.number-base.binary': '二进制',
    'tool.number-base.octal': '八进制',
    'tool.number-base.decimal': '十进制',
    'tool.number-base.hexadecimal': '十六进制',
    'tool.csv-json.tabCsv2Json': 'CSV → JSON',
    'tool.csv-json.tabJson2Csv': 'JSON → CSV',
    // Tool text-analyzer
    'tool.text-analyzer.inputText': '输入文本',
    'tool.text-analyzer.characters': '字符数',
    'tool.text-analyzer.charsNoSpace': '字符数（不含空格）',
    'tool.text-analyzer.words': '单词数',
    'tool.text-analyzer.uniqueWords': '唯一词数',
    'tool.text-analyzer.sentences': '句子数',
    'tool.text-analyzer.paragraphs': '段落数',
    'tool.text-analyzer.readability': '可读性',
    'tool.text-analyzer.readingTime': '阅读时间',
    'tool.text-analyzer.min': '分钟',
    'tool.text-analyzer.avgWordLen': '平均词长',
    'tool.text-analyzer.copyStats': '复制统计',
    'tool.text-analyzer.placeholder': '在此粘贴或输入文本…',
    'tool.text-analyzer.veryEasy': '非常简单',
    'tool.text-analyzer.easy': '简单',
    'tool.text-analyzer.fairlyEasy': '较简单',
    'tool.text-analyzer.standard': '标准',
    'tool.text-analyzer.fairlyDifficult': '较难',
    'tool.text-analyzer.difficult': '难',
    'tool.text-analyzer.veryDifficult': '非常难',
    // Tool case-converter
    'tool.case-converter.upper': '大写',
    'tool.case-converter.lower': '小写',
    'tool.case-converter.titleCase': '首字母大写',
    'tool.case-converter.sentenceCase': '句子首字母大写',
    'tool.case-converter.camelCase': '驼峰式',
    'tool.case-converter.pascalCase': '帕斯卡式',
    'tool.case-converter.snakeCase': '蛇形式',
    'tool.case-converter.kebabCase': '烤肉串式',
    'tool.case-converter.placeholder': '在此输入或粘贴文本…',
    // Tool color-palette
    'tool.color-palette.pickColor': '选择颜色',
    'tool.color-palette.paletteGen': '调色板生成',
    'tool.color-palette.monochrome': '单色',
    'tool.color-palette.complement': '互补色',
    'tool.color-palette.triad': '三角色',
    'tool.color-palette.analogous': '类似色',
    'tool.color-palette.clickCopy': '点击复制',
    // Tool timestamp-converter
    'tool.timestamp-converter.ts2date': '时间戳转日期',
    'tool.timestamp-converter.date2ts': '日期转时间戳',
    'tool.timestamp-converter.unixTs': 'Unix 时间戳（秒）',
    'tool.timestamp-converter.dateTime': '日期时间',
    'tool.timestamp-converter.now': '现在',
    'tool.timestamp-converter.utc': 'UTC',
    'tool.timestamp-converter.local': '本地',
    'tool.timestamp-converter.iso8601': 'ISO 8601',
    'tool.timestamp-converter.relative': '相对时间',
    'tool.timestamp-converter.fromNow': '后',
    'tool.timestamp-converter.ago': '前',
    'tool.timestamp-converter.seconds': '秒',
    'tool.timestamp-converter.minutes': '分钟',
    'tool.timestamp-converter.hours': '小时',
    'tool.timestamp-converter.days': '天',
    'tool.timestamp-converter.months': '个月',
    'tool.timestamp-converter.years': '年',
    // Tool hash-generator
    'tool.hash-generator.inputText': '输入文本',
    'tool.hash-generator.placeholder': '输入要哈希的文本…',
    'tool.hash-generator.generateAll': '全部生成',
    'tool.hash-generator.md5': 'MD5',
    'tool.hash-generator.sha1': 'SHA-1',
    'tool.hash-generator.sha256': 'SHA-256',
    'tool.hash-generator.sha512': 'SHA-512',
    'tool.hash-generator.copyMd5': '复制 MD5',
    'tool.hash-generator.copySha1': '复制 SHA-1',
    'tool.hash-generator.copySha256': '复制 SHA-256',
    'tool.hash-generator.copySha512': '复制 SHA-512',
    // Tool regex-tester
    'tool.regex-tester.regex': '正则表达式',
    'tool.regex-tester.regexPlaceholder': '输入正则表达式',
    'tool.regex-tester.testString': '测试文本',
    'tool.regex-tester.testStringPlaceholder': '输入测试文本…',
    'tool.regex-tester.test': '测试',
    'tool.regex-tester.matches': '匹配数',
    'tool.regex-tester.timeMs': '耗时（毫秒）',
    'tool.regex-tester.matchDetails': '匹配详情',
    'tool.regex-tester.noMatches': '无匹配',
    'tool.regex-tester.noMatchesFound': '未找到匹配',
    'tool.regex-tester.matchAt': '匹配 #',
    'tool.regex-tester.at': '于位置',
    'tool.regex-tester.group': '分组',
    // Tool number-base
    'tool.number-base.invalid': '无效',
    'tool.number-base.error': '错误',
  },
  'en': {
    'brand': 'ToolKit',
    'search.placeholder': 'Search tools…',
    'cat.all': 'All',
    'home.title': 'Useful Tools',
    'home.subtitle': 'Free · Online · No Install',
    'home.tools.count': '{n} tools · Growing',
    'home.noMatch': 'No matching tools found',
    'back': 'Back',
    'footer.license': 'Open Source · Free to Use',
    'footer.goal': 'Goal: ',
    'footer.tools': 'Useful Tools',
    'theme.light': 'Switch to light theme',
    'theme.dark': 'Switch to dark theme',
    'lang.switch': '中',
    'copy.done': 'Copied',
    // Categories
    'cat.Developer': 'Developer',
    'cat.Text': 'Text',
    'cat.Security': 'Security',
    'cat.Design': 'Design',
    'cat.Media': 'Media',
    'cat.Converter': 'Converter',
    'cat.Productivity': 'Productivity',
    // Common UI
    'common.input': 'Input',
    'common.result': 'Result',
    'common.copy': 'Copy',
    'common.clear': 'Clear',
    'common.run': 'Run',
    'common.execute': 'Execute',
    'common.convert': 'Convert',
    'common.generate': 'Generate',
    'common.swap': 'Swap',
    'common.waiting': 'Waiting for input…',
    'common.noMatches': 'No matches',
    // Tool meta: titles & descriptions
    'tool.json-formatter.title': 'JSON Formatter',
    'tool.json-formatter.desc': 'Format, compress, and validate JSON data',
    'tool.json-formatter.tabFormat': 'Format',
    'tool.json-formatter.tabCompress': 'Compress',
    'tool.json-formatter.waiting': 'Waiting for input…',
    'tool.base64.title': 'Base64 Encode / Decode',
    'tool.base64.desc': 'Encode text/files to Base64 or decode Base64 back to text',
    'tool.url-encoder.title': 'URL Encoder / Decoder',
    'tool.url-encoder.desc': 'Encode or decode URL strings',
    'tool.url-encoder.tabEncode': 'Encode',
    'tool.url-encoder.tabDecode': 'Decode',
    'tool.uuid-generator.title': 'UUID Generator',
    'tool.uuid-generator.desc': 'Generate UUID v4 / v7 and batch generation',
    'tool.uuid-generator.batchCount': 'Batch Count',
    'tool.uuid-generator.copyAll': 'Copy All',
    'tool.regex-tester.title': 'Regex Tester',
    'tool.regex-tester.desc': 'Test regular expressions against text with real-time match highlighting',
    'tool.timestamp-converter.title': 'Timestamp Converter',
    'tool.timestamp-converter.desc': 'Convert between Unix timestamps and human-readable dates',
    'tool.hash-generator.title': 'Hash Generator',
    'tool.hash-generator.desc': 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes of text',
    'tool.csv-json.title': 'CSV ↔ JSON',
    'tool.csv-json.desc': 'Convert CSV data to JSON and JSON to CSV',
    'tool.password-generator.title': 'Password Generator',
    'tool.password-generator.desc': 'Generate strong passwords with custom length and character types',
    'tool.password-generator.length': 'Length',
    'tool.password-generator.uppercase': 'Uppercase (A-Z)',
    'tool.password-generator.lowercase': 'Lowercase (a-z)',
    'tool.password-generator.digits': 'Digits (0-9)',
    'tool.password-generator.symbols': 'Symbols (!@#$)',
    'tool.password-generator.excludeAmbiguous': 'Exclude ambiguous (il1Lo0O)',
    'tool.password-generator.strength': 'Strength',
    'tool.password-generator.clickGen': 'Click to generate',
    'tool.password-generator.genPassword': 'Generate Password',
    'tool.text-analyzer.title': 'Text Analyzer',
    'tool.text-analyzer.desc': 'Comprehensive text statistics: words, chars, lines, paragraphs, unique words, readability',
    'tool.markdown-preview.title': 'Markdown Preview',
    'tool.markdown-preview.desc': 'Real-time Markdown editor with HTML preview',
    'tool.case-converter.title': 'Case Converter',
    'tool.case-converter.desc': 'Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case',
    'tool.color-palette.title': 'Color Palette',
    'tool.color-palette.desc': 'Color picker with HEX/RGB/HSL conversion, palette generation',
    'tool.pomodoro.title': 'Pomodoro Timer',
    'tool.pomodoro.desc': 'Focus timer with customizable duration and pause support',
    'tool.pomodoro.focus': 'Focus Time',
    'tool.pomodoro.start': 'Start',
    'tool.pomodoro.pause': 'Pause',
    'tool.pomodoro.reset': 'Reset',
    'tool.pomodoro.focusDuration': 'Focus Duration (min)',
    'tool.pomodoro.autoReset': 'Auto reset when done',
    'tool.pomodoro.running': 'Running',
    'tool.pomodoro.focusing': 'Focusing…',
    'tool.pomodoro.timeUp': "Time's up!",
    'tool.pomodoro.paused': 'Paused',
    'tool.qr-generator.title': 'QR Code Generator',
    'tool.qr-generator.desc': 'Generate QR codes from text or URLs with customizable colors and sizes',
    'tool.image-to-base64.title': 'Image to Base64',
    'tool.image-to-base64.desc': 'Upload an image and get its Base64 data URL',
    'tool.lorem-ipsum.title': 'Lorem Ipsum Generator',
    'tool.lorem-ipsum.desc': 'Generate placeholder text in various lengths and formats',
    'tool.html-entity.title': 'HTML Entity Converter',
    'tool.html-entity.desc': 'Encode or decode HTML entities',
    'tool.number-base.title': 'Number Base Converter',
    'tool.number-base.desc': 'Convert numbers between binary, octal, decimal, and hexadecimal',
    'tool.text-diff.title': 'Text Diff Checker',
    'tool.text-diff.desc': 'Compare two texts and highlight differences line by line',
    'tool.text-diff.originalText': 'Original Text',
    'tool.text-diff.changedText': 'Changed Text',
    'tool.text-diff.compare': 'Compare',
    'tool.text-diff.difference': 'Difference',
    'tool.text-diff.added': 'Added',
    'tool.text-diff.removed': 'Removed',
    // Tool internal UI
    'tool.html-entity.tabEncode': 'Encode',
    'tool.html-entity.tabDecode': 'Decode',
    'tool.html-entity.enterText': 'Enter text',
    'tool.base64.tabEncode': 'Encode',
    'tool.base64.tabDecode': 'Decode',
    'tool.base64.tabFile': 'File to Base64',
    'tool.base64.enterText': 'Enter text',
    'tool.base64.enterBase64': 'Enter Base64',
    'tool.base64.uploadFile': 'Upload File',
    'tool.base64.clickToSelect': 'Click to select file',
    'tool.base64.fileSelected': 'File selected',
    'tool.qr-generator.textOrUrl': 'Text or URL',
    'tool.qr-generator.enterText': 'Enter text or URL',
    'tool.qr-generator.foreground': 'Foreground',
    'tool.qr-generator.background': 'Background',
    'tool.qr-generator.generate': 'Generate QR Code',
    'tool.qr-generator.downloadPng': 'Download PNG',
    'tool.image-to-base64.uploadImage': 'Upload Image',
    'tool.image-to-base64.copyBase64': 'Copy Base64',
    'tool.image-to-base64.base64DataUrl': 'Base64 Data URL',
    'tool.image-to-base64.dragDrop': 'Or drag & drop image here',
    'tool.image-to-base64.dropHere': 'Drop image here',
    'tool.image-to-base64.dropAnother': 'Drop another image',
    'tool.markdown-preview.markdown': 'Markdown',
    'tool.markdown-preview.preview': 'Preview',
    'tool.markdown-preview.copyHtml': 'Copy HTML',
    'tool.lorem-ipsum.type': 'Type',
    'tool.lorem-ipsum.words': 'Words',
    'tool.lorem-ipsum.sentences': 'Sentences',
    'tool.lorem-ipsum.paragraphs': 'Paragraphs',
    'tool.lorem-ipsum.count': 'Count',
    'tool.number-base.binary': 'Binary',
    'tool.number-base.octal': 'Octal',
    'tool.number-base.decimal': 'Decimal',
    'tool.number-base.hexadecimal': 'Hexadecimal',
    'tool.csv-json.tabCsv2Json': 'CSV → JSON',
    'tool.csv-json.tabJson2Csv': 'JSON → CSV',
  }
};

function __(key, vars) {
  var map = _langMap[_lang] || _langMap['zh-CN'];
  var str = map[key] || key;
  if (vars !== undefined) {
    str = str.replace('{n}', vars);
  }
  return str;
}

function setLang(lang) {
  if (!_langMap[lang]) return;
  _lang = lang;
  localStorage.setItem('tk-lang', lang);
  // Translate all data-i18n elements
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    var isHtml = el.getAttribute('data-i18n-html') === 'true';
    if (isHtml) {
      el.innerHTML = __(key);
    } else {
      el.textContent = __(key);
    }
  }
  // Translate placeholders
  var phEls = document.querySelectorAll('[data-i18n-placeholder]');
  for (var i = 0; i < phEls.length; i++) {
    var el = phEls[i];
    el.placeholder = __(el.getAttribute('data-i18n-placeholder'));
  }
  // Dispatch event for dynamic content
  var evt = document.createEvent('Event');
  evt.initEvent('langchange', true, true);
  document.dispatchEvent(evt);
}

function initLang() {
  var stored = localStorage.getItem('tk-lang');
  if (stored) {
    _lang = stored;
  }
  setLang(_lang);
}

function getLang() { return _lang; }

/* Tool translation helpers - use current language for titles, descs, categories */
function getToolTitle(meta) {
  var key = 'tool.' + meta.id + '.title';
  var t = __(key);
  return t !== key ? t : meta.title;
}
function getToolDesc(meta) {
  var key = 'tool.' + meta.id + '.desc';
  var t = __(key);
  return t !== key ? t : meta.description;
}
function getToolCat(meta) {
  var key = 'cat.' + meta.category;
  var t = __(key);
  return t !== key ? t : meta.category;
}

/* ---------- Other helpers ---------- */

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
  el.textContent = msg || __('copy.done');
  el.classList.add('show');
  clearTimeout(_copyTimer);
  _copyTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// Tool registry
window.tools = {};
window.toolMeta = [];
