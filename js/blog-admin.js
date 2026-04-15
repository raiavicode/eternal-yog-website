/* ── ETERNAL YOG BLOG ADMIN ── */

var blocks = [];
var tags   = [];
var keywords = [];
var relatedIds = [];
var allBlogs = [];
var previewMode = false;

/* ── SLUG UTILS ── */

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ── CHAR COUNTERS ── */

function setupCounter(inputId, counterId, max) {
  var input   = document.getElementById(inputId);
  var counter = document.getElementById(counterId);
  function update() {
    var len = input.value.length;
    counter.textContent = len + '/' + max;
    counter.classList.toggle('over', len > max);
  }
  input.addEventListener('input', update);
}

/* ── AUTO-SLUG FROM TITLE ── */

document.getElementById('adm-title').addEventListener('input', function() {
  var slugInput = document.getElementById('adm-slug');
  slugInput.value = slugify(this.value);
  document.getElementById('adm-slug-preview').textContent = slugInput.value || 'your-post-slug';
});

document.getElementById('adm-slug').addEventListener('input', function() {
  document.getElementById('adm-slug-preview').textContent = this.value || 'your-post-slug';
});

/* Published toggle → status pill */

function updateStatusPill() {
  var pub = document.getElementById('adm-published').checked;
  document.getElementById('adm-export-status').textContent = pub ? 'Published' : 'Draft';
}

document.getElementById('adm-published').addEventListener('change', updateStatusPill);

/* Cover image preview */

document.getElementById('adm-cover-src').addEventListener('input', function() {
  var wrap = document.getElementById('adm-cover-preview-wrap');
  var img  = document.getElementById('adm-cover-preview');
  if (this.value) {
    img.src = this.value;
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
});

/* ── TAGS / KEYWORDS INPUT ── */

function setupTagInput(inputId, wrapId, store) {
  var input = document.getElementById(inputId);
  var wrap  = document.getElementById(wrapId);

  function addTag(val) {
    val = val.trim();
    if (!val || store.indexOf(val) !== -1) return;
    store.push(val);
    renderTags();
  }

  function removeTag(val) {
    var idx = store.indexOf(val);
    if (idx !== -1) store.splice(idx, 1);
    renderTags();
  }

  function renderTags() {
    var pills = store.map(function(t) {
      return '<span class="adm-pill">' + t +
        '<button class="adm-pill-remove" data-val="' + t + '">×</button>' +
        '</span>';
    }).join('');
    wrap.innerHTML = pills;
    wrap.appendChild(input);
    wrap.querySelectorAll('.adm-pill-remove').forEach(function(btn) {
      btn.addEventListener('click', function() { removeTag(btn.dataset.val); });
    });
  }

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(this.value);
      this.value = '';
    }
  });
}

setupTagInput('adm-tags-input', 'adm-tags-wrap', tags);
setupTagInput('adm-kw-input',   'adm-kw-wrap',   keywords);

/* ── RELATED POSTS ── */

function setupRelatedSearch() {
  var input = document.getElementById('adm-related-search');
  var suggestions = document.getElementById('adm-related-suggestions');
  var wrap = document.getElementById('adm-related-wrap');

  function addRelated(blog) {
    if (relatedIds.indexOf(blog.id) !== -1 || relatedIds.length >= 3) return;
    relatedIds.push(blog.id);
    renderRelated();
  }

  function removeRelated(id) {
    var idx = relatedIds.indexOf(id);
    if (idx !== -1) relatedIds.splice(idx, 1);
    renderRelated();
  }

  function renderRelated() {
    var pills = relatedIds.map(function(id) {
      var b = allBlogs.find(function(x) { return x.id === id; });
      var label = b ? b.title : id;
      return '<span class="adm-pill">' + label +
        '<button class="adm-pill-remove" data-id="' + id + '">×</button>' +
        '</span>';
    }).join('');
    wrap.innerHTML = pills;
    wrap.querySelectorAll('.adm-pill-remove').forEach(function(btn) {
      btn.addEventListener('click', function() { removeRelated(btn.dataset.id); });
    });
  }

  input.addEventListener('input', function() {
    var q = this.value.toLowerCase();
    if (!q) { suggestions.style.display = 'none'; return; }
    var results = allBlogs.filter(function(b) {
      return b.title.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    if (!results.length) { suggestions.style.display = 'none'; return; }
    suggestions.innerHTML = results.map(function(b) {
      return '<div class="adm-suggestion-item" data-id="' + b.id + '">' + b.title + '</div>';
    }).join('');
    suggestions.style.display = 'block';
    suggestions.querySelectorAll('.adm-suggestion-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var b = allBlogs.find(function(x) { return x.id === item.dataset.id; });
        if (b) addRelated(b);
        input.value = '';
        suggestions.style.display = 'none';
      });
    });
  });

  document.addEventListener('click', function(e) {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.style.display = 'none';
    }
  });
}

