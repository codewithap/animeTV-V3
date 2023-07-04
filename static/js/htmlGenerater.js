let topAiringDiv = document.querySelector('.topAiring');
let next_page = document.querySelector(".next");
let prev_page = document.querySelector(".prev");

function getTopAnimes(p) {
  page = p;
  if (page == undefined) { page = Number(localStorage.getItem("topAnimeCurrentPage")) }
  localStorage.setItem("topAnimeCurrentPage", page)
  fetch('https://api.animetv.ml/topanime?type=bypopularity&page=' + String(page), { method: 'GET' })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    })
    .then(jsonResponse => {
      const arr = jsonResponse['items'];

      if (jsonResponse["pagination"]["next_page"]) {
        next_page.style.display = "block";
      }
      if (jsonResponse["pagination"]["prev_page"]) {
        prev_page.style.display = "block";
      }
      if (arr.length == 0) { getTopAnimes(page) }
      for (let i = 0; i < arr.length; i++) {
        let html = `
          <div class="card"><span onclick='animeInfo("${arr[i]['mal_id']}")'><strong style="width: ${5 + arr[i]["rank"].length}ch;height: ${4 + arr[i]["rank"].length}ch;">#${arr[i]["rank"]}</strong></span>
            <div class='dark'></div>
            <div class='bg' style='background: url("${arr[i]['img']}")' class='card-bg'></div>
            <img class='card-img' src="${arr[i]['img']}">
            <h4>${arr[i]['title']}</h4>
          </div>`;
        topAiringDiv.innerHTML += html;
      }
      next_page.disabled = false;
      prev_page.disabled = false;
    })
    .catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(getTopAnimes, 1000);
    });
}
getTopAnimes(1);

function nextTopAnimes() {
  next_page.disabled = true;
  prev_page.disabled = true;
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage")) + 1)
}

function prevTopAnimes() {
  next_page.disabled = true;
  prev_page.disabled = true;
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage")) - 1)
}

// show Anime Info
animeDetailsDiv = document.querySelector('.animeDetails');
function animeInfo(mal_id) {
  fetch('https://api.animetv.ml/anime/' + (mal_id), { method: 'GET' })
    .then(response => {
      if (response.ok) { return response.json(); }
      throw new Error('Request failed!');
    }).then(jsonResponse => {
      console.log(jsonResponse)
      animeDetailsDiv.style.height='calc(100% - 80px)';
      animeDetailsDiv.style.width='100%';
      let html = `<div style="background: url('${jsonResponse["img"]}')" class="animeDetailsBg"></div>
      <div class='animeDetailsInfo'><br>
      <img src='${jsonResponse["img"]}'>
      </div>`;
      animeDetailsDiv.innerHTML = html;
    }).catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(animeInfo(mal_id), 1000);
    });
}

