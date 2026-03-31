document.addEventListener("DOMContentLoaded", function(){

fetch("data/classes.json")
.then(res => res.json())
.then(data => {

const container = document.getElementById("classes-container");

if(!container){
console.error("Classes container not found");
return;
}

data.forEach(item => {

const card = document.createElement("div");
card.className = "classcard";

card.innerHTML = `
<h3>${item.name}</h3>
<p><strong>Level:</strong> ${item.level}</p>
<p><strong>Duration:</strong> ${item.duration}</p>
<p>${item.description}</p>
`;

container.appendChild(card);

});

})
.catch(err => console.error("Classes load error:", err));

});
