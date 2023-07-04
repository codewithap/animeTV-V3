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

let showSearchBtn = document.querySelector('.showSearch');
let searchBox = document.querySelector('.search');
let showSearch = false;
showSearchBtn.addEventListener('click', () => {
  if (!showSearch) {
    showSearch = true;
    searchBox.style.height = '50px';
    showSearchBtn.querySelector('i').classList.add('active')
  } else if (showSearch) {
    showSearch = false;
    searchBox.style.height = '0';
    showSearchBtn.querySelector('i').classList.remove('active')
  }
});