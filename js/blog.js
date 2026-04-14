/* ── ETERNAL YOG BLOG ── */

var WA_NUMBER = '919220605069';
var WA_DEFAULT_MSG = "Hello! I'd like to know more about Eternal Yog classes.";
var WA_BASE = 'https://wa.me/' + WA_NUMBER + '?text=';
var WA_ICON = '<img src="../assets/icons/whatsapp.svg" alt="WhatsApp" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;">';

var AUTHOR_BIOS = {
  'Eternal Yog': 'Founded at the foothills of the Himalayas, Eternal Yog is guided by a teacher trained in the classical lineages of Hatha and Raja yoga. Every session is a living transmission — shaped by where you are, not where you think you should be.'
};

/* ── UTILS ── */

function waLink(msg) {
  return WA_BASE + encodeURIComponent(msg || WA_DEFAULT_MSG);
}

function formatDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function slugToParam(slug) {
  return 'blog.html?id=' + slug;
}

function renderCategoryPill(cat) {
  return '<span class="blog-category-pill">' + cat + '</span>';
}

/* ── BLOCK RENDERER (shared by list + detail + admin preview) ── */

function renderBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return '<div class="block-paragraph"><p>' + block.text + '</p></div>';

    case 'heading':
      var tag = 'h' + (block.level || 2);
      return '<div class="block-heading"><' + tag + '>' + block.text + '</' + tag + '></div>';

    case 'image':
      return '<figure class="block-image">' +
        '<img src="' + block.src + '" alt="' + (block.alt || '') + '" loading="lazy">' +
        (block.caption ? '<figcaption>' + block.caption + '</figcaption>' : '') +
        '</figure>';

    case 'video':
      return '<div class="block-video">' +
        '<div class="block-video-wrap">' +
        '<iframe src="' + block.embedUrl + '" title="' + (block.title || 'Video') + '" allowfullscreen loading="lazy"></iframe>' +
        '</div>' +
        (block.title ? '<p class="block-video-title">' + block.title + '</p>' : '') +
        '</div>';

    case 'quote':
      return '<div class="block-quote">' +
        '<blockquote>' + block.text + '</blockquote>' +
        (block.attribution ? '<cite>' + block.attribution + '</cite>' : '') +
        '</div>';

    case 'list':
      var tag2 = block.style === 'ordered' ? 'ol' : 'ul';
      var items = (block.items || []).map(function(i) { return '<li>' + i + '</li>'; }).join('');
      return '<div class="block-list"><' + tag2 + '>' + items + '</' + tag2 + '></div>';

    case 'cta':
      return '<div class="block-cta">' +
        '<div class="block-cta-inner">' +
        '<span class="block-cta-label">' + (block.label || 'Book a class') + '</span>' +
        '<a class="block-cta-link" href="' + waLink() + '" target="_blank" rel="noopener noreferrer">' + WA_ICON + 'WhatsApp →</a>' +
        '</div></div>';

    default:
      return '';
  }
}

/* ── BLOG CARD HTML ── */

function renderSmallCard(blog) {
  var img = blog.coverImage ? blog.coverImage.src : '../assets/images/Studio Yoga.jpg';
  var alt = blog.coverImage ? blog.coverImage.alt : blog.title;
  return '<div class="blog-card" onclick="window.location.href=\'' + slugToParam(blog.id) + '\'">' +
    '<div class="blog-card-img-wrap">' +
    '<img class="blog-card-img" src="' + img + '" alt="' + alt + '" loading="lazy">' +
    '</div>' +
    '<div class="blog-card-body">' +
    renderCategoryPill(blog.category) +
    '<div class="blog-card-title">' + blog.title + '</div>' +
    '<div class="blog-card-highlight">' + blog.highlight + '</div>' +
    '<hr class="blog-card-divider">' +
    '<div class="blog-card-footer">' +
    '<span>👤 ' + blog.author.name + '</span>' +
    '<span>⏱ ' + blog.readingTime + ' min</span>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderHeroCard(blog) {
  var img = blog.coverImage ? blog.coverImage.src : '../assets/images/Studio Yoga.jpg';
  var alt = blog.coverImage ? blog.coverImage.alt : blog.title;
  return '<div class="blog-card blog-card--hero" onclick="window.location.href=\'' + slugToParam(blog.id) + '\'">' +
    '<div class="blog-card-img-wrap">' +
    '<img class="blog-card-img" src="' + img + '" alt="' + alt + '">' +
    '<div class="blog-card-overlay">' +
    renderCategoryPill(blog.category) +
    '<div class="blog-card-title">' + blog.title + '</div>' +
    '<div class="blog-card-highlight">' + blog.highlight + '</div>' +
    '<div class="blog-card-meta">' +
    '<span>👤 ' + blog.author.name + '</span>' +
    '<span>·</span>' +
    '<span>⏱ ' + blog.readingTime + ' min read</span>' +
    '<span>·</span>' +
    '<span>' + formatDate(blog.publishedDate) + '</span>' +
    '</div>' +
    '<a class="blog-card-read-btn" href="' + slugToParam(blog.id) + '">Read Article →</a>' +
    '</div>' +
    '</div>' +
    '</div>';
}

