// scrapping sub & dub episodes from gogoanime by animeName
function getEpisodesList(name){
    let dub = name + " dub";
    let subSearchUrl = `https://api.animetv.ml/search/gogoanime?q=${name}`;
    let dubSearchUrl = `https://api.animetv.ml/search/gogoanime?q=${dub}`;
    let episodesDiv = document.querySelector('.episodes');
    let episodesHtml =`
      <div class="video">
      
      </div>
      </div>
      <div class="epis">
      <div class="toogleSubDub">
    <select onchange="showHideSubDub()" name="selectSubDub">
      <option value="sub">Sub</option>
      <option value="dub">Dub</option>
    </select>
      </div>
        <div class="subEpis"></div>
        <div class="dubEpis"></div>
      </div>
    `;episodesDiv.innerHTML = episodesHtml;
    let subEpis = document.querySelector(".subEpis");
    let dubEpis = document.querySelector(".dubEpis");
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
                fetch("https://api.animetv.ml/episodes/gogoanime/"+gogoId, { method: 'GET' }).then(response => {
                    if (response.ok) { return response.json(); }
                    throw new Error('Request failed!');
                  }).then(jsonResponse => {
                    let eplist = jsonResponse["episodes"];
                    let poster = jsonResponse["thumbnail"];
                    for(let x in eplist){
                        let id = eplist[x];
                        button = `<button class="loadEPBtn" onclick="loadEp('${id}','${poster}')">${Number(x)+1}</button>`;
                        subEpis.innerHTML += button;
                    };
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
              fetch("https://api.animetv.ml/episodes/gogoanime/"+gogoId, { method: 'GET' }).then(response => {
                  if (response.ok) { return response.json(); }
                  throw new Error('Request failed!');
                }).then(jsonResponse => {
                  let eplist = jsonResponse["episodes"];
                  let poster = jsonResponse["thumbnail"];
                  for(let x in eplist){
                      let id = eplist[x];
                      button = `<button class="loadEPBtn" onclick="loadEp('${id}','${poster}')">${Number(x)+1}</button>`;
                      dubEpis.innerHTML += button;
                  };
                }).catch(error => {
                  console.error('Network error occurred:', error);
                  if(retries < 5){
                      setTimeout(getDubEpis(), 1000);
                      retries += 1;
                  };});
          };getDubEpis();
        }).catch(error => {
          console.error('Network error occurred:', error);
          if(retry < 5){
              setTimeout(getSub(), 1000);
              retry += 1;
          };});
};getDub();}

function loadEp(gogoid,poster){
  let video = document.querySelector(".video");
  video.style.height = `${video.offsetWidth/1.8}px`;
  console.log(video.offsetWidth)
  addEventListener('resize', () => {
    let w = video.offsetWidth;
    video.style.height = `${w/1.8}px`;
  });
  console.log(gogoid)
  fetch(`https://api.animetv.ml/episode/gogoanime/${gogoid}`,{ method: 'GET' }).then(response => {
    if (response.ok) { return response.json(); }
    throw new Error('Request failed!');
  }).then(jsonResponse => {
    iframeUrl = jsonResponse[0]["video"];
    fetch(`https://api.animetv.ml/streaminglink/vidstreaming?iframeUrl=${iframeUrl}`,{ method: 'GET' }).then(response => {
      if (response.ok) { return response.json(); }
        throw new Error('Request failed!');
      }).then(jsonResponse => {
        file1 = jsonResponse['source'][0]['file'];
        file2 = jsonResponse['source_bk'][0]['file'];
        
        let html = `<div data-shaka-player-container style="width: 100%; height:100%"
        data-shaka-player-cast-receiver-id="8D8C71A7">
      <!-- The data-shaka-player tag will make the UI library use this video element.
           If no video is provided, the UI will automatically make one inside the container div. -->
     <video autoplay poster="${poster}" data-shaka-player id="video" style="width:100%;height:100%" src="${file1}}"></video>
   </div>`;
        document.querySelector(".video").innerHTML = html;
        let manifestUri = file1
        async function init() {
          // When using the UI, the player is made automatically by the UI object.
          const video = document.getElementById('video');
          const ui = video['ui'];
          const controls = ui.getControls();
          const player = controls.getPlayer();
          window.player = player;
          window.ui = ui;
        
          // Listen for error events.
          player.addEventListener('error', onPlayerErrorEvent);
          controls.addEventListener('error', onUIErrorEvent);
        
          // Try to load a manifest.
          // This is an asynchronous process.
          try {
            await player.load(manifestUri);
            // This runs if the asynchronous load is successful.
            console.log('The video has now been loaded!');
          } catch (error) {
            onPlayerError(error);
          }
        }
        
        function onPlayerErrorEvent(errorEvent) {
          // Extract the shaka.util.Error object from the event.
          onPlayerError(event.detail);
        }
        
        function onPlayerError(error) {
          // Handle player error
          console.error('Error code', error.code, 'object', error);
        }
        
        function onUIErrorEvent(errorEvent) {
          // Extract the shaka.util.Error object from the event.
          onPlayerError(event.detail);
        }
        
        function initFailed(errorEvent) {
          // Handle the failure to load; errorEvent.detail.reasonCode has a
          // shaka.ui.FailReasonCode describing why.
          console.error('Unable to load the UI library!');
        }
        
        // Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
        document.addEventListener('shaka-ui-loaded', init);
        // Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
        // to load (e.g. due to lack of browser support).
        document.addEventListener('shaka-ui-load-failed', initFailed);
        console.log(file1)
        console.log(poster)
        console.log(file2)
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

function loadVideoPlayer(manifestUri){

}
