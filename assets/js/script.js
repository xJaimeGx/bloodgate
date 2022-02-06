const feltView = document.getElementById("felt-view");
const formEl = document.getElementById("form-el");
const nameInput = document.getElementById("name-input");
const classSelect = document.getElementById("class-select");
const difficultyInput = document.getElementsByName("difficulty");
const profanityInput = document.getElementById("profanity-input");
const modal = document.querySelector(".modal");
const heroEl = document.querySelector(".hero");
const landingMsg = document.getElementById("landing-msg");
const heroHead = document.querySelector(".hero-head");
const heroBody = document.querySelector(".hero-body");
const heroFoot = document.querySelector(".hero-foot");
const footer = document.querySelector(".footer");

const enemyAvatar = document.getElementById("enemy-avatar");
const playerAvatar = document.getElementById("player-avatar");

// const enemyDeck = document.querySelector("#enemy-deck");
// const playerDeck = document.querySelector("#player-deck");

const enemyHand = document.getElementById("enemy-hand");
const playerHand = document.getElementById("player-hand");

const noMansLand = document.getElementById("no-mans-land");

const enemyField = document.getElementById("enemy-field");
const playerField = document.getElementById("player-field");

const playerCard1 = document.getElementById("player-card-1");
const playerCard2 = document.getElementById("player-card-2");
const playerCard3 = document.getElementById("player-card-3");
const playerCard4 = document.getElementById("player-card-4");

const enemyCard1 = document.getElementById("enemy-card-1");
const enemyCard2 = document.getElementById("enemy-card-2");
const enemyCard3 = document.getElementById("enemy-card-3");
const enemyCard4 = document.getElementById("enemy-card-4");

const endTurnBtn = document.getElementById("end-turn-btn");

const enemyHealth = document.getElementById("enemy-health");
const enemyPower = document.getElementById("enemy-power");
const playerHealth = document.getElementById("player-health");
const playerPower = document.getElementById("player-power");

$insetGoldGlow =
  "inset gold -15px -15px 10px, inset gold 15px -15px 10px, inset gold 15px 15px 10px, inset gold -15px 15px 10px";
$insetRedGlow =
  "inset red 15px 15px 10px, inset red 15px -15px 10px, inset red -15px -15px 10px, inset red -15px 15px 10px";

$redGlow =
  "red 15px 15px 10px, red 15px -15px 10px, red -15px -15px 10px, red -15px 15px 10px";
$blueGlow =
  "blue 15px 15px 10px, blue 15px -15px 10px, blue -15px -15px 10px, blue -15px 15px 10px";
$goldGlow =
  "gold -15px -15px 10px, gold 15px -15px 10px, gold 15px 15px 10px, gold -15px 15px 10px";

// TEST CARD OBJECTS
let angel = {
  name: "angel",
  cost: 1,
  atk: 1,
  def: 2,
};
let demon = {
  name: "demon",
  cost: 1,
  atk: 2,
  def: 1,
};
let knight = {
  name: "knight",
  cost: 2,
  atk: 2,
  def: 3,
};
let inferno = {
  name: "inferno",
  cost: 3,
  atk: 5,
  def: 0,
};
let warlock = {
  name: "warlock",
  cost: 6,
  atk: 7,
  def: 3,
};
let centurion = {
  name: "centurion",
  cost: 5,
  atk: 4,
  def: 6,
};
let dragon = {
  name: "dragon",
  cost: 8,
  atk: 10,
  def: 10,
};

let turnCounter = 0;

let starterDeck = [angel, demon, knight, inferno, angel, inferno, demon];

let enemyDeck = [angel, demon, knight, inferno, angel, inferno, demon];

let player = {
  name: "",
  class: "",
  power: 0,
  health: 30,
  deck: starterDeck,
  hand: []
};

let settings = {
  difficulty: 0,
  profanity: false,
};

let enemy = {
  name: "testBot",
  power: 0,
  health: 30,
  deck: enemyDeck,
  hand: []
};

let discardPile = [];

let thinkingInterval;

function hover(event) {
  event.target.style.transform = "scale(1.3)";
}

function unhover(event) {
  event.target.style.transform = "scale(1)";
}

