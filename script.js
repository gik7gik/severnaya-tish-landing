const body = document.body;
const header = document.getElementById('site-header');
const hero = document.querySelector('.hero');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const dialog = document.getElementById('booking-dialog');
const form = document.getElementById('booking-form');

requestAnimationFrame(() => body.classList.add('loaded'));

const headerObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-scrolled', entry.intersectionRatio < 0.94);
}, { threshold: 0.94 });
headerObserver.observe(hero);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(element);
});

function closeMenu() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('.open-booking').forEach((button) => {
  button.addEventListener('click', () => {
    closeMenu();
    dialog.showModal();
    body.classList.add('dialog-open');
  });
});

function closeDialog() {
  dialog.close();
  body.classList.remove('dialog-open');
}

dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.querySelector('.dialog-done').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener('close', () => body.classList.remove('dialog-open'));

function setError(field, message) {
  const error = document.getElementById(`${field.id.replace('guest-', '')}-error`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('guest-name');
  const email = document.getElementById('guest-email');
  let valid = true;

  setError(name, '');
  setError(email, '');

  if (name.value.trim().length < 2) {
    setError(name, 'Напишите, как к вам обращаться.');
    valid = false;
  }
  if (!email.validity.valid || !email.value.trim()) {
    setError(email, 'Проверьте адрес электронной почты.');
    valid = false;
  }
  if (!valid) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  form.closest('.booking-form-wrap').hidden = true;
  dialog.querySelector('.booking-success').hidden = false;
});