/* ── LIST VIEW ── */

function renderListView(blogs, activeCategory, searchQuery) {
  var magGrid  = document.getElementById('blog-magazine-grid');
  var grid     = document.getElementById('blog-grid');
  var filterBar = document.getElementById('blog-filter-bar');

  /* Filter */
  var filtered = blogs.filter(function(b) {
    if (b.status && b.status !== 'published') return false;
    if (activeCategory && activeCategory !== 'All' && b.category !== activeCategory) return false;
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      return (b.title + ' ' + b.highlight + ' ' + (b.tags || []).join(' ')).toLowerCase().indexOf(q) !== -1;
    }
    return true;
  });

  /* Category filter bar */
  var categories = ['All'].concat(blogs
    .filter(function(b) { return !b.status || b.status === 'published'; })
    .map(function(b) { return b.category; })
    .filter(function(c, i, arr) { return arr.indexOf(c) === i; })
  );

  filterBar.innerHTML = categories.map(function(cat) {
    var isActive = cat === (activeCategory || 'All');
    return '<button class="blog-filter-btn' + (isActive ? ' active' : '') + '" data-cat="' + cat + '">' + cat + '</button>';
  }).join('');

  filterBar.querySelectorAll('.blog-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      renderListView(blogs, btn.dataset.cat, document.getElementById('blog-search').value);
    });
  });

  /* Magazine grid — first post is hero, next 4 fill grid areas */
  if (!filtered.length) {
    magGrid.innerHTML = '';
    grid.innerHTML = '<div class="blog-no-results">' +
      '<p>No articles found — try a different search or category.</p>' +
      '<a class="blog-wa-btn" href="' + waLink() + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="blog-wa-btn-label">' + WA_ICON + 'Ask us on WhatsApp →</span>' +
      '</a></div>';
    return;
  }

  var heroPost = filtered[0];
  var gridPosts = filtered.slice(1, 5);   /* up to 4 in magazine */
  var remainingPosts = filtered.slice(5); /* overflow to regular grid */

  /* Hero card */
  magGrid.innerHTML = renderHeroCard(heroPost);

  /* Magazine side cards (areas card2–card5) */
  var areaNames = ['card2', 'card3', 'card4', 'card5'];
  gridPosts.forEach(function(blog, i) {
    var card = document.createElement('div');
    card.style.gridArea = areaNames[i];
    card.innerHTML = renderSmallCard(blog);
    /* unwrap the inner card so grid-area applies correctly */
    var inner = card.querySelector('.blog-card');
    inner.style.gridArea = areaNames[i];
    magGrid.appendChild(inner);
  });

  /* Regular grid for any remaining posts */
  grid.innerHTML = remainingPosts.map(renderSmallCard).join('');
}

/* ── DETAIL VIEW ── */