function attackTargetHover(event) {
  event.target.style.boxShadow = $redGlow;
}
function attackTargetUnhover(event) {
  event.target.style.boxShadow = $goldGlow;
}

// Opponent Trash Talk Window
function notification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification", "is-warning");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  notification.appendChild(deleteBtn);
  notification.textContent = message;
  enemyAvatar.appendChild(notification);
  setTimeout(function () {
    enemyAvatar.removeChild(notification);
  }, 2000);
}

// {Player's} card floats with red shadow
// *We use this to show which cards are in play on player's turn
function cardReady(cardEl) {
  cardEl.style.transition = "all 1200ms";
  cardEl.style.transform = "translateY(-15px)";
  cardEl.style.boxShadow = $redGlow;
  cardEl.style.animation = "3s ease 1200ms infinite alternate bounce";
}

// {Enemy's} card is highlighted by a gold shadow
// *Use this to show which enemy card the player is targeting for attack
function targetCard(cardEl) {
  cardEl.style.transition = "all 300ms";
  cardEl.style.boxShadow = $goldGlow;
  cardEl.addEventListener("mouseenter", attackTargetHover);
  cardEl.addEventListener("mouseleave", attackTargetUnhover);
  cardEl.addEventListener("click", attackTarget);
}
function removeTarget(cardEl) {
  cardEl.style.boxShadow = "none";
  cardEl.removeEventListener("mouseenter", attackTargetHover);
  cardEl.removeEventListener("mouseleave", attackTargetUnhover);
  cardEl.removeEventListener("click", attackTarget);
}

function attackTarget(event) {
  const readyToAttack = document.querySelector(".ready-to-attack");
  for (let i = 0; i < playerField.children.length; i++) {
    playerField.children[i].removeEventListener("click", AtkMsg);
  }
  const target = event.currentTarget;

  // If the player attacks the enemy directly
  if (target.id === "enemy-avatar") {
    enemy.health -= readyToAttack.dataset.atk;
    enemyHealth.value = enemy.health;
  }
  // If the player attacks an enemy card
  else if (target.dataset.state === "in-play") {
    console.log(
      `Your ${readyToAttack.dataset.name} card attacked the enemy's ${target.dataset.name} card with ${readyToAttack.dataset.atk} atk!`
    );
    console.log(
      `The enemy's ${target.dataset.name} card had ${target.dataset.def} def.`
    );
    // Subtract the player card's atk score from the enemy card's def score
    target.dataset.def -= readyToAttack.dataset.atk;

    // If the enemy card survives the attack
    if (target.dataset.def > 0) {
      console.log(
        `The enemy's ${target.dataset.name} card now has ${target.dataset.def} def left`
      );
    }
    // If the enemy card loses the battle
    else {
      console.log(
        `The enemy's ${target.dataset.name} card did not survive the attack`
      );
      discardPile.push(target);
      target.remove();
    }
    console.log(`Your ${readyToAttack.dataset.name} card had ${readyToAttack.dataset.def} def points`);
    readyToAttack.dataset.def -= target.dataset.atk;
    if (readyToAttack.dataset.def > 0) {
      console.log(`Your ${readyToAttack.dataset.name} card now has ${readyToAttack.dataset.def} def points`);
    }
    else {
      console.log(`Your ${readyToAttack.dataset.name} card did not survive the battle.`)
      discardPile.push(readyToAttack);
      readyToAttack.remove();
    }

  }

  console.dir(target);

  target.style.animation = "wobble 1s";
  enemyAvatar.style.boxShadow = "none";
  enemyAvatar.removeEventListener("mouseenter", attackTargetHover);
  enemyAvatar.removeEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.removeEventListener("click", attackTarget);

  if (enemyField.children) {
    for (let i = 0; i < enemyField.children.length; i++) {
      removeTarget(enemyField.children[i]);
    }
  }

  readyToAttack.style.boxShadow = "none";
  readyToAttack.style.transform = "translateY(15px)";
  readyToAttack.dataset.state = "exhausted";
  readyToAttack.classList.add("card-inactive");
  readyToAttack.classList.remove("ready-to-attack");
  for (let i = 0; i < playerField.children.length; i++) {
    if (playerField.children[i].dataset.state === "on-guard") {
      cardReady(playerField.children[i]);
      playerField.children[i].addEventListener("click", AtkMsg);
    }
  }
}

