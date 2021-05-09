const app = {}; 

// Create init function/call at the bottom of the page.
app.init = () => {
  console.log("this is the init function")
  //add event listeners in fuctions (maybe we will eventually put them all into one function)
  app.cachedSelectors();
  app.pageLoadEvent();
  app.userInputEvent();
  app.getDefaultMovieTitle();
}

// Cache existing html selectors we will need for appending

app.cachedSelectors = () => {
  app.favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Oldboy", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity", "Beetlejuice", "The Social Network", "Willy Wonka", "Heat", "Dirty Dancing", "The Raid: Redemption", "Scott Pilgrim", "Kiki's Delivery Service"];
  
  app.gameContainer = document.querySelector('.game-window');
  app.defaultMovieSelection = document.querySelector('.default-movie');
  app.userMovieSelection = document.querySelector('.user-movie');
  app.startButton = document.querySelector('.start-button')
  app.form = document.querySelector('form');
  app.userInput = document.querySelector('input');
  app.overlay = document.querySelector('aside');
  app.userScore = document.querySelector('.user-score');
  app.defaultScore = document.querySelector('.default-score');
  app.messagePara = document.querySelector('.message');
  app.arrowContainer = document.querySelector('.arrow-container');
  //created p's for the score cards
  app.userScoreCard = document.createElement('p');
  app.defaultScoreCard = document.createElement('p');
}

// EVENT LISTENERS

// Adds event listener to FIRST SUBMIT BUTTON when page first loads
app.pageLoadEvent = () => {
  // puts a random index number in the variable i
  let i = Math.floor(Math.random()*app.favMovies.length);
  let j = i;

  app.startButton.addEventListener('click', function(){
    // these lines ensure the default movie section and the scores reset after the 'next round' button is clicked
    app.arrowContainer.replaceChildren();
    app.defaultMovieSelection.replaceChildren();
    app.messagePara.textContent = '';
    setTimeout(() => { app.userInput.focus(); }, 1); 
    // input wouldnt focus without this settimout around it
    app.userInput.value = '';

    //later used to store the ratings for each movie
    app.ratings = [];

    const currentMovie = app.getDefaultMovieTitle(j);

    // the first time the game starts
    if (i === j) {
      // gets and stores the current default movie choice from our array
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      setTimeout(() => {this.textContent = 'Next round';}, 301);
      j++;

    } else if (i === app.favMovies.length - 1) {
      // start the array over again
      app.getMovieObject(currentMovie, this.id);
      this.textContent = 'Click to Play again!'
      j = 0;
      
    } else {
      setTimeout(() => {this.textContent = 'Next round';}, 301);
      app.userInput.placeholder = `OK how bout this one? ⤵`;
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      j++;
    }
    // hides button upon game initiation
    this.classList.add('fade-out');
    setTimeout(() => {
      this.classList.add('hide');
      this.classList.remove('fade-out');
    }, 301);
    //reveals the form
    setTimeout(() => {app.form.classList.remove('hide');}, 301);

    //scrolls to the proper part of the page
    const mainTop = document.querySelector('#main').offsetTop;

    scroll({
      top: mainTop,
      behavior: "smooth"
    });

  })
}

// Adds event listener to when SECOND SUBMIT BUTTON is pressed with USER MOVIE INPUT value
app.userInputEvent = () => {

  app.form.addEventListener('submit', function(event) {
    // fade-in animation


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
  // const randomizer = Math.floor(Math.random()*app.favMovies.length)
  // iterates thru the array randomly
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
  const message = document.createTextNode("");
  console.log(message);

  if (defaultMovieRating < userMovieRating) {
    app.arrowContainer.innerHTML = `
    <i class="fas fa-greater-than win"></i>`;
    message.textContent = 'Nice One!';
    
  } else if (defaultMovieRating > userMovieRating) {
    console.log('We win'); 
    // app.scoreMessage(defaultMovieRating, userMovieRating); 
    app.arrowContainer.innerHTML = `
    <i class="fas fa-greater-than lose"></i>`;
    message.textContent = 'Not Quite!';

  } else if (defaultMovieRating === userMovieRating) {
    console.log('Would you look at that');
    app.arrowContainer.innerHTML = '<i class="fas fa-equals win"></i>';
    message.textContent = 'Wouldja look at that!';
  }
  setTimeout(() => {
    app.scoreMessage(defaultMovieRating, userMovieRating);
    app.messagePara.textContent = message.data;
  }, 1200);
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
    // Append text that says "YOU WIN"
  // (2) DEFAULT WINS
    // Append text to the userMovie poster
    // style css to get a less celebratory visual cue
    // Appen text that says "WE WIN"
  // RAINCLOUD OR SUNSHINE STRETCH GOAL


app.init();

// target genre:
  // we want the user to be limited to choosing a film that is the same genre as the default movie. 


// STILL LEFT TO DO FOR MVP:
  // STYLE/SIZE POSTER CONTAINER BOXES ACCORDINGLY
  // MAKE APP RESPONSIVE FOR MOBILE (MAYBE making it so that at a certain screen size, when the user clicks the movie, all the info about appears to save space on screen)
  // make the game restartable
  // 

