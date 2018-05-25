// Copied starter code from Udacity for the Memory Game Project

/*
 * Variables for card creation and deck manipulation
 */
let card           = document.getElementsByClassName("card"),
    cards          = [...card],
    closeButton    = document.querySelector("#close-button"),
    deck           = document.querySelector(".deck"),
    delay          = 1200,
    guesses        = 0,
    matches        = document.getElementsByClassName("match"),
    modal          = document.querySelector("#modal"),
    modalOverlay   = document.querySelector("#modal-overlay"),
    moves          = document.querySelector(".moves"),
    playButton     = document.querySelector("#play-button"),
    redoButton     = document.querySelector(".fa-redo"),
    selectedCards  = [],
    stars          = document.querySelectorAll(".fa-star"),
    startDeck      = [];
    
// variables for my game interval timer
let timeDisplay    = document.querySelector(".timer"),
    hours          = 0,
    minutes        = 0,
    seconds        = 0,
    totalDuration  = 0;

/*
 * function to display the cards after they have been shuffled
 * - cards array will store the results of the starting shuffle
 * - the for loop will append each shuffled card to the deck container
 */
 
let displayCards = () => {
    cards = shuffle(cards);
    for(let card of cards){
           startDeck.push(card);
    }
    
    for(let i = 0; i < startDeck.length; i++){
        deck.appendChild(startDeck[i]);
    }
    
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 

// function to add classes to dynamically toggle card classes while selecting
const manipulateCard = (evt) => {
    const selected = evt.target;
    if (selected.nodeName === 'LI') {
        selected.classList.toggle("open");
        selected.classList.toggle("show");
        selected.classList.toggle("lock");
    }
};

// saves selected cards to array and checks if they match or not
const selectCard = (evt) => {
    const selected = evt.target;
    selectedCards.push(selected);
    if (selectedCards.length === 2) {
        moveCounter();
        if (selectedCards[0].dataset.icon === selectedCards[1].dataset.icon) {
            match();
        } else {
            noMatch();
        }
    }
};

// if selected cards match this function toggle correct classes
const match = () => {
  for (let card of selectedCards) {
      card.classList.add("match", "lock");
      card.classList.remove("show", "open");
  }
  selectedCards = [];
};

// if selected cards do not match the show and open classes are removed
// and cards are unlocked
const noMatch = () => {
    cardLock();
    setTimeout(function() {
       for (let card of selectedCards) {
        card.classList.remove("show", "open");
    }
    cardUnlock();
    selectedCards = []; 
    }, delay);
};

// helper function to lock cards as needed
const cardLock = () => {
  for (let card of cards) {
      card.classList.add("lock");
  }  
};

// unlocks all cards except for those that match
const cardUnlock = () => {
    for (let card of cards) {
        card.classList.remove("lock");
        for(let match of matches) {
            match.classList.add("lock");
        }
    }
};

// function to track number of moves
let moveCounter = () => {
    guesses = guesses + 1;
    starRating(guesses);
    moves.innerHTML = guesses;
    
    if (guesses == 1) {
       gameDuration();
    }
};

let starRating = (gameMoves) => {
    const giggle = gameMoves;
    
    if (giggle >= 18 && giggle < 21) {
        stars[2].setAttribute("style", "visibility: collapse");
    }
    else if (giggle >= 22 && giggle < 33){
        stars[1].setAttribute("style", "visibility: collapse");
    } else {
        return;
    }
};

const gameDuration = () => {
    totalDuration = setInterval(() => {
        timeDisplay.innerHTML = `Time: ${hours}:${minutes}:${seconds}`;
        seconds++;
        if(seconds === 60) {
            minutes += 1;
            seconds = 0;
        }
        
        if(minutes === 60) {
            hours += 1;
            minutes = 0;
        }
        
    }, 1000);
};

/*
 * Following a tutorial by Chris Coyier at CSS-Tricks
 * "Considerations for Styling a Modal"
 *  https://css-tricks.com/considerations-styling-modal/
 *  And Alan Morel "How to Create a Modal with CSS and JavaScript"
 *  https://sabe.io/tutorials/how-to-create-modal-popup-box
 */
// Win Game Congratulations Modal
const omeDetto = () => {
  if (matches.length === 16){
      clearInterval(totalDuration);
      openModal();
      
      // display total moves
      let totalMoves = `You used a total of ${guesses} moves!`;
      let finalMoves = document.querySelector("#final-moves");
      finalMoves.innerHTML = totalMoves;
      
      // display final stars
      let totalStars = document.querySelector(".stars").innerHTML;
      let finalStars = document.querySelector("#final-stars");
      finalStars.innerHTML = `Your final star rating:  ${ totalStars}`;
      
      // display finish time
      let totalTime = document.querySelector(".timer").innerHTML;
      let timeDisplay = document.querySelector("#final-time");
      timeDisplay.innerHTML = `Your final${totalTime}`;
  }  
};

// function to close modal
let closeModal = () => {
    modal.classList.remove("show-modal");
    modalOverlay.classList.remove("show-modal");
};

// function to open modal
let openModal = () => {
    modal.classList.add("show-modal");
    modalOverlay.classList.add("show-modal");
};

// function to close model when window area of modal is clicked
let windowOnClick = (event) => {
    if (event.target === modal || event.target === modalOverlay) {
        closeModal();
    }
};

// function to start the game from fresh state
let start = () => {
    closeModal();
    guesses = 0;
    moves.innerHTML = guesses;
    for (let star of stars){
        star.setAttribute("style", "visibility: visible");
    }
    for(card of cards){
        card.classList.remove("show", "match", "lock", "open");
    }
    displayCards();
};

// add event listeners to modal control buttons
closeButton.addEventListener("click", closeModal);

window.addEventListener("click", windowOnClick);

playButton.addEventListener("click", function(evt){
    document.location.reload();
    start();
});

// add event listener to redo button
redoButton.addEventListener("click", function(){
    document.location.reload();
    start();
});
 
// function to add even listeners to all cards
for (let card of cards) {
    card.addEventListener("click", manipulateCard, true);
    card.addEventListener("click", selectCard);
    card.addEventListener("click", omeDetto);
}

// loads the game when window finishes loading script
 window.onload = start;