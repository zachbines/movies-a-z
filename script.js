const app = {}; 

app.init = () => {
  app.cachedSelectors();
  app.eventListeners();
  app.getDefaultMovieTitle();
}

// Cache existing html selectors we will need for appending
app.cachedSelectors = () => {
  app.favMovies = ["Teen Wolf", "Fateful Findings", "The Lighthouse", "Oldboy", "Furious 7", "Harold and Maude", "Sicario", "The Room", "Hot Fuzz", "The Big Lebowski", "No Country For Old Men", "Alien", "The Bourne Identity", "Beetlejuice", "The Social Network", "Willy Wonka", "Heat", "Dirty Dancing", "The Raid: Redemption", "Scott Pilgrim", "Kiki's Delivery Service", "When Harry Met Sally", "Spaceballs", "The Notebook", "Dumb and Dumber", "Ferris Bueller's Day Off", "Fast & Furious", "Face/Off", "Runaway Bride", "The Princess Bride", "Mad Max", "Green Lantern", "Spider Man 3", "Fast Five", "Commando", "Kindergarten Cop", "Twins", "Camp Rock", "The Addams Family", "Bee Movie", "The Fate of the Furious", "Batman", "Fast and Furious", "The Fast and the Furious", "Twisted Fate", "Pass-Thru", "Double Down", "I Am Here... Now", "Juno", "Twilight", "Fifty Shades of Grey", "Disaster Movie", "Silence of the Lambs", "Birdemic: Shock and Terror", "Gigli", "Cats", "Jack and Jill", "Uncut Gems", "Teen Wolf Too", "2 Fast 2 Furious", "The Fast and the Furious: Tokyo Drift", "Fast & Furious 6"];

  app.instructions = document.querySelector('.instructions')
  app.instructionsChildren = document.querySelector('.instructions p');
  app.hideInstructionsButton = document.querySelector('#hide-instructions');
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
  app.posterButton = document.querySelector('.buttonPoster');
  //created p's for the score cards
  app.userScoreCard = document.createElement('p');
  app.defaultScoreCard = document.createElement('p');
}

// event listeners
app.eventListeners = () => {

//event listener for hide instructions button
  app.hideInstructionsButton.addEventListener('click', function(){
    
    if (this.textContent === 'Hide ↑') {
      app.instructions.classList.add('hide');
      this.textContent = 'Unhide ↓';
    } else {
      this.textContent = 'Hide ↑'
      app.instructions.classList.remove('hide');
    }
  })

  // puts a random index number in the variable i
  let i = Math.floor(Math.random() * (app.favMovies.length - 1));
  let j = i;
  // ensures the startButton/playAgain button will be visible
  app.startButton.classList.remove('hide');
  app.startButton.addEventListener('click', function(){

    // these lines ensure the default movie section and the scores reset after the 'next round' button is clicked
    app.arrowContainer.replaceChildren();
    app.defaultMovieSelection.replaceChildren();
    app.messagePara.textContent = '';
    // clears the user input
    app.userInput.value = '';

    //will store the ratings for each movie/clear the array.
    app.ratings = [];

    //scrolls to the proper part of the page
    const mainTop = document.querySelector('#main').offsetTop;
    scroll({
      top: mainTop,
      behavior: "smooth"
    });
    
    const currentMovie = app.getDefaultMovieTitle(j);
    // the first time the game starts
    if (i === j) {
      // j gets and stores the current default movie choice from our array
      //calls the getMovieObject, passes it the currentMovie and the id of the startButton
      app.getMovieObject(currentMovie, this.id);
      setTimeout(() => {this.textContent = 'Next round';}, 301);
      j++;

    } else if (j === app.favMovies.length - 1) {
      // if it hits the end of the movie array, start the array over again
      app.getMovieObject(currentMovie, this.id);
      this.textContent = 'Click to Play again!'
      j = 0;
      
    } else {
      //for every other index
      setTimeout(() => {this.textContent = 'Next round';}, 301);
      app.userInput.placeholder = `OK how bout this one? ⤵`;
      app.getMovieObject(currentMovie, this.id);
      j++;
    }
    
    // hides button upon game initiation
    this.classList.add('fade-out');
    setTimeout(() => {
      this.classList.remove('fade-out');
      this.classList.add('hide');
    }, 301);

    //reveals the form
    setTimeout(() => {app.form.classList.remove('hide');}, 301);
  })

  // form submit event listener
  app.form.addEventListener('submit', function (event) {
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

    // ensures they dont append one after another
    app.overlay.replaceChildren();
    app.overlay.appendChild(goBackButton);
    app.overlay.appendChild(confirmButton);

  })
}

// event listener for confirm/go-back buttons
app.confirmMovie = (bothMovieRatings) => {
  // showing the buttons
  app.overlay.classList.remove('hide');
  // focussing on confirm for quick play
  app.overlay.childNodes[1].focus();
  app.form.classList.add('hide');

  app.overlay.addEventListener('click', function (event) {
    // storing the button clicked
    const button = event.target;

    if (button.id === 'go-back') {
      // this removes button duplicates from populating
      app.overlay.replaceChildren();
      //bringing back the form
      app.overlay.classList.add('hide');
      app.form.classList.remove('hide');
      app.userInput.value = '';
      console.log('user went back');
      // this prevents array from having more than one user rating at a time if they change their minds
      bothMovieRatings.pop();
    } else if (button.id === 'confirm') {
      //call app.compareMovies() function and pass it bothMovieRatings to compare them
      app.compareMovies(bothMovieRatings);
      app.resetGame();
    }
  })
}

