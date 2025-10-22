const initCarousel = (container) => {
  const track = container.querySelector('.carousel-track');
  const slides = track ? Array.from(track.children) : [];
  if (!track || slides.length === 0) {
    return;
  }

  const leftButton = container.querySelector('.arrow.left');
  const rightButton = container.querySelector('.arrow.right');
  let currentIndex = 0;

  const updateCarousel = () => {
    const slideWidth = container.clientWidth;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
  };

  if (leftButton) {
    leftButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }

  if (rightButton) {
    rightButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
};

document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(initCarousel);
});
