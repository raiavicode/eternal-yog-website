document.addEventListener("DOMContentLoaded", function(){

fetch("data/testimonials.json")
.then(res => res.json())
.then(data => {

const track = document.getElementById("testimonial-track");

if(!track){
console.error("testimonial-track not found");
return;
}

let index = 0;

/* Render slides */

data.forEach(t => {

const slide = document.createElement("div");
slide.className = "carousel-slide";

slide.innerHTML = `
<div>
<p>"${t.text}"</p>
<h4>${t.name}</h4>
<span>${t.since}</span>
</div>
`;

track.appendChild(slide);

});

const slides = document.querySelectorAll(".carousel-slide");

/* Buttons */

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

/* Move function */

function updateSlide(){
track.style.transform = `translateX(-${index * 100}%)`;
}

/* Next */

if(nextBtn){
nextBtn.addEventListener("click", ()=>{
index = (index + 1) % slides.length;
updateSlide();
});
}

/* Prev */

if(prevBtn){
prevBtn.addEventListener("click", ()=>{
index = (index - 1 + slides.length) % slides.length;
updateSlide();
});
}

/* Auto slide */

setInterval(()=>{
index = (index + 1) % slides.length;
updateSlide();
}, 4000);

})
.catch(err => console.error("Testimonials load error:", err));

});