function removeAtkMsg() {
  // debugger;
  const readyToAttack = document.querySelector(".ready-to-attack");
  readyToAttack.style.boxShadow = "none";
  readyToAttack.style.transform = "translateY(15px)";
  readyToAttack.classList.add("played-card");
  for (let i = 0; i < playerField.children.length; i++) {
    if (
      playerField.children[i].dataset.state !== "exhausted" &&
      playerField.children[i].dataset.state !== "in-play"
    ) {
      cardReady(playerField.children[i]);
      playerField.children[i].dataset.state = "on-guard";
      playerField.children[i].addEventListener("click", AtkMsg);
    }
  }
  readyToAttack.classList.remove("ready-to-attack");

  enemyAvatar.style.boxShadow = "none";
  enemyAvatar.removeEventListener("mouseenter", attackTargetHover);
  enemyAvatar.removeEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.removeEventListener("click", attackTarget);
  if (enemyField.children) {
    for (let i = 0; i < enemyField.children.length; i++) {
      removeTarget(enemyField.children[i]);
    }
  }
}

function AtkMsg() {
  // debugger;
  const attacker = this;
  if (attacker.dataset.state === "ready-to-attack") {
    removeAtkMsg();
    return;
  }
  /* For each card in the player's field, if it is not the attacker, set its animation to null, set its
  box shadow to none, and set its transform to translateY(15px). If the card is not exhausted or in
  play, set its state to on-guard. */
  for (let i = 0; i < playerField.children.length; i++) {
    if (playerField.children[i] !== attacker) {
      playerField.children[i].style.animation = null;
      playerField.children[i].style.boxShadow = "none";
      playerField.children[i].style.transform = "translateY(15px)";
      if (
        playerField.children[i].dataset.state !== "exhausted" &&
        playerField.children[i].dataset.state !== "in-play"
      ) {
        playerField.children[i].dataset.state = "on-guard";
      }
    }
  }
  attacker.style.animation = null;
  attacker.style.boxShadow = $blueGlow;
  attacker.classList.remove("played-card");
  attacker.classList.add("ready-to-attack");
  attacker.dataset.state = "ready-to-attack";
  console.log("What do you want to attack?");
  enemyAvatar.style.transition = "all 300ms";
  enemyAvatar.style.boxShadow = $goldGlow;
  enemyAvatar.addEventListener("mouseenter", attackTargetHover);
  enemyAvatar.addEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.addEventListener("click", attackTarget);
  if (enemyField.children) {
    for (let i = 0; i < enemyField.children.length; i++) {
      targetCard(enemyField.children[i]);
    }
  }
}

function startPlayerTurn() {
  // draws a card
  if (player.deck.length > 0) {
    const newCard = document.createElement("div");
    newCard.classList.add("player-card", "is-size-1");
    const cardImg = document.createElement("img");
    cardImg.src = "./assets/images/placeholder-card.png";
    cardImg.style.transform = "scale(1.2)";
    newCard.appendChild(cardImg);
    playerHand.appendChild(newCard);
    setCardProps(newCard, player.deck);
  }


  // Make cards in hand clickable to play
  for (let i = 0; i < playerHand.children.length; i++) {
    playerHand.children[i].addEventListener("click", playCard);
  }

  // Initiates cards for attack
  if (playerField.children) {
    for (let i = 0; i < playerField.children.length; i++) {
      cardReady(playerField.children[i]);
      playerField.children[i].dataset.state = "on-guard";
      playerField.children[i].addEventListener("click", AtkMsg);
    }
  }
  endTurnBtn.addEventListener("click", endPlayerTurn);
}

function endEnemyTurn() {
  turnCounter++;
  if (player.class === "mage") {
    player.power = turnCounter + 2;
  } else {
    player.power = turnCounter;
  }
  playerPower.max = player.power * 100;
  playerPower.value = player.power * 100;
  console.log(`You now have ${player.power} power.`);
  startPlayerTurn();
}

