const app = {}; 
app.favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Old Boy", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity"];

// Create init function/call at the bottom of the page.
app.init = () => {
  console.log("this is the init function")
  //add event listeners in fuctions (maybe we will eventually put them all into one function)
  app.pageLoadEvent();
  app.userInputEvent();
}

  // Cache existing html selectors we will need for appending

  app.gameContainer = document.querySelector('.game-window');
  app.defaultMovieSelection = document.querySelector('.default-movie');
  app.userMovieSelection = document.querySelector('.user-movie');
  app.startButton = document.querySelector('.start-button')
  app.form = document.querySelector('form');
  app.userInput = document.querySelector('input');
  app.overlay = document.querySelector('aside');

  //later used to store the ratings for each movie
  app.ratings = [];

// EVENT LISTENERS

// Adds event listener to FIRST SUBMIT BUTTON when page first loads
app.pageLoadEvent = () => {

  app.startButton.addEventListener('click', function(){

    // gets and stores the current default movie choice from our array
    const currentMovie = app.getDefaultMovieTitle();
    //calls the getMovieObject, passes it the currentMovie and the id of the startButton
    app.getMovieObject(currentMovie, this.id);

    // hides button upon game initiation 
    this.classList.add('hide');
    //reveals the form
    app.form.classList.remove('hide');
  })
}

// Adds event listener to when SECOND SUBMIT BUTTON is pressed with USER MOVIE INPUT value
app.userInputEvent = () => {
  app.form.addEventListener('submit', function(event) {
    event.preventDefault();
    // stores the users Movie choice
    const userChoice = app.userInput.value;
     //calls the getMovieObject, passes it the userChoice and the id of the form
    app.getMovieObject(userChoice, this.id);
    // add two new buttons for CONFIRM event listener
    // put buttons in <ASIDE>

    // THIS IS THE GO BACK BUTTON
    const goBackButton = document.createElement('button')
    goBackButton.textContent = 'Go Back';
    goBackButton.id = 'go-back';

    // THIS IS THE CONFIRM BUTTON
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.id = 'confirm';

    app.overlay.appendChild(goBackButton);
    app.overlay.appendChild(confirmButton);
    
  })
}

// THIS WILL BE THE FUNCTION THAT WILL PRINT THE INITIAL MOVIE POSTER (using the array of movie titles we've created)

// GET MOVIE TITLE
// THIS FUNCTION RETURNS FIRST MOVIE FROM ARRAY
app.getDefaultMovieTitle = () => {
  let i = 0;
  const currentMovieTitle = app.favMovies[i];
  return currentMovieTitle;
}

// (2) GET MOVIE INFO API Call
// these two parameters represent the title of the movie, and the id of which button triggered the API call
app.getMovieObject = (title, buttonId) => {
  const url = new URL('http://www.omdbapi.com/');
  const key = 'ba8abefc';
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
    // THIS IS ADDING THE IMAGE AND INFO CONTAINERS
    const movieContent = app.makeMovieContent(currentMovieObj);
    app.printMovieContent(movieContent, buttonId, currentMovieObj.imdbRating);
    console.log(currentMovieObj);
  })
}
//this function appends the movie content to the page. 
//the parameters represent a new array returned from makeMovieContent(), and the id representing which button triggered this chain of events to ultimately land the movieContent in the right section.
app.printMovieContent = (array, buttonId, imdbRating) => {
  // console.log(buttonId);
  app.userMovieSelection.replaceChildren();
  //loops through the movieContentArray and prints the content to the page
  app.ratings.push([buttonId, imdbRating]);
  
  if (buttonId === "start-button") {
    for (let content of array) {
      app.defaultMovieSelection.appendChild(content);
    }
  } else {
    for (let content of array) {
      app.userMovieSelection.appendChild(content);
    } 
    // this where we will call the confirm movie function (and pass it the app.ratings array),
    // event listener for confirm/go-back buttons
    app.confirmMovie(app.ratings);
    // inside that we will likely call a compareMovies function
    console.log(app.ratings);
  }
}


// THIS FUNCTION RETURNS RESULT FROM app.getMovieInfo and prints POSTER + TEXT elements into NEW POSTER and INFO CONTAINERS
app.makeMovieContent = (currentMovieObj) => {
  //destructuring for readability
  const { Title, Year, Plot, Poster } = currentMovieObj;
  
  // CREATE AND APPEND POSTER CONTAINER
  const posterContainer = document.createElement('div');
  posterContainer.setAttribute('class', 'img-container')
  
  //creating image for poster content
  const poster = document.createElement('img');
  poster.src = Poster;
  poster.alt = Title;
  posterContainer.appendChild(poster);
  
  // CREATE AND APPEND TEXT CONTAINER
  const infoContainer = document.createElement('div');
  infoContainer.setAttribute('class', 'info-container');
  infoContainer.innerHTML = `<h3>${Title}<span>(${Year})</span></h3><p>${Plot}</p>`;
  
  // storing all this generated info in an array, and returning it to the print function
  const movieContentArray = [posterContainer, infoContainer];
  return movieContentArray;
};
  
  
// event listener for confirm/go-back buttons
app.confirmMovie = (bothMovieRatings) => {
  // showing the buttons
  app.overlay.classList.remove('hide');

  app.overlay.addEventListener('click', function (event) {
    // console.log(event.target);
    const button = event.target;

    if (button.id === 'go-back') {
      // this removes button duplicates from populating
      app.overlay.replaceChildren();
      app.userMovieSelection.replaceChildren();
      app.userInput.value = '';
      console.log('user went back');
      // this prevents array from having more than one user rating at a time if they change their minds
      bothMovieRatings.pop();
      app.overlay.classList.add('hide');
    } else if (button.id === 'confirm'){
      //here is where we would call the app.compareMovies() function, and pass it bothMovieRatings to compare them
      app.overlay.innerHTML = '';
      app.overlay.classList.add('hide');
      app.compareMovies(bothMovieRatings);
    }
  })
}

app.compareMovies = (bothMovieRatings) => {
  // console.log(bothMovieRatings);
  const defaultMovieRating = parseFloat(bothMovieRatings[0][1]);
  const userMovieRating = parseFloat(bothMovieRatings[1][1]);
  // console.log(defaultMovieRating);
  // console.log(userMovieRating);
  if (defaultMovieRating < userMovieRating) {
    console.log('User wins');
  } else if (defaultMovieRating > userMovieRating) {
    console.log('We win');
  } else if (defaultMovieRating === userMovieRating) {
    console.log('Would you look at that');
  }
}

// NEXT STEPS
// figure out how to reset UserMovieSection every round
// figure out how round 2 onward looks for user

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