//return movie title
//this funtion returns the movies from the array
app.getDefaultMovieTitle = (title) => {
  const currentMovieTitle = app.favMovies[title];
  return currentMovieTitle;
}

//get movie object API call
// these two parameters represent the title of the movie, and the id of which button triggered the API call: the form submit or the startButton
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
    //error handling the user input
    if (currentMovieObj.Genre === "Adult") {
      app.userInput.value = '';
      app.userInput.placeholder = "naughty naughty";
    } else if (
      Type === "movie" &&
      imdbRating !== "N/A" &&
      Poster !== "N/A" &&
      Plot !== "N/A") {

      const movieContent = app.makeMovieContent(currentMovieObj);
      //this is adding the image and info containers
      app.printMovieContent(movieContent, buttonId, currentMovieObj.imdbRating);

    } else {
      app.userInput.value = '';
      app.userInput.placeholder = "try somethin else, bub";
    }
  })
}

//this function appends the movie content to the page. 
//the parameters represent a new array returned from makeMovieContent(), and the id representing which button triggered this chain of events to ultimately land the movieContent in the right section.
app.printMovieContent = (posterContent, buttonId, imdbRating) => {
  //ensures the user
  app.userMovieSelection.replaceChildren();
  //loops through the movieContentArray and prints the content to the page
  app.ratings.push([buttonId, imdbRating]);
  
  if (buttonId === "start-button") {
    for (let content of posterContent.array) {
      // these settimouts are to make for smoother API load time.
      setTimeout(() => { app.defaultMovieSelection.appendChild(content); }, 200); 
    }
    // the question mark
    setTimeout(() => { app.userMovieSelection.appendChild(posterContent.empty); }, 1000);   
  } else {
    // the users movie choice 
    for (let content of posterContent.array) {
      setTimeout(() => { app.userMovieSelection.appendChild(content); }, 200); 
    } 

    app.confirmMovie(app.ratings);

  }
}

// THIS FUNCTION RETURNS RESULT FROM app.getMovieInfo and prints POSTER + TEXT elements into NEW POSTER and INFO CONTAINERS
app.makeMovieContent = (currentMovieObj) => {
  const { Title, Year, Plot, Poster } = currentMovieObj;

  // creating container for placeholder questionmark
  const questionMarkContainer = document.createElement('div');
  questionMarkContainer.classList.add('img-container', 'question-mark')
  questionMarkContainer.textContent = '?';
  
  //create and append poster container
  const posterContainer = document.createElement('div');
  posterContainer.setAttribute('class', 'img-container')
  
  //creating image for poster content
  const poster = document.createElement('img');
  poster.src = Poster;
  poster.alt = `Official movie poster for ${Title}`;
  posterContainer.appendChild(poster);
  
  //create and append text container
  const infoContainer = document.createElement('div');
  infoContainer.setAttribute('class', 'info-container');
  infoContainer.innerHTML = `<h3>${Title} (${Year})</h3><p>${Plot}</p>`;

  // storing all this generated info in an object and returning it to the print function
  const movieContentObject = {
    array: [posterContainer, infoContainer],
    empty: questionMarkContainer
  };
  return movieContentObject;
};
 
// this function creates the content for the movie scores/user message
app.scoreMessage = (defaultRating, userRating, message) => {
  
  app.messagePara.textContent = message.data;
  app.messagePara.classList.add('fade-in');
  //clears paragraph for new message
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
}

//selects possible user messages
app.createMessages = (i) => {
  const winMessage = ["You know your stuff!", "Nice One!", "How did you know?!"];
  const loseMessage = ["So bad it's good, perhaps?", "Not Quite!", "You have failed us."];
  return [winMessage[i], loseMessage[i]];
}

app.compareMovies = (bothMovieRatings) => {
  const defaultMovieRating = parseFloat(bothMovieRatings[0][1]).toFixed(1);
  const userMovieRating = parseFloat(bothMovieRatings[1][1]).toFixed(1);

  //creating the message to the user
  let i = Math.floor(Math.random() * 3);
  const messageContent = app.createMessages(i);
  const message = document.createTextNode("");

  //conditional for who wins
  if (defaultMovieRating < userMovieRating) {
    app.arrowContainer.innerHTML = `
    <i class="fas fa-greater-than win"></i>`;
    message.textContent = messageContent[0];
    
  } else if (defaultMovieRating > userMovieRating) { 
    app.arrowContainer.innerHTML = `
    <i class="fas fa-greater-than lose"></i>`;
    message.textContent = messageContent[1];

  } else if (defaultMovieRating === userMovieRating) {
    app.arrowContainer.innerHTML = '<i class="fas fa-equals win"></i>';
    message.textContent = 'Wouldja look at that!';
  }

  setTimeout(() => { app.scoreMessage(defaultMovieRating, userMovieRating, message); }, 2000);   

}

app.resetGame = () => {
  // empty and hide the confirm/go back section 
  app.overlay.replaceChildren();
  app.overlay.classList.add('hide');
  //hide the form
  app.form.classList.add('hide');
  // to make this button not clickable while scoring happens
  setTimeout(() => {
    app.startButton.classList.add('fade-in');
    app.startButton.classList.remove('hide');
    app.startButton.focus();
  }, 3000)
  app.messagePara.classList.remove('fade-in');
}

app.init();