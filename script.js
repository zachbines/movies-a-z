

const url = new URL('http://www.omdbapi.com/');
url.search = new URLSearchParams({
  apikey: 'ba8abefc',
  t: 'seinfeld',
  type: 'movie',
})  
console.log(url);

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonResult) => {
    console.log('It worked!', jsonResult);
    displayPoster(jsonResult);
  })

url.search = new URLSearchParams({
  apikey: 'ba8abefc',
  t: 'godfather',
})
fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonResult) => {
    console.log('It worked!', jsonResult);
    displayPoster(jsonResult);
  })

function displayPoster(jsonResult) {
  const poster = document.createElement('img');
  const para = document.querySelector('p');
  poster.src = jsonResult.Poster;
  console.log(jsonResult.Poster);
  para.appendChild(poster);
}

