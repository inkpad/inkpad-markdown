var marked = require('marked');
var yaml = require('js-yaml');

marked.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartLists: true,
});

function extractMetadata(value) {
  var rgx = /^\+\+\+\r?\n((?:.*\r?\n)*)\+\+\+/;
  var metadataYaml = (value.match(rgx) || []).pop();
  var metadata;

  try {
    metadata = yaml.safeLoad(metadataYaml);
  } catch (error) {
    metadata = {};
  }

  return {
    metadata: metadata,
    markdown: value.replace(rgx, ''),
  };
}

function markdown(value) {
  var value = extractMetadata(value);
  value.markdown = (value.markdown || '').replace(/\r\n/g, '\n');
  value.html = marked(value.markdown, { renderer: markdown.renderer });
  value.toString = function() { return value.html; };

  return value;
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
