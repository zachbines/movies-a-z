//   Make namespace object
const app = {}; 
// Create init function/call at the bottom of the page.
app.init = () => {
  console.log("this is the init function")
  app.pageLoadEvent();
  app.userInputEvent();
}
// Cache existing html selectors we will need for appending
app.defaultMovieSelection = document.querySelector('.default-movie');
app.userMovieSelection = document.querySelector('.user-movie');
app.startButton = document.querySelector('.start-button')
app.form = document.querySelector('form');
app.userInput = document.querySelector('input');

// EVENT LISTENERS

// Adds event listener to FIRST SUBMIT BUTTON when page first loads
app.pageLoadEvent = () => {
  app.startButton.addEventListener('click', function(){
    console.log('boop');
    const currentMovie = app.getDefaultMovieTitle();
    // console.log(currentMovie);
    app.getMovieInfo(currentMovie); //calls the API using the currentMovie name from our array
    // hides button upon game initiation 
    this.classList.add('hide');
    app.form.classList.remove('hide');
  })
}

// Adds event listener to when SECOND SUBMIT BUTTON is pressed with USER MOVIE INPUT value
app.userInputEvent = () => {
  app.form.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const userChoice = app.userInput.value;
    // console.log()
    app.getMovieInfo(userChoice);
  })
}




// (1) NAMESPACE VARIABLES GLOBAL SCOPE
const url = new URL('http://www.omdbapi.com/');
const key = 'ba8abefc';
const favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Old Boy", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity"];

// THIS WILL BE THE FUNCTION THAT WILL PRINT THE INITIAL MOVIE POSTER (using the array of movie titles we've created)

// GET MOVIE TITLE
// THIS FUNCTION RETURNS FIRST MOVIE FROM ARRAY
app.getDefaultMovieTitle = () => {
  let i = 0;
  const currentMovieTitle = favMovies[i];
  return currentMovieTitle;
}

// (2) GET MOVIE INFO
app.getMovieInfo = (title) => {

  url.search = new URLSearchParams({
    apikey: key,
    t: title,
    type: 'movie'
  })

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((currentMovieObj) => {
      // console.log(jsonResult.Genre); 
      if (currentMovieObj.Genre === "Adult") {
        console.log('naughty naughty');
      }
      // } else if (currentMovieObj.Title === "Teen Wolf") {
      //   console.log(currentMovieObj);
      //   // call the print function
      //   app.printMovieInfo(currentMovieObj);
      // } else if (currentMovieObj.Title === app.userInput.value){

      // }
      switch (currentMovieObj.Title) {
        case app.userInput:
          app.printMovieInfo(currentMovieObj);
          console.log("user choice");
          break;
        case "Teen Wolf":
          app.printMovieInfo(currentMovieObj);
          console.log("our choice");
          break;
      }
    })
}

// THIS FUNCTION RETURNS RESULT FROM app.getMovieInfo and prints POSTER + TEXT elements into NEW POSTER and INFO CONTAINERS
app.printMovieInfo = (currentMovieObj) => {
  //destructuring for readability
  const { Title, Year, Plot, Poster, imdbRating } = currentMovieObj;

  const posterContainer = document.createElement('div');
  posterContainer.setAttribute('class', 'img-container')
  //creating image for poster content
  const poster = document.createElement('img');
  poster.src = Poster;
  poster.alt = Title;
  posterContainer.appendChild(poster);

  const infoContainer = document.createElement('div');
  infoContainer.setAttribute('class', 'info-container');
  infoContainer.innerHTML =  `<h3>${Title}<span>${Year}</span></h3><p>${Plot}</p>`;

  // prints poster/info to the default movie section
  app.defaultMovieSelection.appendChild(posterContainer);
  app.defaultMovieSelection.appendChild(infoContainer);
};

// must figure out how to print user movie to user movie section
// app.userMovieSelection.appendChild(posterContainer);
// app.userMovieSelection.appendChild(infoContainer);



// NEED TWO VARIABLES FOR IMDB RATINGS

//      on topbutton click:
// clear html to repopulate the section
//   fetch the movie poster via the imdbID# using the random number variable. 
// 	create img and div elements to store the image data within
//   append container div / img to section along with movie title and plot below
//     button is replaced by text input which placeholder text prompting the user to “name a BETTER movie.”  (They should write a movie title here….”)

// When user submits their movie choice:
// fetch the data from the api using the title parameter
//   create img and div elements to store the image data within
//     append container div / img to section along with movie title and plot below, along side the randomly generated movie poster to compare
//       text input disappears, is placed by button which says “are you sure ?”

// When “are you sure ?” Button is clicked
//   a prompt will appear telling them if their movie is BETTER or WORSE(subject to change) than the DEFAULT movie based on IMDB rating score along with the text stating which one is the WINNER. 
// 	the above will be decided via conditionals based on the imdb rating property from within the objects returned from the api
//   the winning poster will scale slightly bigger to give a visual cue as to which one is the winner
//     topbutton reappears to restart the game


app.init();