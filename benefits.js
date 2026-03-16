fetch("data/benefits.json")
.then(res => res.json())
.then(benefits => {

const container = document.getElementById("benefits-grid");

benefits.forEach(b => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${b.title}</h3>

<div class="card-info">

<p>${b.description || ""}</p>

${b.link ? `<a class="card-link" href="${b.link}" target="_blank">Learn More</a>` : ""}

</div>
`;

container.appendChild(card);

});

});
