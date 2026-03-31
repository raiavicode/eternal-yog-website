fetch("data/benefits.json")
.then(res => res.json())
.then(data => {

const container = document.getElementById("benefits-container");

/* SAFETY CHECK */

if(!container){
console.error("Benefits container not found");
return;
}

/* RENDER CARDS */

data.forEach(item => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${item.title}</h3>
<p>${item.description}</p>
`;

container.appendChild(card);

/* ADD CLICK EVENT SAFELY */

card.addEventListener("click", () => {

const modal = document.getElementById("benefit-modal");
const content = document.getElementById("benefit-modal-content");

if(!modal || !content) return;

content.innerHTML = `
<h2>${item.title}</h2>
<p>${item.details}</p>
`;

modal.classList.add("show");

});

});

/* CLOSE MODAL */

document.addEventListener("click", (e) => {
const modal = document.getElementById("benefit-modal");

if(e.target.id === "benefit-modal"){
modal.classList.remove("show");
}
});

});
