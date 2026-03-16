fetch("data/classes.json")
.then(res => res.json())
.then(classes => {

const container = document.getElementById("classes-grid");

classes.forEach(c => {

const card = document.createElement("div");
card.className = "classcard";

card.innerHTML = `
<h3>${c.name}</h3>
<p class="level">${c.level}</p>
<p class="duration">${c.duration}</p>

<div class="card-info">

<p>${c.description || ""}</p>

${c.video ? `<a class="card-link" href="${c.video}" target="_blank">Watch Example</a>` : ""}

<a class="cta small" href="https://forms.gle/Ho6Sdi6eCTBkC4Gi7">Enroll</a>

</div>
`;

container.appendChild(card);

});

});
