function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('interests');

  document.querySelectorAll('.profile-list img').forEach(img => {
    img.addEventListener('click', () => {
      showSection(img.dataset.section);
    });
  });
});