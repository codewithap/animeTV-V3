let topAiringDiv = document.querySelector('.topAiring');
let next_page = document.querySelector(".next");
let prev_page = document.querySelector(".prev");
let loader = document.querySelector('.loading');
loading(true)
function getTopAnimes(p) {
  page = p;
  if (page == undefined) { page = Number(localStorage.getItem("topAnimeCurrentPage")) }
  localStorage.setItem("topAnimeCurrentPage", page)
  fetch('https://anime-tv-v3-api.vercel.app/topanime?type=bypopularity&page=' + String(page), { method: 'GET' })
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
      } else if (!jsonResponse["pagination"]["next_page"]) {
        next_page.style.display = "none";
      }
      if (jsonResponse["pagination"]["prev_page"]) {
        prev_page.style.display = "block";
      } else if(!jsonResponse["pagination"]["prev_page"]){
        prev_page.style.display = "none";
      }
      if (arr.length == 0) { getTopAnimes(page)}
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
      loading(false)
    })
    .catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(getTopAnimes, 1000);
      loading(true)
    });
}
getTopAnimes(1);

function nextTopAnimes() {
  loading(true)
  next_page.disabled = true;
  prev_page.disabled = true;
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage")) + 1);
}
function prevTopAnimes() {
  loading(true)
  next_page.disabled = true;
  prev_page.disabled = true;
  topAiringDiv.innerHTML = "";
  getTopAnimes(Number(localStorage.getItem("topAnimeCurrentPage")) - 1);
}

// show Anime Info
let animeDetailsDiv = document.querySelector('.animeDetails');

function back() {
  let animeDetailsDiv = document.querySelector('.animeDetails');
  let iframe = document.querySelectorAll("iframe");
  iframe.forEach(i => {
    console.log(i);
    const source = i.src;
    i.src = '';
 });
   animeDetailsDiv.style.display = 'none';
   
}
function animeInfo(mal_id) {
  loading(true)
  let cards = document.querySelectorAll('card');
  fetch('https://anime-tv-v3-api.vercel.app/anime/' + (mal_id), { method: 'GET' }).then(response => {
      if (response.ok) { return response.json(); }
      throw new Error('Request failed!');
    }).then(jsonResponse => {
      animeDetailsDiv.style.height = 'calc(100% - 80px)';
      animeDetailsDiv.style.width = '100%';
      animeDetailsDiv.style.display = 'block';
      let linksHtml = '';
      for(let x in jsonResponse['external_links']){
        if (jsonResponse['external_links'][x]['data'] == '#') {}
        else{
        let y = `&nbsp;<a target='_blank' href='${jsonResponse['external_links'][x]['data']}'>${jsonResponse['external_links'][x]['name']}</a>&nbsp;&nbsp;&nbsp;`
        linksHtml += y;
        }
      }
      let html = `<div style="background: url('${jsonResponse["img"]}')" class="animeDetailsBg"></div>
        <div class='animeDetailsInfo'>
        <div class='pages'>
        <button onclick='animeInfoShowHide()' class="active">Info</button>
        <button onclick='showChars("${mal_id}")'>Characters</button>
        <button onclick='getEpisodes("${jsonResponse['title']}")'>Episodes</button>
        <button onclick='showSongs("${jsonResponse["theme_songs"]}")'>Theme Songs</button>
        </div><br><br>
        <div class='episodes'></div>
        <div class='songs'></div>
        <div class='charInfo'></div>
        <div class='animeInfo'>
          <img style='margin:auto;display:block' src='${jsonResponse["img"]}'>
          <div class='titles'>
          <h1>${jsonResponse['title']}</h1>
          <h2>${jsonResponse['info']['english']}</h2>
          </div>
            <div class='button'><button onclick='getEpisodes("${jsonResponse['title']}")'>Watch Now</button></div>
          <div class='info'>
          <p class='externalLinks'><strong>External Links:</strong> ${linksHtml}</p>
          <p><strong>Japanese:</strong> ${jsonResponse['info']['japanese']}</p>
          <p><strong>Popularity:</strong> ${jsonResponse['popularity']}</p>
          <p><strong>Rank: </strong>${jsonResponse['rank']}</p>
          <p><strong>Type: </strong> ${jsonResponse['info']['type']}</p>
          <p><strong>Episodes: </strong> ${jsonResponse['info']['episodes']}</p>
          <p><strong>Duration:</strong> ${jsonResponse['info']['duration']}</p>
          <p><strong>Status:</strong> ${jsonResponse['info']['status']}</p>
          <p><strong>Aired:</strong> ${jsonResponse['info']['aired']}</p>
          <p><strong>MAL Score: </strong> ${jsonResponse['score']}</p>
          <p><strong>Studios:</strong> ${jsonResponse['info']['studios']}</p>
          <p><strong>Overview:</strong> ${jsonResponse['description']}</p>
          </div>
        </div>
        </div>`;
      animeDetailsDiv.innerHTML = html;
      loading(false)
    }).catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(animeInfo(mal_id), 1000);
      loading(true)
    });
  history.pushState(null, null, `/anime/${mal_id}`);
  window.addEventListener('popstate', back);
}

