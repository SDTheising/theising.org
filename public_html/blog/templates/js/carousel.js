const track = document.getElementById('carousel');
const slides = Array.from(track.children);
const leftButton = document.querySelector('.arrow.left');
const rightButton = document.querySelector('.arrow.right');
let currentIndex = 0;

function updateCarousel() {
  const slideWidth = document.querySelector('.carousel-container').clientWidth;
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentIndex);
  });
}


leftButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

rightButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);

// Initialize on load
updateCarousel();