/* ── AUTO READING TIME ── */

document.getElementById('adm-calc-rt').addEventListener('click', function() {
  var wordCount = blocks.reduce(function(total, b) {
    if (b.type === 'paragraph') return total + (b.text || '').split(/\s+/).length;
    if (b.type === 'heading')   return total + (b.text || '').split(/\s+/).length;
    if (b.type === 'list')      return total + (b.items || []).join(' ').split(/\s+/).length;
    return total;
  }, 0);
  var rt = Math.max(1, Math.round(wordCount / 200));
  document.getElementById('adm-reading-time').value = rt;
});

/* ── BLOCK BUILDER ── */

function createBlock(type) {
  var block = { type: type };
  if (type === 'paragraph') block.text = '';
  if (type === 'heading')   { block.text = ''; block.level = 2; }
  if (type === 'image')     { block.src = ''; block.alt = ''; block.caption = ''; }
  if (type === 'video')     { block.embedUrl = ''; block.title = ''; }
  if (type === 'quote')     { block.text = ''; block.attribution = ''; }
  if (type === 'list')      { block.style = 'unordered'; block.items = ['']; }
  if (type === 'cta')       { block.variant = 'whatsapp'; block.label = ''; }
  return block;
}

function renderBlockEditor(block, index) {
  var div = document.createElement('div');
  div.className = 'adm-block';
  div.dataset.index = index;
  div.draggable = true;

  var headerHtml = '<div class="adm-block-header">' +
    '<span class="adm-block-drag" title="Drag to reorder">⠿⠿</span>' +
    '<span class="adm-block-type-label">' + block.type.charAt(0).toUpperCase() + block.type.slice(1) + '</span>' +
    '<button class="adm-block-delete" data-index="' + index + '" title="Remove block">🗑</button>' +
    '</div>';

  var bodyHtml = '<div class="adm-block-field">';

  switch (block.type) {
    case 'paragraph':
      bodyHtml += '<textarea class="adm-textarea" rows="4" data-field="text" placeholder="Paragraph text…">' + (block.text || '') + '</textarea>';
      break;

    case 'heading':
      var lvls = [2, 3].map(function(l) {
        return '<button class="adm-level-btn' + (block.level === l ? ' active' : '') + '" data-level="' + l + '">H' + l + '</button>';
      }).join('');
      bodyHtml += '<div class="adm-level-btns">' + lvls + '</div>';
      bodyHtml += '<input class="adm-input" type="text" data-field="text" placeholder="Heading text…" value="' + (block.text || '') + '">';
      break;

    case 'image':
      bodyHtml += '<input class="adm-input" type="text" data-field="src" placeholder="Image URL or path…" value="' + (block.src || '') + '" style="margin-bottom:6px">';
      bodyHtml += '<input class="adm-input" type="text" data-field="alt" placeholder="Alt text (SEO)…" value="' + (block.alt || '') + '" style="margin-bottom:6px">';
      bodyHtml += '<input class="adm-input" type="text" data-field="caption" placeholder="Optional caption…" value="' + (block.caption || '') + '">';
      break;

    case 'video':
      bodyHtml += '<input class="adm-input" type="text" data-field="embedUrl" placeholder="YouTube URL (watch or embed)…" value="' + (block.embedUrl || '') + '" style="margin-bottom:6px">';
      bodyHtml += '<input class="adm-input" type="text" data-field="title" placeholder="Video title (accessibility)…" value="' + (block.title || '') + '">';
      break;

    case 'quote':
      bodyHtml += '<textarea class="adm-textarea" rows="2" data-field="text" placeholder="Quote text (Sanskrit or inspirational)…">' + (block.text || '') + '</textarea>';
      bodyHtml += '<input class="adm-input" type="text" data-field="attribution" placeholder="Attribution / source…" value="' + (block.attribution || '') + '" style="margin-top:6px">';
      break;

    case 'list':
      var styleToggle = '<div style="display:flex;gap:8px;margin-bottom:8px">' +
        '<label style="font-family:Inter,sans-serif;font-size:0.8rem;cursor:pointer"><input type="radio" name="list-style-' + index + '" value="unordered" ' + (block.style !== 'ordered' ? 'checked' : '') + ' data-field="style"> Unordered</label>' +
        '<label style="font-family:Inter,sans-serif;font-size:0.8rem;cursor:pointer"><input type="radio" name="list-style-' + index + '" value="ordered" ' + (block.style === 'ordered' ? 'checked' : '') + ' data-field="style"> Ordered</label>' +
        '</div>';
      var itemsHtml = '<div class="adm-list-items" data-items-container>' +
        (block.items || ['']).map(function(item, ii) {
          return '<div class="adm-list-item-row" data-item-row>' +
            '<input class="adm-input" type="text" data-item-index="' + ii + '" value="' + item + '" placeholder="List item…">' +
            '<button class="adm-remove-item" data-remove-item>×</button>' +
            '</div>';
        }).join('') +
        '</div>' +
        '<button class="adm-add-item" data-add-item>+ Add item</button>';
      bodyHtml += styleToggle + itemsHtml;
      break;

    case 'cta':
      bodyHtml += '<textarea class="adm-textarea" rows="2" data-field="label" placeholder="CTA label text…">' + (block.label || '') + '</textarea>';
      break;
  }

  bodyHtml += '</div>';
  div.innerHTML = headerHtml + bodyHtml;

  /* Delete */
  div.querySelector('.adm-block-delete').addEventListener('click', function() {
    blocks.splice(parseInt(this.dataset.index), 1);
    refreshBlockList();
  });

  /* Field bindings */
  div.querySelectorAll('[data-field]').forEach(function(el) {
    el.addEventListener('input', function() {
      blocks[index][el.dataset.field] = el.value;
    });
    el.addEventListener('change', function() {
      blocks[index][el.dataset.field] = el.value;
    });
  });

  /* Heading level buttons */
  div.querySelectorAll('.adm-level-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      blocks[index].level = parseInt(btn.dataset.level);
      div.querySelectorAll('.adm-level-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  /* List items */
  if (block.type === 'list') {
    function syncItems() {
      blocks[index].items = Array.from(div.querySelectorAll('[data-item-index]')).map(function(inp) { return inp.value; });
    }

    div.querySelectorAll('[data-item-index]').forEach(function(inp) {
      inp.addEventListener('input', syncItems);
    });

    div.querySelector('[data-add-item]').addEventListener('click', function() {
      blocks[index].items.push('');
      refreshBlockList();
    });

    div.querySelectorAll('[data-remove-item]').forEach(function(btn, ri) {
      btn.addEventListener('click', function() {
        if (blocks[index].items.length > 1) {
          blocks[index].items.splice(ri, 1);
          refreshBlockList();
        }
      });
    });
  }

  /* Drag and drop */
  div.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text/plain', index);
    div.style.opacity = '0.5';
  });
  div.addEventListener('dragend', function() { div.style.opacity = '1'; });
  div.addEventListener('dragover', function(e) { e.preventDefault(); div.style.borderColor = 'var(--deep-green)'; });
  div.addEventListener('dragleave', function() { div.style.borderColor = ''; });
  div.addEventListener('drop', function(e) {
    e.preventDefault();
    div.style.borderColor = '';
    var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    var toIndex = parseInt(div.dataset.index);
    if (fromIndex !== toIndex) {
      var moved = blocks.splice(fromIndex, 1)[0];
      blocks.splice(toIndex, 0, moved);
      refreshBlockList();
    }
  });

  return div;
}

