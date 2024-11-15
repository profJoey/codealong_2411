# War Card Game

This project is a simple implementation of the card game "War" using the Deck of Cards API. It is designed to be a teaching tool for web development concepts, including HTML, CSS, and JavaScript.

## Project Structure

This file contains the basic structure of the web page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>War Card Game</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>War Card Game</h1>
    <div id="scoreboard">
        <div id="player1-score">Player 1: 0</div>
        <div id="player2-score">Player 2: 0</div>
    </div>
    <button id="draw-cards">Draw Cards</button>
    <div class="cards-container">
        <div id="player1-card" class="card"></div>
        <div id="player2-card" class="card"></div>
    </div>
    <div id="result"></div>
    <script src="script.js"></script>
</body>
</html>
```

## 1 - Set global variables

```javascript
let deckId;
let player1Score = 0;
let player2Score = 0;
```

## 2 - fetch a new deck from the API

```javascript
// Function to fetch a new deck from the API
async function fetchNewDeck() {
    const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    const response = await fetch(url); // Fetch the new deck
    const data = await response.json(); // Parse the JSON response
    return data.deck_id; // Return the deck ID
}
```

**Explaination**

- async function `fetchNewDeck()` Declares an asynchronous function named fetchNewDeck.
- The async keyword allows the use of await within the function, enabling asynchronous operations.

```javascript
    const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
```

- Defines a constant variable url that holds the API endpoint URL for fetching a new shuffled deck of cards.
- An API endpoint is a specific URL where your code sends requests to get or send data from a server.
- The deck_count=1 parameter specifies that one deck should be created.
- An API parameter is a piece of information you include in your request to an API endpoint to specify or customize the data you want to receive or send.

```javascript
    const data = await response.json(); // Parse the JSON response
```

- JSON (JavaScript Object Notation) is a lightweight, text-based format used to store and exchange data, structured as key-value pairs.
- The `json()` method converts the response from a server into a JavaScript object so your code can easily work with the data.

## 3. - Draw two cards from the deck

```javascript
// Function to draw two cards from the deck
async function drawTwoCards(deckId) {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
    const response = await fetch(url); // Fetch two cards from the deck
    const data = await response.json(); // Parse the JSON response
    return data.cards; // Return the array of cards
}
```

## 4. - Update DOM each time players draw cards

```javascript
// Function to update the DOM with card images and result
function updateDOM(player1Card, player2Card, result) {
    document.getElementById("player1-card").innerHTML = `<img src="${player1Card.image}" alt="${player1Card.value} of ${player1Card.suit}">`;
    document.getElementById("player2-card").innerHTML = `<img src="${player2Card.image}" alt="${player2Card.value} of ${player2Card.suit}">`;
    document.getElementById("result").textContent = result;
}
```

## 5. - Update Scoreboard with each round

```javascript
// Function to update the scoreboard
function updateScoreboard() {
    document.getElementById("player1-score").textContent = `Player 1: ${player1Score}`;
    document.getElementById("player2-score").textContent = `Player 2: ${player2Score}`;
}
```

## 6. Determine the Winnter

```javascript
// Function to determine the winner based on card values
function determineWinner(player1Card, player2Card) {
    const values = {
        "ACE": 14, "KING": 13, "QUEEN": 12, "JACK": 11,
        "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
    };
    const player1Value = values[player1Card.value];
    const player2Value = values[player2Card.value];

    if (player1Value > player2Value) {
        return "Player 1 Wins!";
    } else if (player1Value < player2Value) {
        return "Player 2 Wins!";
    } else {
        return "It's a Tie!";
    }
}
```

## 7. Draw Cards Event

```javascript
// Event handler for the "Draw Cards" button
async function onDrawCardsClick() {
    if (!deckId) {
        deckId = await fetchNewDeck(); // Fetch a new deck only once
    }

    const cards = await drawTwoCards(deckId); // Draw two cards from the deck

    if (cards.length < 2) {
        // No more cards left in the deck
        
        let winner;
        if (player1Score > player2Score) {
            winner = "Player 1";
        } else {
            winner = "Player 2";
        }

        document.getElementById("result").textContent = `${winner} wins the game!`;
        return;
    }

    const player1Card = cards[0]; // First card for Player 1
    const player2Card = cards[1]; // Second card for Player 2
    const result = determineWinner(player1Card, player2Card); // Determine the winner

    if (result === "Player 1 Wins!") {
        player1Score++;
    } else if (result === "Player 2 Wins!") {
        player2Score++;
    }

    updateDOM(player1Card, player2Card, result); // Update the DOM with the results
    updateScoreboard(); // Update the scoreboard
}

// Add event listener to the "Draw Cards" button
document.getElementById("draw-cards").addEventListener("click", onDrawCardsClick);
``` 