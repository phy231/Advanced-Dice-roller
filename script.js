const diceFaces = [
  "dice(1).svg",
  "dice(2).svg",
  "dice(3).svg",
  "dice(4).svg",
  "dice(5).svg",
  "dice(6).svg"
];
const diceSound = document.getElementById("diceSound");
const diceArea = document.querySelector(".dice-area");
const rollBtn = document.getElementById("rollBtn");
const numDiceInput = document.getElementById("numDice");
const diceColorInput = document.getElementById("diceColor");
const historyList = document.getElementById("historyList");
const totalRollsSpan = document.getElementById("totalRolls");
const lastTotalSpan = document.getElementById("lastTotal");
const avgRollSpan = document.getElementById("avgRoll");

let rollHistory = [];

function hexToFilter(hex) {
  return `drop-shadow(0 0 5px ${hex})`;
}

function createDice(num) {
  diceArea.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const diceDiv = document.createElement("div");
    diceDiv.classList.add("dice");

    const img = document.createElement("img");
    img.src = diceFaces[0];
    img.alt = "Dice face 1";
    img.style.filter = hexToFilter(diceColorInput.value);

    diceDiv.appendChild(img);
    diceArea.appendChild(diceDiv);
  }
}

function updateDiceColors() {
  diceArea.querySelectorAll("img").forEach(img => {
    img.style.filter = hexToFilter(diceColorInput.value);
  });
}

function rollDice() {
  rollBtn.disabled = true;
  const diceDivs = diceArea.querySelectorAll(".dice");
  const results = [];

  diceDivs.forEach(dice => dice.classList.add("rolling"));

  setTimeout(() => {
    diceDivs.forEach((diceDiv, idx) => {
      const roll = Math.floor(Math.random() * 6);
      results.push(roll + 1);

      const img = diceDiv.querySelector("img");
      img.src = diceFaces[roll];
      img.alt = `Dice face ${roll + 1}`;
      diceDiv.classList.remove("rolling");
    });

    const total = results.reduce((a, b) => a + b, 0);
    rollHistory.push({ results, total, timestamp: new Date() });

    updateHistory();
    updateStats();

    rollBtn.disabled = false;
  }, 700);
}

function updateHistory() {
  historyList.innerHTML = '';
  rollHistory.slice().reverse().forEach(roll => {
    const li = document.createElement("li");
    const time = roll.timestamp.toLocaleTimeString();
    li.textContent = `[${time}] ${roll.results.join(", ")} (Total: ${roll.total})`;
    historyList.appendChild(li);
  });
}

function updateStats() {
  totalRollsSpan.textContent = rollHistory.length;

  if (rollHistory.length === 0) {
    lastTotalSpan.textContent = '-';
    avgRollSpan.textContent = '-';
    return;
  }

  const last = rollHistory[rollHistory.length - 1];
  lastTotalSpan.textContent = last.total;

  const sum = rollHistory.reduce((acc, r) => acc + r.total, 0);
  avgRollSpan.textContent = (sum / rollHistory.length).toFixed(2);
}

// Events
rollBtn.addEventListener("click", rollDice);

numDiceInput.addEventListener("input", () => {
  let val = Math.max(1, Math.min(6, Number(numDiceInput.value)));
  numDiceInput.value = val;
  createDice(val);
  updateDiceColors();
});

diceColorInput.addEventListener("input", updateDiceColors);

// Init
createDice(Number(numDiceInput.value));
