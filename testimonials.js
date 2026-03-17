fetch("data/testimonials.json")
.then(res => res.json())
.then(data => {

const track = document.getElementById("testimonial-track");

data.forEach(t => {

const slide = document.createElement("div");
slide.className = "carousel-slide";

slide.innerHTML = `
<p>"${t.text}"</p>
<h4>${t.name}</h4>
<span class="since">${t.since}</span>
`;

track.appendChild(slide);

});

let index = 0;

function getSlidesPerView(){
if(window.innerWidth < 600) return 1;
if(window.innerWidth < 900) return 2;
return 3;
}

function updateCarousel(){
const slides = document.querySelectorAll(".carousel-slide");
const perView = getSlidesPerView();
const slideWidth = 100 / perView;

slides.forEach(s => {
s.style.minWidth = slideWidth + "%";
});

move();
}

function move(){
const perView = getSlidesPerView();
track.style.transform = `translateX(-${index * (100 / perView)}%)`;
}

document.querySelector(".next").onclick = () => {
const maxIndex = data.length - getSlidesPerView();
index = index >= maxIndex ? 0 : index + 1;
move();
};

document.querySelector(".prev").onclick = () => {
const maxIndex = data.length - getSlidesPerView();
index = index <= 0 ? maxIndex : index - 1;
move();
};

window.addEventListener("resize", updateCarousel);

setInterval(() => {
const maxIndex = data.length - getSlidesPerView();
index = index >= maxIndex ? 0 : index + 1;
move();
}, 4000);

updateCarousel();

});
