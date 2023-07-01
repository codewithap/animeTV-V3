// nav open-close
let navBtn = document.querySelector('.nav-menu-open');
let navMenu = document.querySelector('.NavMenu');
let navOpened = false;
navBtn.addEventListener('click',()=>{
  if (!navOpened) {
    navOpened = true;
    navMenu.style.width = '300px';
    navBtn.querySelector('i').classList.add('active');
  } else if (navOpened) {
    navMenu.style.width = '0';
    navBtn.querySelector('i').classList.remove('active');
    navOpened = false;
  }
});