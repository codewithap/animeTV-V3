{let topAiringDiv = document.querySelector('.topAiring');

fetch('https://api.animetv.ml/topanime?type=airing&page=1', 
{method: 'GET'}).then(response => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Request failed!');
}, networkError => {
  console.log(networkError.message);
}).then(jsonResponse => {
  arr = jsonResponse['items']
  for (var i = 0; i < arr.length; i++) {
    let html = `
    <div class="card" ><div class='dark'></div><div class='bg' style='background: url("${arr[i]['img']}")' class='card-bg'></div><img class='card-img' src="${arr[i]['img']}"><h4>${arr[i]['title']}</h4></div>`;
    topAiringDiv.innerHTML += html;
  }
})}