// TODO show card d
// TODO Create user hand function d
// TODO Create house hand d
// TODO Create user d
// TODO Create Values of cards and face cards d
// TODO Create function to get value of cards from api call json
// TODO Can I organize API calls better?

// USER INPUT
// TODO Create user input d
// TODO hit functionality d
// TODO stay functionality d
// TODO play again functionality ltr

// SELF PLAYING GAME
// TODO Create house
// TODO Create hit or stay 50/50 function
// TODO Create CLI input https://github.com/tj/commander.js d

// IMPROVEMENTS
// TODO Hide house cards
// TODO Auto and Manual select Ace value as 1 or 11
// TODO Make draw card function (How to I get values from async functions by calling them with out const someVar = await asyncFunc())
// TODO Create functions for everything possible

import fetch from "node-fetch";

import prompts from "prompts";

function someFunc(value) {
  return `${value}`;
}

function hitOrStay(input, userVal, houseVal, oneCard) {
  const hitCardValue = cardValue(oneCard.cards[0].value);

  console.log("Hit card: " + hitCardValue);
  if (input === "hit") {
    userVal = userVal + hitCardValue;
    if (userVal > 21) return "Bust.";
  }

  if (houseVal > userVal) {
    return "House wins! Input was " + input;
  } else if (houseVal < userVal) {
    return "User wins! Input was " + input;
  } else {
    return "No winner. Value was " + input;
  }
}

function cardValue(cardValue) {
  const faceValues = [
    { face: "KING", value: 10 },
    { face: "QUEEN", value: 10 },
    { face: "JACK", value: 10 },
    { face: "ACE", value: 11 },
  ];
  if (faceValues.some((vals) => vals.face === cardValue))
    return faceValues.filter((vals) => vals.face === cardValue)[0].value;

  return Number(cardValue);
}
//user funciton
function userHand(card) {
  return cardValue(card.value);
}

//house function
function houseHand(card) {
  return cardValue(card.value);
}

async function getDeck() {
  //API CALLS
  const data = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const json = await data.json();
  const deckId = json.deck_id;

  const draw4 = 4;
  const draw4Cards = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${draw4}`
  );
  const draw4CardsJson = await draw4Cards.json();

  const userDraw2Cards = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  const userDraw2CardsJson = await userDraw2Cards.json();

  const houseDraw2Cards = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  const houseDraw2CardsJson = await houseDraw2Cards.json();

  const drawOneCard = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );
  const drawOneCardJson = await drawOneCard.json();

  let userHandValue = 0;
  console.log("User Cards");
  userDraw2CardsJson.cards.map((card) => {
    console.log(userHand(card));
    userHandValue = userHand(card) + userHandValue;
  });
  console.log(userHandValue);

  // LOGIC
  let houseHandValue = 0;
  console.log("House Cards ");
  houseDraw2CardsJson.cards.map((card) => {
    console.log(houseHand(card));
    houseHandValue = houseHand(card) + houseHandValue;
  });
  console.log(houseHandValue);

  // USER INPUT

  (async () => {
    const response = await prompts({
      type: "text",
      name: "value",
      message: "Enter hit? Or stay?",
    });

    const termInput = hitOrStay(
      response.value,
      userHandValue,
      houseHandValue,
      drawOneCardJson
    );
    console.log(termInput);
  })();
}

getDeck();