function renderDetailView(blog, allBlogs) {
  /* Hide list, show detail */
  document.getElementById('blog-list-view').style.display = 'none';
  document.getElementById('blog-hero').style.display = 'none';
  document.getElementById('blog-filter-bar').style.display = 'none';

  /* Dynamic SEO */
  document.title = blog.seoTitle || blog.title;
  var metaDesc = document.querySelector("meta[name='description']");
  if (metaDesc) metaDesc.setAttribute('content', blog.seoDescription || '');

  /* OG tags */
  setOrCreateMeta('property', 'og:title', blog.seoTitle || blog.title);
  setOrCreateMeta('property', 'og:description', blog.seoDescription || '');
  setOrCreateMeta('property', 'og:type', 'article');
  if (blog.coverImage) setOrCreateMeta('property', 'og:image', 'https://eternalyog.com/' + blog.coverImage.src.replace('../', ''));
  setOrCreateMeta('property', 'article:published_time', blog.publishedDate || '');
  setOrCreateMeta('property', 'article:modified_time', blog.updatedDate || blog.publishedDate || '');

  /* JSON-LD Article schema */
  var ldScript = document.getElementById('blog-ld-json');
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.id = 'blog-ld-json';
    ldScript.type = 'application/ld+json';
    document.head.appendChild(ldScript);
  }
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': blog.title,
    'description': blog.seoDescription,
    'image': blog.coverImage ? 'https://eternalyog.com/' + blog.coverImage.src.replace('../', '') : '',
    'datePublished': blog.publishedDate,
    'dateModified': blog.updatedDate || blog.publishedDate,
    'author': {
      '@type': 'Person',
      'name': blog.author.name,
      'jobTitle': blog.author.title
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Eternal Yog',
      'url': 'https://eternalyog.com'
    }
  });

  /* Tags */
  var tagsHtml = (blog.tags || []).map(function(tag) {
    return '<a class="post-tag" href="blog.html?category=' + encodeURIComponent(tag) + '">#' + tag + '</a>';
  }).join('');

  /* Share buttons */
  var postUrl = 'https://eternalyog.com/html/blog.html?id=' + blog.id;
  var waShareUrl = 'https://wa.me/?text=' + encodeURIComponent(blog.title + ' — ' + postUrl);

  /* Content blocks */
  var contentHtml = (blog.content || []).map(renderBlock).join('');

  /* Author bio */
  var authorBio = AUTHOR_BIOS[blog.author.name] || '';
  var authorAvatar = blog.author.avatar || '../assets/images/Instructor.jpeg';

  /* Related posts */
  var relatedPosts = [];
  if (blog.relatedPostIds && blog.relatedPostIds.length) {
    relatedPosts = blog.relatedPostIds
      .map(function(rid) { return allBlogs.find(function(b) { return b.id === rid; }); })
      .filter(Boolean);
  }
  if (!relatedPosts.length) {
    relatedPosts = allBlogs.filter(function(b) { return b.id !== blog.id && b.category === blog.category && (!b.status || b.status === 'published'); }).slice(0, 3);
  }

  var coverImg = blog.coverImage ? blog.coverImage.src : '../assets/images/Studio Yoga.jpg';
  var coverAlt = blog.coverImage ? blog.coverImage.alt : blog.title;

  var detailHtml =
    /* Post hero */
    '<div class="post-hero">' +
    '<img class="post-hero-img" src="' + coverImg + '" alt="' + coverAlt + '">' +
    '<div class="post-hero-overlay"></div>' +
    '<div class="post-hero-content">' +
    renderCategoryPill(blog.category) +
    '<h1 class="post-hero-title">' + blog.title + '</h1>' +
    '<div class="post-hero-meta">' +
    '<img class="post-hero-avatar" src="' + authorAvatar + '" alt="' + blog.author.name + '">' +
    '<span class="post-hero-author">By ' + blog.author.name + ', ' + blog.author.title + '</span>' +
    '<span class="post-hero-date">· ' + formatDate(blog.publishedDate) + '</span>' +
    '<span class="post-hero-read">· ⏱ ' + blog.readingTime + ' min read</span>' +
    '</div>' +
    '</div>' +
    '</div>' +

    /* Meta bar */
    '<div class="post-meta-bar">' +
    '<div class="post-tags">' + tagsHtml + '</div>' +
    '<div class="post-share">' +
    '<a class="post-share-btn post-share-btn--wa" href="' + waShareUrl + '" target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">' + WA_ICON + '</a>' +
    '<button class="post-share-btn" id="copy-link-btn" title="Copy link">🔗</button>' +
    '</div>' +
    '</div>' +

    /* Content */
    '<div class="post-content-wrap">' + contentHtml + '</div>' +

    /* Author bio */
    '<div class="post-author-bio">' +
    '<div class="post-author-card">' +
    '<img class="post-author-avatar" src="' + authorAvatar + '" alt="' + blog.author.name + '">' +
    '<div class="post-author-info">' +
    '<div class="post-author-name">' + blog.author.name + '</div>' +
    '<div class="post-author-title">' + blog.author.title + '</div>' +
    (authorBio ? '<p class="post-author-text">' + authorBio + '</p>' : '') +
    '<a class="post-author-wa" href="' + waLink('Hello! I\'d like to book a trial class with ' + blog.author.name + ' at Eternal Yog.') + '" target="_blank" rel="noopener noreferrer">' + WA_ICON + 'Book a Trial →</a>' +
    '</div>' +
    '</div>' +
    '</div>' +

    /* Related posts */
    (relatedPosts.length ?
      '<div class="post-related">' +
      '<div class="post-related-badge"><div class="post-related-badge-inner">You Might Also Enjoy</div></div>' +
      '<div class="post-related-outer">' +
      '<button class="carousel-btn" id="related-prev">&#8249;</button>' +
      '<div class="post-related-track" id="post-related-track">' +
      relatedPosts.map(renderSmallCard).join('') +
      '</div>' +
      '<button class="carousel-btn" id="related-next">&#8250;</button>' +
      '</div>' +
      '</div>'
    : '') +

    /* Back link */
    '<a class="post-back-link" href="blog.html">← Back to Blog</a>';

  var detailView = document.getElementById('blog-detail-view');
  detailView.innerHTML = detailHtml;
  detailView.style.display = 'block';

  /* Copy link button */
  var copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(postUrl).then(function() {
        copyBtn.textContent = '✓';
        setTimeout(function() { copyBtn.textContent = '🔗'; }, 2000);
      });
    });
  }

  /* Related posts carousel */
  var relTrack = document.getElementById('post-related-track');
  var relPrev  = document.getElementById('related-prev');
  var relNext  = document.getElementById('related-next');
  if (relTrack && relPrev && relNext) {
    var cardW = 260 + 20;
    relPrev.addEventListener('click', function() { relTrack.scrollBy({ left: -cardW, behavior: 'smooth' }); });
    relNext.addEventListener('click', function() { relTrack.scrollBy({ left:  cardW, behavior: 'smooth' }); });
  }

}

