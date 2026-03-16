fetch("data/benefits.json")
.then(res => res.json())
.then(benefits => {

const container = document.getElementById("benefits-grid");
const modal = document.getElementById("benefit-modal");
const modalContent = document.getElementById("benefit-modal-content");

benefits.forEach(b => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${b.title}</h3>
<p>${b.description}</p>
`;

card.addEventListener("click", () => {

modalContent.innerHTML = `
<h2>${b.title}</h2>
<p>${b.details}</p>
${b.link ? `<a class="card-link" href="${b.link}" target="_blank">Learn More</a>` : ""}
`;

modal.classList.add("show");

});

container.appendChild(card);

});

/* close when clicking outside */

modal.addEventListener("click", e => {
if(e.target === modal){
modal.classList.remove("show");
}
});

/* close when scrolling */

window.addEventListener("scroll", () => {
modal.classList.remove("show");
});

});
