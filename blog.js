fetch("data/blogs.json")
.then(res => res.json())
.then(blogs => {

const container = document.getElementById("blog-container");
const filter = document.getElementById("category-filter");

/* Get unique categories */

const categories = [...new Set(blogs.map(b => b.category))];

/* Add ALL button */

const allBtn = document.createElement("button");
allBtn.innerText = "All";
allBtn.onclick = () => renderBlogs(blogs);
filter.appendChild(allBtn);

/* Category buttons */

categories.forEach(cat => {
const btn = document.createElement("button");
btn.innerText = cat;
btn.onclick = () => {
renderBlogs(blogs.filter(b => b.category === cat));
};
filter.appendChild(btn);
});

/* Render blogs */

function renderBlogs(data){

container.innerHTML = "";

data.forEach(b => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${b.title}</h3>
<p>${b.content}</p>
`;

container.appendChild(card);

});

}

/* Initial render */

renderBlogs(blogs);

});