function enemyPlayCard() {
  setTimeout(function () {
    // Should select a card from the hand that has <= cost than power
    for (let i = 0; i < enemyHand.children.length; i++) {
      const card = enemyHand.children[i];
      if (card.dataset.cost <= enemy.power) {
        card.classList.add("played-enemy-card");
        card.dataset.state = "in-play";
        enemyField.appendChild(card);
        const placeholder = document.createElement("img");
        placeholder.src = "./assets/images/placeholder-card.png";
        placeholder.style.transform = "scale(1.2)";
        card.appendChild(placeholder);
        console.log(`${enemy.name} played ${card.dataset.name}`);
        enemy.power -= card.dataset.cost;
        enemyPower.value = enemy.power * 100;
        console.log(`${enemy.name} now has ${enemy.power} power`)
      }
    };
    endEnemyTurn();
  }, 3000);
}

function cardPop(card) {
  setTimeout(function() {
    card.style.transform = "translateY(5rem)";
    setTimeout(function() {
      card.style.transform = "translateY(0rem)";
    }, 200);
  }, 200);
};

function enemyThinking() {
  if (!thinkingInterval) {
    thinkingInterval = setInterval(function() {
      const randomIndex = Math.floor(Math.random() * enemyHand.children.length);
      cardPop(enemyHand.children[randomIndex]);
    }, 200);
  }
  // This needs to wait
  setTimeout(enemyPlayCard(), 2000);
  setTimeout(function() {
    clearInterval(thinkingInterval);
    thinkingInterval = null;
  }, 2000)
}

function enemyTurn() {
  enemy.power = turnCounter;
  enemyPower.max = enemy.power * 100;
  enemyPower.value = enemy.power * 100;
  // draws a card
  if (enemy.deck.length > 0) {
    const newCard = document.createElement("div");
    newCard.classList.add("enemy-card");
    enemyHand.appendChild(newCard);
    setCardProps(newCard, enemy.deck);
    enemy.hand.push(newCard);
  }
  console.log(`${enemy.name} has ${displayHand(enemy.hand)}`);
  enemyThinking();
}

function endPlayerTurn() {
  endTurnBtn.removeEventListener("click", endPlayerTurn);
  playerCard1.removeEventListener("click", playCard);
  playerCard2.removeEventListener("click", playCard);
  playerCard3.removeEventListener("click", playCard);
  playerCard4.removeEventListener("click", playCard);
  setTimeout(notification("That all you got?"), 1000);
  setTimeout(enemyTurn(), 2000);
}

function playCard(event) {
  const chosenCard = event.currentTarget;
  if (player.power >= chosenCard.dataset.cost) {
    player.power -= chosenCard.dataset.cost;
    playerPower.value = player.power * 100;
    console.log(`You have ${player.power} power left`);
    chosenCard.classList.remove("player-card");
    chosenCard.classList.add("played-card");
    chosenCard.setAttribute("data-state", "in-play");
    chosenCard.removeEventListener("click", playCard);
    playerField.appendChild(chosenCard);
  }
}

function drawCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const drawnCard = deck[randomIndex];
  deck.splice(randomIndex, 1);
  return drawnCard;
}

function setCardProps(cardEl, fromDeck) {
  cardEl.setAttribute("data-state", "in-hand");
  const cardProps = Object.entries(drawCard(fromDeck));
  for (let i = 0; i < cardProps.length; i++) {
    if (i === 0) {
      cardEl.setAttribute("data-name", cardProps[i][1]);
    } else if (i === 1) {
      cardEl.setAttribute("data-cost", cardProps[i][1]);
    } else if (i === 2) {
      cardEl.setAttribute("data-atk", cardProps[i][1]);
    } else {
      cardEl.setAttribute("data-def", cardProps[i][1]);
    }
  }
}

function displayHand(hand) {
  let output = "";
  for (let i = 0; i < hand.length; i++) {
    output += hand[i].dataset.name + " cost=" + hand[i].dataset.cost + ", ";
  }
  return output;
}

