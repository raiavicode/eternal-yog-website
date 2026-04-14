/**
 * Eternal Yog — Local Development Server
 *
 * Serves static files + provides a single POST endpoint
 * used by blog-admin.html to save new/updated blog posts
 * directly to data/blogs.json without editing JSON manually.
 *
 * Usage:  node server.js
 * Then open: http://localhost:8080
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 8080;
const BLOGS_FILE = path.join(__dirname, 'data', 'blogs.json');

/* ── Middleware ── */
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));  /* serve entire project root */

/* ── POST /api/save-blog ── */
app.post('/api/save-blog', (req, res) => {
  const post = req.body;

  if (!post || !post.id || !post.title) {
    return res.status(400).json({ error: 'Post must have an id and title.' });
  }

  let blogs = [];
  try {
    const raw = fs.readFileSync(BLOGS_FILE, 'utf8');
    blogs = JSON.parse(raw);
  } catch (e) {
    // start fresh if file doesn't exist or is invalid
    blogs = [];
  }

  /* Upsert: replace existing post with same id, or append */
  const existingIndex = blogs.findIndex(b => b.id === post.id);
  if (existingIndex !== -1) {
    blogs[existingIndex] = post;
  } else {
    blogs.push(post);
  }

  try {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf8');
    res.json({ success: true, id: post.id, total: blogs.length });
  } catch (e) {
    res.status(500).json({ error: 'Could not write blogs.json: ' + e.message });
  }
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log('');
  console.log('  Eternal Yog dev server running at http://localhost:' + PORT);
  console.log('  Blog admin:  http://localhost:' + PORT + '/html/blog-admin.html');
  console.log('  Blog:        http://localhost:' + PORT + '/html/blog.html');
  console.log('');
});
