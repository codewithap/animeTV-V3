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


let css = `
  height: 400px;
  background-color: #00000033;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(45px, 65px));grid-template-columns: repeat(auto-fit, minmax(65px, 65px));
  padding: 10px;
  overflow: auto;
`;

function showHideSubDub(){
  let subEpis = document.querySelector(".subEpis");
  let dubEpis = document.querySelector(".dubEpis");
  let select = document.querySelector(".toogleSubDub select").value;
  if(select == "dub"){
    subEpis.style.display = "none";
    dubEpis.style.display = "grid";
  } else if(select == "sub"){
    subEpis.style.display = "grid";
    dubEpis.style.display = "none";
  }
}

