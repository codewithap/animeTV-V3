// scrapping sub & dub episodes from gogoanime by animeName
function getEpisodesList(name){
    let dub = name + " dub";
    let subSearchUrl = `https://anime-tv-v3-api.vercel.app/search/gogoanime?q=${name}`;
    let dubSearchUrl = `https://anime-tv-v3-api.vercel.app/search/gogoanime?q=${dub}`;
    let episodesDiv = document.querySelector('.episodes');
    let episodesHtml =`
      <div class="video">
      
      </div>
      </div>
      <div class="epis">
      <div class="toogleSubDub">
    <select onchange="showHideSubDub()" name="selectSubDub" id='lang'>
      <option value="sub">Sub</option>
      <option value="dub">Dub</option>
    </select>
    <select name='subepRange' id='subepRange'>
    </select>
    <select name='dubepRange' id='dubepRange' style='display: none'>
        </select>
    <p class="CurrentEp">You Are watching <span></span></p>
      </div>
        <div class="subEpis"></div>
        <div class="dubEpis"></div>
      </div>
    `;episodesDiv.innerHTML = episodesHtml;
    let subEpis = document.querySelector(".subEpis");
    let dubEpis = document.querySelector(".dubEpis");
    let subepRange = document.querySelector('#subepRange');
    let dubepRange = document.querySelector('#dubepRange');
    // get sub epis
    function getSub(){
        let retries = 0;
        fetch(subSearchUrl, { method: 'GET' }).then(response => {
            if (response.ok) { return response.json(); }
            throw new Error('Request failed!');
          }).then(jsonResponse => {
            let gogoId = jsonResponse[0]["id"];
            console.log(gogoId)
            function getSubEpis(){
                let retry = 0;
                fetch("https://anime-tv-v3-api.vercel.app/episodes/gogoanime/"+gogoId, { method: 'GET' }).then(response => {
                    if (response.ok) { return response.json(); }
                    throw new Error('Request failed!');
                  }).then(jsonResponse => {
                    let eplist = jsonResponse["episodes"];
                    let poster = jsonResponse["thumbnail"];
                    let o = 0;
                    for(let x in eplist){
                        let id = eplist[x];
                        if(o < 100){
                        button = `<button class="loadEPBtn" style='display: block'  onclick="loadEp('${id}','${poster}')">${Number(x)+1}</button>`;
                        subEpis.innerHTML += button;}
                        else{
                          button = `<button class="loadEPBtn" style='display: none'  onclick="loadEp('${id}','${poster}')">${Number(x)+1}</button>`;
                          subEpis.innerHTML += button;
                        }
                        o = o + 1;
                    };
                    if(eplist.length > 100){
                      let btns = subEpis.querySelectorAll('.loadEPBtn');
                      for (let i = 0; i < Math.ceil(btns.length/100); i++) {
                        subepRange.innerHTML += `<option onclick="subepRange(${i})" value="${i}">${i + 1}</option>`;
                      }
                    }
                   
                  }).catch(error => {
                    console.error('Network error occurred:', error);
                    if(retry < 5){
                        setTimeout(getSubEpis(), 1000);
                        retry += 1;
                    };});
            };getSubEpis();
          }).catch(error => {
            console.error('Network error occurred:', error);
            if(retries < 5){
                setTimeout(getSub(), 1000);
                retries += 1;
            };});
    };getSub();

    // get dub epis
    function getDub(){
      let retry = 0;
      fetch(dubSearchUrl, { method: 'GET' }).then(response => {
          if (response.ok) { return response.json(); }
          throw new Error('Request failed!');
        }).then(jsonResponse => {
          let gogoId = jsonResponse[0]["id"];
          function getDubEpis(){
              let retries = 0;
              fetch("https://anime-tv-v3-api.vercel.app/episodes/gogoanime/"+gogoId, { method: 'GET' }).then(response => {
                  if (response.ok) { return response.json(); }
                  throw new Error('Request failed!');
                }).then(jsonResponse => {
                  let eplist = jsonResponse["episodes"];
                  let poster = jsonResponse["thumbnail"];
                  for(let x in eplist){
                      let id = eplist[x];
                      button = `<button class="loadEPBtn" style='display: none'  onclick="loadEp('${id}','${poster}')">${Number(x)+1}</button>`;
                      dubEpis.innerHTML += button;
                  };
                  document.querySelectorAll(".loadEPBtn")[0].click();
                if (eplist.length > 100) {
                  let btns = dubEpis.querySelectorAll('.loadEPBtn');
                  for (let i = 0; i < Math.ceil(btns.length / 100); i++) {
                    dubepRange.innerHTML += `<option onclick="dubepRange(${i})" value="${i}">${i + 1}</option>`;
                  }
                }
                  
                }).catch(error => {
                  console.error('Network error occurred:', error);
                  if(retries < 5){
                      setTimeout(getDubEpis(), 1000);
                      retries += 1;
                  };});loading(false);
          };getDubEpis();
        }).catch(error => {
          console.error('Network error occurred:', error);
          if(retry < 5){
              setTimeout(getSub(), 1000);
              retry += 1;
          };});
};getDub();
// loading(false)

}

function loadEp(gogoid,poster){loading(true);
	let CurrentEp =  document.querySelector(".CurrentEp span");
	CurrentEp.innerHTML = gogoid.replaceAll("-", " ");
  let video = document.querySelector(".video");
  video.style.height = `${video.offsetWidth/1.8}px`;
  console.log(video.offsetWidth)
  addEventListener('resize', () => {
    let w = video.offsetWidth;
    video.style.height = `${w/1.8}px`;
  });
  console.log(gogoid)
  fetch(`https://anime-tv-v3-api.vercel.app/episode/gogoanime/${gogoid}`,{ method: 'GET' }).then(response => {
    if (response.ok) { return response.json(); }
    throw new Error('Request failed!');
  }).then(jsonResponse => {
    iframeUrl = jsonResponse[0]["video"];
    fetch(`https://anime-tv-v3-api.vercel.app/streaminglink/vidstreaming?iframeUrl=${iframeUrl}`,{ method: 'GET' }).then(response => {
      if (response.ok) { return response.json(); }
        throw new Error('Request failed!');
      }).then(jsonResponse => {
        file1 = jsonResponse['source'][0]['file'];
        file2 = jsonResponse['source_bk'][0]['file'];
        video.innerHTML = `      
            <iframe  src="/play?m3u8=${file1}&m3u8_2=${file2}&poster=${poster}" frameborder="0" style="width: 100%;height: 100%"></iframe>
`;loading(false);

      }).catch(error => {
      console.error('Network error occurred:', error);
        setTimeout(getDubEpis(), 2000);
      }
    );
  }).catch(error => {
    console.error('Network error occurred:', error);
      setTimeout(getDubEpis(), 2000);
    }
  );
  
}

function loading(x){
  if(x){
    loader.style.display = 'flex';
  } else if(!x) {
    loader.style.display = 'none';
  }
}