function refreshBlockList() {
  var container = document.getElementById('adm-blocks-list');
  container.innerHTML = '';
  blocks.forEach(function(block, i) {
    container.appendChild(renderBlockEditor(block, i));
  });
}

/* Add block buttons */
document.querySelectorAll('.adm-block-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    blocks.push(createBlock(btn.dataset.type));
    refreshBlockList();
    if (previewMode) updatePreview();
  });
});

document.getElementById('adm-add-paragraph').addEventListener('click', function() {
  blocks.push(createBlock('paragraph'));
  refreshBlockList();
});

/* ── PREVIEW ── */

function updatePreview() {
  // import renderBlock from blog.js context via inline re-declaration for preview
  var previewArea = document.getElementById('adm-preview-area');
  var html = blocks.map(renderBlockForAdmin).join('');
  previewArea.innerHTML = html || '<p style="color:#8a7a68;font-family:Inter,sans-serif;text-align:center;padding:40px">No content blocks yet.</p>';
}

/* Simplified block renderer for admin preview */
function renderBlockForAdmin(block) {
  switch (block.type) {
    case 'paragraph':
      return '<div class="block-paragraph"><p>' + (block.text || '') + '</p></div>';
    case 'heading':
      var t = 'h' + (block.level || 2);
      return '<div class="block-heading"><' + t + '>' + (block.text || '') + '</' + t + '></div>';
    case 'image':
      return block.src ? '<figure class="block-image"><img src="' + block.src + '" alt="' + (block.alt || '') + '" style="max-width:100%;border-radius:12px">' + (block.caption ? '<figcaption>' + block.caption + '</figcaption>' : '') + '</figure>' : '';
    case 'video':
      return block.embedUrl ? '<div class="block-video"><div class="block-video-wrap"><iframe src="' + toEmbedUrl(block.embedUrl) + '" allowfullscreen></iframe></div></div>' : '';
    case 'quote':
      return '<div class="block-quote"><blockquote>' + (block.text || '') + '</blockquote>' + (block.attribution ? '<cite>' + block.attribution + '</cite>' : '') + '</div>';
    case 'list':
      var tag = block.style === 'ordered' ? 'ol' : 'ul';
      var items = (block.items || []).map(function(i) { return '<li>' + i + '</li>'; }).join('');
      return '<div class="block-list"><' + tag + '>' + items + '</' + tag + '></div>';
    case 'cta':
      return '<div class="block-cta"><div class="block-cta-inner"><span class="block-cta-label">' + (block.label || 'Book a class') + '</span><span class="block-cta-link"><img src="../assets/icons/whatsapp.svg" alt="WhatsApp" style="width:16px;height:16px;vertical-align:middle;margin-right:5px;">WhatsApp →</span></div></div>';
    default: return '';
  }
}

