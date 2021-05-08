const app = {}; 

// Create init function/call at the bottom of the page.
app.init = () => {
  console.log("this is the init function")
  //add event listeners in fuctions (maybe we will eventually put them all into one function)
  app.cachedSelectors();
  app.pageLoadEvent();
  app.userInputEvent();
}

// Cache existing html selectors we will need for appending

app.cachedSelectors = () => {
  app.favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Oldboy", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity", "Beetlejuice", "The Social Network", "Willy Wonka and the Chocolate Factory", "Heat", "Dirty Dancing"];
  
  app.gameContainer = document.querySelector('.game-window');
  app.defaultMovieSelection = document.querySelector('.default-movie');
  app.userMovieSelection = document.querySelector('.user-movie');
  app.startButton = document.querySelector('.start-button')
  app.form = document.querySelector('form');
  app.userInput = document.querySelector('input');
  app.overlay = document.querySelector('aside');

  //created p's for the score cards
  app.userScoreCard = document.createElement('p');
  app.defaultScoreCard = document.createElement('p');
}

// EVENT LISTENERS

// Adds event listener to FIRST SUBMIT BUTTON when page first loads
app.pageLoadEvent = () => {
  // starts the favMovies array at 0
  let i = 0;

  app.startButton.addEventListener('click', function(){
    // these lines ensure the default movie section and the scores reset after the 'next round' button is clicked
    app.defaultMovieSelection.replaceChildren();
    setTimeout(() => { app.userInput.focus(); }, 1); // input wouldnt focus without this settimout around it
    app.userInput.value = '';

    //later used to store the ratings for each movie
    app.ratings = [];

    // the first time the game starts
    if (i === 0) {
      // gets and stores the current default movie choice from our array
      const currentMovie = app.getDefaultMovieTitle(i);
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      this.textContent = 'Next round';
      i++;
    } else if (i === 10 || i === 20 || i === 30) {
      this.textContent = 'Click to Play again!'
      const currentMovie = app.getDefaultMovieTitle(i);
      app.getMovieObject(currentMovie, this.id);
      i++
    } else if (i === app.favMovies.length - 1) {
      // start the array over again
      const currentMovie = app.getDefaultMovieTitle(i);
      app.getMovieObject(currentMovie, this.id);
      this.textContent = 'Click to Play again!'
      i = 0;
    } else {
      const currentMovie = app.getDefaultMovieTitle(i);
      this.textContent = 'Next round';
      app.userInput.placeholder = `OK how bout this one? ⤵`;
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

    app.overlay.replaceChildren();
    app.overlay.appendChild(goBackButton);
    app.overlay.appendChild(confirmButton);
    
  })
}

// GET MOVIE TITLE
// THIS FUNCTION RETURNS THE MOVIES FROM ARRAY
app.getDefaultMovieTitle = (title) => {
  const currentMovieTitle = app.favMovies[title];
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
    const { Type, imdbRating, Poster, Plot } = currentMovieObj;
    // console.log(jsonResult.Genre); 
    if (currentMovieObj.Genre === "Adult") {
      console.log('naughty naughty');
    } else if (
      Type === "movie" &&
      imdbRating !== "N/A" &&
      Poster !== "N/A" &&
      Plot !== "N/A") {
      const movieContent = app.makeMovieContent(currentMovieObj);
      // THIS IS ADDING THE IMAGE AND INFO CONTAINERS
      app.printMovieContent(movieContent, buttonId, currentMovieObj.imdbRating);
      console.log(currentMovieObj);
    } else {
      app.userInput.value = '';
      app.userInput.placeholder = "try somethin else, bub";
    }
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
    //set timout allows the questionmark to fade in after the default poster
    setTimeout(() => { app.userMovieSelection.appendChild(posterContent.empty); }, 1000);   
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
  const questionMarkContainer = document.createElement('div');
  questionMarkContainer.classList.add('img-container', 'question-mark')
  questionMarkContainer.textContent = '?';
  
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
  infoContainer.innerHTML = `<h3>${Title}</h3> <p>${Year}</p><p>${Plot}</p>`;
  
  // storing all this generated info in an array, and returning it to the print function
  const movieContentObject = {
    array: [posterContainer, infoContainer],
    empty: questionMarkContainer
  };
  return movieContentObject;
};
  
  
// event listener for confirm/go-back buttons
app.confirmMovie = (bothMovieRatings) => {
  // showing the buttons
  app.overlay.classList.remove('hide');
  app.overlay.childNodes[1].focus();
  app.form.classList.add('hide');
  console.log('outside of event listener');

  app.overlay.addEventListener('click', function (event) {
    // console.log(event.target);
    const button = event.target;
  
    if (button.id === 'go-back') {
      // this removes button duplicates from populating
      app.overlay.replaceChildren();
      app.overlay.classList.add('hide');
      app.form.classList.remove('hide');
      // app.userMovieSelection.replaceChildren();
      app.userInput.value = '';
      console.log('user went back');
      // this prevents array from having more than one user rating at a time if they change their minds
      bothMovieRatings.pop();
    } else if (button.id === 'confirm'){
      //here is where we would call the app.compareMovies() function, and pass it bothMovieRatings to compare them
      console.log('again');
      app.compareMovies(bothMovieRatings);
      app.resetGame();
    }
  })
}

app.compareMovies = (bothMovieRatings) => {
  const defaultMovieRating = parseFloat(bothMovieRatings[0][1]).toFixed(1);
  const userMovieRating = parseFloat(bothMovieRatings[1][1]).toFixed(1);

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

app.scoreMessage = (defaultRating, userRating) => {
  //clears p
  app.userScoreCard.textContent = '';
  app.defaultScoreCard.textContent = '';
// user movie score elements
  app.userScoreCard.classList.add('score');
  app.userScoreCard.textContent = userRating;
//default movie score elements
  app.defaultScoreCard.classList.add('score');
  app.defaultScoreCard.textContent = defaultRating;
// appending both
  app.userMovieSelection.appendChild(app.userScoreCard);
  app.defaultMovieSelection.appendChild(app.defaultScoreCard);
  console.log('scoreMessage function');
}

app.resetGame = () => {
  console.log('reset function');
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


// STILL LEFT TO DO FOR MVP:
  // STYLE/SIZE POSTER CONTAINER BOXES ACCORDINGLY
  // MAKE APP RESPONSIVE FOR MOBILE (MAYBE making it so that at a certain screen size, when the user clicks the movie, all the info about appears to save space on screen)
  // make the game restartable
  // 

