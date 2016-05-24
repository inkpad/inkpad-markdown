var marked = require('marked');

marked.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartLists: true,
});

function markdown(value) {
  value = (value || '').replace(/\r\n/g, '\n');
  return marked(value, { renderer: markdown.renderer });
}

markdown.renderer = new marked.Renderer();

markdown.renderer.listitem = function(text) {
  var _text, checkedStr, regexp;

  regexp = /^\[.\]/;
  _text = text.replace(/^<p>|<\/p>$/gm, '');
  if (regexp.test(_text)) {
    checkedStr = /^\[[^\s]\]/.test(_text) ? ' checked' : '';
    return '<li class="task-list-item">\n  <input type="checkbox" onclick="return false;"' + checkedStr + ' />\n  <span>' + (_text.replace(regexp, '')) + '</span>\n</li>';
  } else {
    return marked.Renderer.prototype.listitem(text);
  }
};

module.exports = markdown;
