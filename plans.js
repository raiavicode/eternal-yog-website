fetch("data/plans.json")
.then(res => res.json())
.then(plans => {

const container = document.getElementById("plans-container");
const details = document.getElementById("plan-details");
const payBtn = document.getElementById("payBtn");

let selectedPlan = null;

/* Render cards */

plans.forEach(plan => {

const card = document.createElement("div");
card.className = "plan-card";

card.innerHTML = `
<h3>${plan.name}</h3>
<p>${plan.price}</p>
`;

card.onclick = () => {

document.querySelectorAll(".plan-card").forEach(c=>c.classList.remove("active"));
card.classList.add("active");

selectedPlan = plan;

/* Show table */

details.classList.remove("hidden");

details.innerHTML = `
<table>

<tr><td><strong>Plan</strong></td><td>${plan.name}</td></tr>
<tr><td><strong>Price</strong></td><td>${plan.price}</td></tr>
<tr><td><strong>Duration</strong></td><td>${plan.duration}</td></tr>
<tr><td><strong>Frequency</strong></td><td>${plan.frequency}</td></tr>
<tr><td><strong>Details</strong></td><td>${plan.description}</td></tr>

</table>
`;

/* Show button */

payBtn.classList.remove("hidden");

};

container.appendChild(card);

});

/* Payment click */

payBtn.onclick = () => {

if(!selectedPlan) return;

/* TEMP: WhatsApp (replace with Razorpay later) */

const message = `Hi, I want to join ${selectedPlan.name}`;

window.open(`https://wa.me/919220605069?text=${message}`);

};

});