function setOrCreateMeta(attr, value, content) {
  var existing = document.querySelector('meta[' + attr + '="' + value + '"]');
  if (!existing) {
    existing = document.createElement('meta');
    existing.setAttribute(attr, value);
    document.head.appendChild(existing);
  }
  existing.setAttribute('content', content);
}

/* ── INIT ── */

fetch('../data/blogs.json')
  .then(function(res) { return res.json(); })
  .then(function(blogs) {

    var params   = new URLSearchParams(window.location.search);
    var blogId   = params.get('id');
    var category = params.get('category');

    if (blogId) {
      var blog = blogs.find(function(b) { return b.id === blogId; });
      if (blog) {
        renderDetailView(blog, blogs);
      } else {
        document.getElementById('blog-detail-view').innerHTML = '<p style="text-align:center;padding:48px;">Post not found.</p>';
        document.getElementById('blog-detail-view').style.display = 'block';
        document.getElementById('blog-list-view').style.display = 'none';
        document.getElementById('blog-hero').style.display = 'none';
        document.getElementById('blog-filter-bar').style.display = 'none';
      }
      return;
    }

    /* List view — search wiring */
    var searchInput = document.getElementById('blog-search');
    searchInput.addEventListener('input', function() {
      renderListView(blogs, getCurrentCategory(), searchInput.value);
    });

    function getCurrentCategory() {
      var activeBtn = document.querySelector('.blog-filter-btn.active');
      return activeBtn ? activeBtn.dataset.cat : 'All';
    }

    renderListView(blogs, category || 'All', '');

  })
  .catch(function(err) {
    console.error('Blog load error:', err);
  });
