let topAiringDiv = document.querySelector('.topAiring');
let next_page = document.querySelector(".next");
let prev_page = document.querySelector(".prev");
function getTopAnimes(p) {
  next_page.disabled=true;
  prev_page.disabled=true;
  page = p;
  if(page == undefined){page = Number(localStorage.getItem("topAnimeCurrentPage"))}
  localStorage.setItem("topAnimeCurrentPage",page)
  fetch('https://api.animetv.ml/topanime?type=bypopularity&page='+String(page), { method: 'GET' })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    })
    .then(jsonResponse => {
      const arr = jsonResponse['items'];
      console.log(jsonResponse)
      if (jsonResponse["pagination"]["next_page"]) {
        next_page.style.display = "block";
      } if (jsonResponse["pagination"]["prev_page"]) {
        prev_page.style.display = "block";
      }
      if (arr.length == 0){getTopAnimes(page)}
      for (let i = 0; i < arr.length; i++) {
        let html = `
          <div class="card"><span><strong style="width: ${5 + arr[i]["rank"].length}ch;height: ${4 + arr[i]["rank"].length}ch;">#${arr[i]["rank"]}</strong></span>
            <div class='dark'></div>
            <div class='bg' style='background: url("${arr[i]['img']}")' class='card-bg'></div>
            <img class='card-img' src="${arr[i]['img']}">
            <h4>${arr[i]['title']}</h4>
          </div>`;
        topAiringDiv.innerHTML += html;
      }
      next_page.disabled=false;
      prev_page.disabled=false;
    })
    .catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(getTopAnimes, 1000);
    });
}            
getTopAnimes(1);

function nextTopAnimes(){
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage"))+1)
}
function prevTopAnimes(){
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage"))-1)
}