function toEmbedUrl(url) {
  if (!url) return '';
  if (url.indexOf('embed') !== -1) return url;
  var m = url.match(/[?&]v=([^&]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  var m2 = url.match(/youtu\.be\/([^?]+)/);
  if (m2) return 'https://www.youtube.com/embed/' + m2[1];
  return url;
}

document.getElementById('adm-toggle-preview').addEventListener('click', function() {
  previewMode = !previewMode;
  document.getElementById('adm-blocks-list').style.display = previewMode ? 'none' : 'block';
  document.getElementById('adm-add-paragraph').style.display = previewMode ? 'none' : 'block';
  document.querySelector('.adm-block-toolbar').style.display = previewMode ? 'none' : 'flex';
  document.getElementById('adm-preview-area').style.display = previewMode ? 'block' : 'none';
  this.textContent = previewMode ? 'Edit Mode' : 'Preview Mode';
  if (previewMode) updatePreview();
});

/* ── BUILD JSON ── */

function buildPostJson() {
  /* Sanitise YouTube embed URLs in video blocks */
  var contentBlocks = blocks.map(function(b) {
    if (b.type === 'video' && b.embedUrl) {
      return Object.assign({}, b, { embedUrl: toEmbedUrl(b.embedUrl) });
    }
    return b;
  });

  var now = new Date().toISOString();
  return {
    id:             document.getElementById('adm-slug').value || slugify(document.getElementById('adm-title').value),
    title:          document.getElementById('adm-title').value,
    seoTitle:       document.getElementById('adm-seo-title').value,
    seoDescription: document.getElementById('adm-seo-desc').value,
    keywords:       keywords.slice(),
    category:       document.getElementById('adm-category').value,
    tags:           tags.slice(),
    author: {
      name:   document.getElementById('adm-author-name').value,
      title:  document.getElementById('adm-author-title').value,
      avatar: '../assets/images/Instructor.jpeg'
    },
    publishedDate:  document.getElementById('adm-date').value || now,
    updatedDate:    now,
    readingTime:    parseInt(document.getElementById('adm-reading-time').value) || 4,
    coverImage: {
      src:     document.getElementById('adm-cover-src').value,
      alt:     document.getElementById('adm-cover-alt').value,
      caption: document.getElementById('adm-cover-caption').value
    },
    highlight:      document.getElementById('adm-highlight').value,
    content:        contentBlocks,
    relatedPostIds: relatedIds.slice(),
    featured:       document.getElementById('adm-featured').checked,
    status:         document.getElementById('adm-published').checked ? 'published' : 'draft'
  };
}

/* ── COPY JSON ── */

document.getElementById('adm-copy-json').addEventListener('click', function() {
  var json = JSON.stringify(buildPostJson(), null, 2);
  navigator.clipboard.writeText(json).then(function() {
    var btn = document.getElementById('adm-copy-json');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy JSON'; }, 2000);
  });
});

/* ── DOWNLOAD JSON ── */

document.getElementById('adm-download-json').addEventListener('click', function() {
  var post = buildPostJson();
  var blob = new Blob([JSON.stringify(post, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = post.id + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

/* ── PUBLISH (POST to local server) ── */

document.getElementById('adm-publish-btn').addEventListener('click', function() {
  var btn = this;
  var post = buildPostJson();

  if (!post.title || !post.id) {
    alert('Please enter a title before publishing.');
    return;
  }

  btn.textContent = 'Saving…';
  btn.disabled = true;

  fetch('/api/save-blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Server error: ' + res.status);
    return res.json();
  })
  .then(function() {
    btn.textContent = 'Published!';
    btn.style.background = '#2e7d32';
    setTimeout(function() {
      btn.textContent = 'Publish';
      btn.style.background = '';
      btn.disabled = false;
    }, 2500);
  })
  .catch(function(err) {
    alert('Could not save: ' + err.message + '\n\nMake sure server.js is running (node server.js).');
    btn.textContent = 'Publish';
    btn.disabled = false;
  });
});

/* ── INIT ── */

setupCounter('adm-seo-title', 'seo-title-counter', 60);
setupCounter('adm-seo-desc',  'seo-desc-counter',  160);
updateStatusPill();

/* Set default date */
var now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById('adm-date').value = now.toISOString().slice(0, 16);

/* Load existing blogs for related post search */
fetch('../data/blogs.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    allBlogs = data;
    setupRelatedSearch();
  })
  .catch(function() { setupRelatedSearch(); });

/* Add one empty paragraph block by default */
blocks.push(createBlock('paragraph'));
refreshBlockList();
