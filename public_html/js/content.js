function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });

document.addEventListener('DOMContentLoaded', () => {
  showSection('interests');
});

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
  }
}
