const app = {}; 

// Create init function/call at the bottom of the page.
app.init = () => {
  console.log("this is the init function")
  //add event listeners in fuctions (maybe we will eventually put them all into one function)
  app.pageLoadEvent();
  app.userInputEvent();
}

// Cache existing html selectors we will need for appending

app.favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Oldboy", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity", "Beetlejuice", "The Social Network"];
app.gameContainer = document.querySelector('.game-window');
app.defaultMovieSelection = document.querySelector('.default-movie');
app.userMovieSelection = document.querySelector('.user-movie');
app.startButton = document.querySelector('.start-button')
app.form = document.querySelector('form');
app.userInput = document.querySelector('input');
app.overlay = document.querySelector('aside');

//later used to store the ratings for each movie


// EVENT LISTENERS

// Adds event listener to FIRST SUBMIT BUTTON when page first loads
app.pageLoadEvent = () => {
  let i = 0;
  app.startButton.addEventListener('click', function(){
    // this makes sure the default movie section resets after start button is pressed
    app.defaultMovieSelection.replaceChildren();
    app.userInput.value = '';
    app.ratings = [];

    if (i === 0) {
      // gets and stores the current default movie choice from our array
      const currentMovie = app.getDefaultMovieTitle(i);
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      i++;
    } else {
      const currentMovie = app.getDefaultMovieTitle(i);
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      i++;
    }
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

app.getDefaultMovieTitle = (i) => {
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
app.printMovieContent = (posterContent, buttonId, imdbRating) => {
  // console.log(buttonId);
  app.userMovieSelection.replaceChildren();
  //loops through the movieContentArray and prints the content to the page
  app.ratings.push([buttonId, imdbRating]);
  
  if (buttonId === "start-button") {
    for (let content of posterContent.array) {
      app.defaultMovieSelection.appendChild(content);
    }
    app.userMovieSelection.appendChild(posterContent.empty)
  } else {
    for (let content of posterContent.array) {
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

  // CREATING CONTAINER FOR PLACEHOLDER BOX WITH QUESTION MARK
  const placeholderContainer = document.createElement('div');
  placeholderContainer.classList.add('img-container', 'question-mark')
  placeholderContainer.textContent = '?';
  
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
  const movieContentArray = {
    array: [posterContainer, infoContainer],
    empty: placeholderContainer
  };
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
      app.overlay.classList.add('hide');
      app.userMovieSelection.replaceChildren();
      app.userInput.value = '';
      console.log('user went back');
      // this prevents array from having more than one user rating at a time if they change their minds
      bothMovieRatings.pop();
    } else if (button.id === 'confirm'){
      //here is where we would call the app.compareMovies() function, and pass it bothMovieRatings to compare them
      app.compareMovies(bothMovieRatings);
      app.resetGame();
    }
  })
}

app.compareMovies = (bothMovieRatings) => {
  const defaultMovieRating = parseFloat(bothMovieRatings[0][1]);
  const userMovieRating = parseFloat(bothMovieRatings[1][1]);

  if (defaultMovieRating < userMovieRating) {
    console.log('User wins');
    app.scoreMessage(defaultMovieRating, userMovieRating); 

  } else if (defaultMovieRating > userMovieRating) {
    console.log('We win'); 
    app.scoreMessage(defaultMovieRating, userMovieRating); 
    
  } else if (defaultMovieRating === userMovieRating) {
    console.log('Would you look at that');

  }
}
// these are global right now
  //work on trying to append them using less code and not creating these elements in global scope
  // maybe try a loop inside scoreMessage function 
  
const userScoreTextElement = document.createElement('p');
const defaultScoreTextElement = document.createElement('p');

app.scoreMessage = (defaultRating, userRating) => {
  //clears p
  userScoreTextElement.textContent = '';
  defaultScoreTextElement.textContent = '';
// user movie score elements
  userScoreTextElement.classList.add('score');
  userScoreTextElement.textContent = userRating;
//default movie score elements
  defaultScoreTextElement.classList.add('score');
  defaultScoreTextElement.textContent = defaultRating;
// appending both
  app.userMovieSelection.appendChild(userScoreTextElement);
  app.defaultMovieSelection.appendChild(defaultScoreTextElement);

}

app.resetGame = () => {
  app.overlay.replaceChildren();
  app.overlay.classList.add('hide');
  app.form.classList.add('hide');
  app.startButton.classList.remove('hide');
  app.startButton.textContent = 'Next round';
}

// TWO SCENARIOS
  // (1) USER WINS
    // Append text on top of userMovie poster
    // style css to give a celebratory visual cue
  // (2) DEFAULT WINS
    // Append text to the userMovie poster
    // style css to get a less celebratory visual cue
  // RAINCLOUD OR SUNSHINE STRETCH GOAL


app.init();

// target genre:
  // we want the user to be limited to choosing a film that is the same genre as the default movie. 

// error handling:
  // stop overlay buttons from appending when enter is clicked
  //how to respond to a movie that doesnt exist (spelling mistakes etc.)