function displayFelt() {
  const card1 = document.getElementById("0");
  const card2 = document.getElementById("1");
  const card3 = document.getElementById("2");
  card1.classList.add("is-hidden");
  card2.classList.add("is-hidden");
  card3.classList.add("is-hidden");
  heroBody.style.width = "100%";
  heroBody.classList.add("p0");
  heroBody.style.flexDirection = "column";
  heroBody.style.justifyContent = "space-between";

  feltView.classList.remove("is-hidden");

  turnCounter++;
  player.power++;
  enemy.power++;

  playerHealth.value = player.health;
  playerPower.max = (player.power * 100);
  playerPower.value = (player.power * 100);

  playerCard1.addEventListener("click", playCard);
  setCardProps(playerCard1, player.deck);
  player.hand.push(playerCard1);

  playerCard2.addEventListener("click", playCard);
  setCardProps(playerCard2, player.deck);
  player.hand.push(playerCard2);

  playerCard3.addEventListener("click", playCard);
  setCardProps(playerCard3, player.deck);
  player.hand.push(playerCard3);

  playerCard4.addEventListener("click", playCard);
  setCardProps(playerCard4, player.deck);
  player.hand.push(playerCard4);

  console.log(`You have ${displayHand(player.hand)}`);

  setCardProps(enemyCard1, enemy.deck);
  enemy.hand.push(enemyCard1);
  setCardProps(enemyCard2, enemy.deck);
  enemy.hand.push(enemyCard2);
  setCardProps(enemyCard3, enemy.deck);
  enemy.hand.push(enemyCard3);

  enemyHealth.value = enemy.health;
  enemyPower.max = (enemy.power * 100);
  enemyPower.value = (enemy.power * 100);


  console.log(
    `You are battling ${enemy.name}`
  );
  endTurnBtn.addEventListener("click", endPlayerTurn);
}

function chooseCard(event) {
  const chosenCard = event.target;
  displayFelt();
}

function createCard(cardId) {
  const cardEl = document.createElement("img");
  cardEl.style.position = "relative";
  cardEl.src = "./assets/images/placeholder-card.png";
  cardEl.id = cardId;
  cardEl.style.borderRadius = "15px";
  cardEl.style.height = "auto";
  cardEl.style.width = "10rem";
  cardEl.addEventListener("mouseenter", hover);
  cardEl.addEventListener("mouseleave", unhover);
  return cardEl;
}

function displayChoice() {
  console.log(`Welcome ${player.name}!`)
  heroBody.style.width = "75%";
  heroBody.classList.add("is-align-self-center");
  for (let i = 0; i < 3; i++) {
    heroBody.appendChild(createCard(i));
    const card = document.getElementById(`${i}`);
    card.addEventListener("click", chooseCard);
    heroBody.style.justifyContent = "space-around";
  }
}

/**
 * It removes the is-active class from the modal and adds the is-hidden class to the landing message.
 * @param event - The event object that was triggered.
 */
function startGame(event) {
  event.preventDefault();
  player.name = nameInput.value.trim();
  player.class = classSelect.value;
  if (classSelect.value === "mage") {
    player.power = 2;
  }

  for (i = 0; i < difficultyInput.length; i++) {
    if (difficultyInput[i].checked) {
      settings.difficulty = difficultyInput[i].value;
    }
  }
  settings.profanity = profanityInput.checked;

  modal.classList.remove("is-active");
  // Prevents cancel from returning felt view
  heroEl.style.backgroundImage = "url(./assets/images/red-felt.jpeg)";
  landingMsg.classList.add("is-hidden");
  heroFoot.classList.add("is-hidden");
  footer.classList.add("is-hidden");
  displayChoice();
}

formEl.addEventListener("submit", startGame);

// BULMA CODE
/* When a user clicks on a button, an element with the `.modal` class is opened. */
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });

  /* For each element in the array returned by document.querySelectorAll('.notification .delete'), add a
  click event listener to the delete element that will remove the parent notification element from
  the DOM. */
  (document.querySelectorAll(".notification .delete") || []).forEach(
    ($delete) => {
      const $notification = $delete.parentNode;

      $delete.addEventListener("click", () => {
        $notification.parentNode.removeChild($notification);
      });
    }
  );
});
// END OF BULMA JS
