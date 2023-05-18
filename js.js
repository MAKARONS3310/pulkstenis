let timerInterval;
let minutes = 0;
let seconds = 0;
let clickCount = 0;
let memoryGameActive = false;
let flippedCards = [];
let matchedCards = [];

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];


function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  minutes = 0;
  seconds = 0;
  updateTimer();
}

function updateTimer() {
  seconds++;
  if (seconds >= 60) {
    minutes++;
    seconds = 0;
  }

  const formattedMinutes = padZero(minutes);
  const formattedSeconds = padZero(seconds);
  document.getElementById('timer').textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function updateClocks() {
  const newYorkTime = getFormattedTime(getCurrentTime('America/New_York'));
  document.getElementById('new-york').textContent = newYorkTime;
}

function getCurrentTime(timezone) {
  const now = new Date();
  const options = {
    timeZone: timezone,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return now.toLocaleTimeString([], options);
}

function getFormattedTime(time) {
  const [hours, minutes, seconds] = time.split(':');
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function incrementCounter() {
  clickCount++;
  document.getElementById('counter').textContent = clickCount;
}

function startMemoryGame() {
  if (!memoryGameActive) {
    memoryGameActive = true;
    matchedCards = [];
    createGameBoard();
  }
}

function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  const symbolsCopy = symbols.slice();
  const totalCards = symbols.length * 2;

  for (let i = 0; i < totalCards; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-symbol', '');
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  }

  const cards = document.getElementsByClassName('card');
  const randomSymbols = shuffleArray(symbolsCopy.concat(symbolsCopy));

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const symbol = randomSymbols[i];
    card.innerHTML = symbol;
    card.setAttribute('data-symbol', symbol);
  }
}

function flipCard() {
  const card = this;
  if (!card.classList.contains('flipped') && flippedCards.length < 2 && !matchedCards.includes(card)) {
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      checkMatching();
    }
  }
}

function checkMatching() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];
  const symbol1 = card1.getAttribute('data-symbol');
  const symbol2 = card2.getAttribute('data-symbol');

  if (symbol1 === symbol2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
    flippedCards = [];

    if (matchedCards.length === symbols.length * 2) {
      setTimeout(() => {
        alert('Congratulations! You have matched all the cards.');
        resetMemoryGame();
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 500);
  }
}

function resetMemoryGame() {
  memoryGameActive = false;
  matchedCards = [];
  flippedCards = [];
  createGameBoard();
}

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Update clocks every second
setInterval(updateClocks, 1000);