function animeInfoShowHide(){
  let songsDiv = document.querySelector('.songs');
  let charInfoDiv = document.querySelector('.charInfo');
  let episodesDiv = document.querySelector('.episodes');
  let animeInfoDiv = document.querySelector('.animeInfo');
  let buttons = document.querySelectorAll('.pages button');
  songsDiv.style.display = 'none';
  charInfoDiv.style.display = 'none';
  episodesDiv.style.display = 'none';
  animeInfoDiv.style.display = 'block';
  buttons[0].classList.add('active');
  buttons[1].classList.remove('active');
  buttons[2].classList.remove('active');
  buttons[3].classList.remove('active');
}

function showSongs(songs){
  loading(true)
  let songsArr = songs.split(',');
  let songsDiv = document.querySelector('.songs');
  let charInfoDiv = document.querySelector('.charInfo');
  let episodesDiv = document.querySelector('.episodes');
  let animeInfoDiv = document.querySelector('.animeInfo');
  let buttons = document.querySelectorAll('.pages button');
  songsDiv.style.display = 'block';
  charInfoDiv.style.display = 'none';
  episodesDiv.style.display = 'none';
  animeInfoDiv.style.display = 'none';
  buttons[0].classList.remove('active');
  buttons[1].classList.remove('active');
  buttons[2].classList.remove('active');
  buttons[3].classList.add('active');
  
  let html = '';
  for(let song in songsArr){
    z = `<iframe style="border-radius:10px; margin:0;" src="https://open.spotify.com/embed/track/${songsArr[song]}" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    html += z;
    loading(false)
  }
  songsDiv.innerHTML = html;
}

function showChars(mal_id){
  loading(true);
  let songsDiv = document.querySelector('.songs');
  let charInfoDiv = document.querySelector('.charInfo');
  let episodesDiv = document.querySelector('.episodes');
  let animeInfoDiv = document.querySelector('.animeInfo');
  let buttons = document.querySelectorAll('.pages button');
  songsDiv.style.display = 'none';
  charInfoDiv.style.display = 'block';
  episodesDiv.style.display = 'none';
  animeInfoDiv.style.display = 'none';
  buttons[0].classList.remove('active');
  buttons[1].classList.add('active');
  buttons[2].classList.remove('active');
  buttons[3].classList.remove('active');
  if(sessionStorage.getItem(`${mal_id}Chars`) == null){
    fetch('https://anime-tv-v3-api.vercel.app/anime/' + (mal_id) +'/characters', { method: 'GET' }
    ).then(response => {
      if (response.ok) { return response.json();}
      throw new Error('Request failed!');
    }).then(jsonResponse => {
      if (jsonResponse['data'].length == 0){console.error('Network error!');showChars(mal_id);loading(true);}
      let charInfoHtml = '';
      for(let x in jsonResponse['data']){
        let data = jsonResponse['data'][x];
        let voice_actors_html = '';
        for (let i in data['voice_actors']) {
          let voice_actor = data['voice_actors'][i];
          let voice_actor_html = `
            <div class='voiceActor'>
              <img src=${voice_actor['img']}>
              <small>${voice_actor['lang']}</small>
              <strong>${voice_actor['name']}</strong>
            </div>
          `;
          voice_actors_html += voice_actor_html;
        }
        card = `
          <div class='charInfoCard'>
            <div class=CharInfo>
              <img src=${data['img']}>
              <small>${data['type']}</small>
              <strong>${data['name']}</strong>
            </div>
            <div class='voiceActors'>
              ${voice_actors_html}
            </div>
          </div>
        `;
        charInfoHtml += card;
      }
      html = `<br><br>
        ${charInfoHtml}
      `;
      charInfoDiv.innerHTML = html;
      loading(false);
    }).catch(error => {
      console.error('Network error occurred:', error);
      setTimeout(showChars(mal_id), 1000);
      loading(true);
    });
  }
}
function loading(x){
  if(x){
    loader.style.display = 'flex';
  } else if(!x) {
    loader.style.display = 'none';
  }
}

function getEpisodes(name){
  loading(true);
  let songsDiv = document.querySelector('.songs');
  let charInfoDiv = document.querySelector('.charInfo');
  let episodesDiv = document.querySelector('.episodes');
  let animeInfoDiv = document.querySelector('.animeInfo');
  let buttons = document.querySelectorAll('.pages button');
  songsDiv.style.display = 'none';
  charInfoDiv.style.display = 'none';
  episodesDiv.style.display = 'block';
  animeInfoDiv.style.display = 'none';
  buttons[0].classList.remove('active');
  buttons[1].classList.remove('active');
  buttons[2].classList.add('active');
  buttons[3].classList.remove('active');
  getEpisodesList(name);
} 
