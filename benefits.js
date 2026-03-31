document.addEventListener("DOMContentLoaded", function(){

fetch("data/benefits.json")
.then(res => res.json())
.then(data => {

const container = document.getElementById("benefits-grid");

if(!container){
console.error("Benefits container missing");
return;
}

data.forEach(item => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3>${item.title}</h3>
<p>${item.description}</p>
`;

container.appendChild(card);

});

})
.catch(err => console.error("Error loading benefits:", err));

});
