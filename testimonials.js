fetch("data/testimonials.json")
.then(res => res.json())
.then(data => {

const track = document.getElementById("testimonial-track");

data.forEach(t => {

const slide = document.createElement("div");
slide.className = "carousel-slide";

slide.innerHTML = `
<p>"${t.text}"</p>
<h4>- ${t.name}</h4>
`;

track.appendChild(slide);

});

let index = 0;

const slides = document.querySelectorAll(".carousel-slide");

function showSlide(i){
track.style.transform = `translateX(-${i * 100}%)`;
}

document.querySelector(".next").onclick = () => {
index = (index + 1) % slides.length;
showSlide(index);
};

document.querySelector(".prev").onclick = () => {
index = (index - 1 + slides.length) % slides.length;
showSlide(index);
};

/* Auto slide */

setInterval(() => {
index = (index + 1) % slides.length;
showSlide(index);
}, 4000);

});
