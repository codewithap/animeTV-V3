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
  let subepRange = document.querySelector('#subepRange');
  let dubepRange = document.querySelector('#dubepRange');
  let subEpis = document.querySelector(".subEpis");
  let dubEpis = document.querySelector(".dubEpis");
  let select = document.querySelector("#lang").value;
  if(select == "dub"){
    subEpis.style.display = "none";
    dubEpis.style.display = "grid";
    dubepRange.style.display = "block";
    subepRange.style.display = "none";
  } else if(select == "sub"){
    subEpis.style.display = "grid";
    dubEpis.style.display = "none";
    dubepRange.style.display = "none";
    subepRange.style.display = "block";
  }
} 

//  
function loading(x){
  if(x){
    loader.style.display = 'flex';
  } else if(!x) {
    loader.style.display = 'none';
  }
}
let searchBtn = document.querySelector(".searchBtn");
searchBox.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});
searchBtn.addEventListener("click", searchEp);

function subepRange(listNo) {
  let btns = document.querySelectorAll('.subEpis .loadEPBtn');
  for (let i = 0; i < btns.length; i++) {
    btns[i].style.display = 'none';
  }
  for (let i = 100 * listNo; i < 100*(listNo + 1); i++) {
    btns[i].style.display = 'block';
  }
}
;
function dubepRange(listNo) {
  let btns = document.querySelectorAll('.dubEpis .loadEPBtn');
  for (let i = 0; i < btns.length; i++) {
    btns[i].style.display = 'none';
  }
  for (let i = 100 * listNo; i < 100 * (listNo + 1); i++) {
    btns[i].style.display = 'block';
  }
}


function handleBackButton() {
  topAiringDiv.innerHTML = "";
  getTopAnimes(1);
  let text = document.querySelector("body > header > main > section > h3");
  let btns = document.querySelector("body > header > main > section > div.btns");
  btns.style.display = "flex";
  text.style.display = "block";
  document.querySelector('.animeDetails').style.display = 'none';
}

function searchEp(){
  loading(true);
  let searchBox = document.querySelector(".search-box");
  let query = searchBox.value;
  let page = 1;
  let url = `https://anime-tv-v3-api.vercel.app/search?q=${query}&page=${page}`;
  fetch(url, { method: 'GET' }).then(response => {
    if (response.ok) { return response.json(); }
    throw new Error('Request failed!');
  }).then(jsonResponse => {
    let box = document.querySelector(".topAiring");
    let items = jsonResponse["items"];
    let searchHtml = "";
    document.querySelector("body > header > nav > div > button.showSearch").click();
    let text = document.querySelector("body > header > main > section > h3");
    let btns = document.querySelector("body > header > main > section > div.btns");
    btns.style.display = "none";
    text.style.display = "none";
    for (let i in items){
      let arr = jsonResponse["items"];
      let html = `
          <div class="card"><span onclick='animeInfo("${arr[i]['mal_id']}")'></span>
            <div class='dark'></div>
            <div class='bg' style='background: url("${arr[i]['img']}")' class='card-bg'></div>
            <img class='card-img' src="${arr[i]['img']}">
            <h4>${arr[i]['title']}</h4>
          </div>`;
          searchHtml += html;
        }
        box.innerHTML = searchHtml;
    
    loading(false);
  }).catch(error => { 
    console.error('Network error occurred:', error);
  });
  history.pushState(null, null, `/search?q=${query}`);
  window.addEventListener('popstate', handleBackButton);
}