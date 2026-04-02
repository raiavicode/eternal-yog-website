fetch("../data/blogs.json")
.then(res => res.json())
.then(blogs => {

const container = document.getElementById("blog-container");
const filter = document.getElementById("category-filter");

/* Get blog id from URL */

const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

/* =========================
   BLOG DETAIL VIEW
========================= */

if(blogId){

const blog = blogs.find(b => b.id == blogId);

/* SEO */

document.title = blog.seoTitle;

const metaDesc = document.querySelector("meta[name='description']");
if(metaDesc){
metaDesc.setAttribute("content", blog.seoDescription);
}

/* Render blog */

container.innerHTML = `
<div class="blog-detail">

<h1>${blog.title}</h1>

<p class="blog-highlight">${blog.highlight}</p>

<p>${blog.content}</p>

<a href="blog.html" class="cta">← Back to Blogs</a>

</div>
`;

return;
}

/* =========================
   BLOG LIST VIEW
========================= */

const categories = [...new Set(blogs.map(b => b.category))];

const allBtn = document.createElement("button");
allBtn.innerText = "All";
allBtn.onclick = () => renderBlogs(blogs);
filter.appendChild(allBtn);

categories.forEach(cat => {
const btn = document.createElement("button");
btn.innerText = cat;
btn.onclick = () => {
renderBlogs(blogs.filter(b => b.category === cat));
};
filter.appendChild(btn);
});

function renderBlogs(data){

container.innerHTML = "";

data.forEach(b => {

const card = document.createElement("div");
card.className = "card blog-card";

card.innerHTML = `
<h3>${b.title}</h3>
<p>${b.highlight}</p>
`;

card.onclick = () => {
window.location.href = `blog.html?id=${b.id}`;
};

container.appendChild(card);

});

}

renderBlogs(blogs);

});
