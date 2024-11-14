let deckId;
let player1Score = 0;
let player2Score = 0;

// Function to fetch a new deck from the API
async function fetchNewDeck() {
    const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    const response = await fetch(url); // Fetch the new deck
    const data = await response.json(); // Parse the JSON response
    return data.deck_id; // Return the deck ID
}

// Function to draw two cards from the deck
async function drawTwoCards(deckId) {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
    const response = await fetch(url); // Fetch two cards from the deck
    const data = await response.json(); // Parse the JSON response
    return data.cards; // Return the array of cards
}

// Function to update the DOM with card images and result
function updateDOM(player1Card, player2Card, result) {
    document.getElementById("player1-card").innerHTML = `<img src="${player1Card.image}" alt="${player1Card.value} of ${player1Card.suit}">`;
    document.getElementById("player2-card").innerHTML = `<img src="${player2Card.image}" alt="${player2Card.value} of ${player2Card.suit}">`;
    document.getElementById("result").textContent = result;
}

// Function to update the scoreboard
function updateScoreboard() {
    document.getElementById("player1-score").textContent = `Player 1: ${player1Score}`;
    document.getElementById("player2-score").textContent = `Player 2: ${player2Score}`;
}

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