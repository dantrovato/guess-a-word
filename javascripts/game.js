const randomWord = (function () {
  const words = ["apple", "banana", "orange", "pear"];

  return function() {
    const index = Math.floor(Math.random() * words.length);
    return words.splice(index, 1)[0];
  }
})();

function Game() {
  this.word = randomWord();
  this.allowedWrongGuesses = 6;
  this.currentWrongGuesses = 0;
  this.lettersGuessed = [];

  const makeWordDashes = () => {
    const spaces = document.querySelector("#spaces");
    spaces.style.display = "flex";
    spaces.style.display.justifyContent = "space-between";

    for (let i = 0; i < this.word.length; i++) {
      let div = document.createElement("div");
      spaces.appendChild(div);
      styleDashes(div);
    }
  };

  function styleDashes(div) {
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.borderBottom = "3px solid black";
    div.style.width = "30px";
    div.classList.add("space");
  }

  const assignLettersToDashes = () => {
    for (let i = 0; i < this.word.length; i++) {
      for (let i = 0; i < this.word.length; i++) {
        const div = document.querySelectorAll(".space")[i];
        div.setAttribute("data-letter", this.word[i]);
      }
    }
  };

  const revealLetter = () => {
    const divs = [...document.querySelectorAll(".space")];
    divs.forEach(div => {
      if (div.getAttribute("data-letter") === event.key) {
        div.textContent = event.key.toUpperCase();
      }
    });
  };

  const addLetterToWrongGuesses = (guesses) => {
    let div = document.createElement("div");
    div.textContent = event.key.toUpperCase();
    let wrongGuesses = [...document.querySelectorAll("#guesses div")].
      map(div => div.textContent);
    if (!wrongGuesses.includes(event.key.toUpperCase())) {
      removeApple();
      checkIfLose();
      guesses.appendChild(div);
      styleDashes(div);
    }
  }

  const removeApple = (function() {
    let guess_count = 1;
    return function() {
      const apples = document.querySelector("#apples");
      apples.classList.add(`guess_${guess_count}`);
      guess_count += 1;
    };
  })();

  const updateCorrectGuesses = () => {
    const divs = [...document.querySelectorAll(".space")];
    divs.forEach(div => {
      if (div.getAttribute("data-letter") === event.key &&
        !this.lettersGuessed.includes(event.key)) {
        this.lettersGuessed.push(event.key);
      }
    });
  }

  const checkIfWin = () => {
    const wordUniqueLetters = [... new Set(this.word.split(""))].sort().join("");
    const currentGuesses = [... new Set(this.lettersGuessed)].sort().join("")
    if (wordUniqueLetters === currentGuesses) {
      document.querySelector("body").classList.add("win");
      const loseMessage = document.createTextNode("You win");
      document.querySelector("#message").appendChild(loseMessage);
    }
  };

  const checkIfLose = () => {
    this.allowedWrongGuesses -= 1;
    if (this.allowedWrongGuesses < 0) {
      document.querySelector("body").classList.add("lose");
      const loseMessage = document.createTextNode("Sorry you're out of guesses");
      document.querySelector("#message").appendChild(loseMessage);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#replay").addEventListener("click", event => {
      event.preventDefault();
      const game = new Game();
    });
    makeWordDashes();
    assignLettersToDashes();
    const letters = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM".split('');
    const guesses = document.querySelector("#guesses");
    guesses.style.display = "flex";
    guesses.style.display.justifyContent = "space-between";

    document.addEventListener("keypress", event => {
      if (!letters.includes(event.key)) {
        return;
      }

      if (this.word.split('').includes(event.key)) {
        revealLetter();
        updateCorrectGuesses();
        checkIfWin();
      } else {
        addLetterToWrongGuesses(guesses);
      }
    });
  });
}

const game1 = new Game();
