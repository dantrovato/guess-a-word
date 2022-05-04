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
  this.message = document.querySelector("#message");
  this.body = document.querySelector("body");
  this.gameOn = true;

  this.makeWordDashes = () => {
    const spaces = document.querySelector("#spaces");
    spaces.style.display = "flex";
    spaces.style.display.justifyContent = "space-between";

    if (this.word === undefined) {
      this.message.textContent = "You're out of words";
      return;
    }

    for (let i = 0; i < this.word.length; i++) {
      let div = document.createElement("div");
      spaces.appendChild(div);
      this.styleDashes(div);
    }
  };

  this.styleDashes = (div) => {
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.borderBottom = "3px solid black";
    div.style.width = "30px";
    div.classList.add("space");
  }

  this.assignLettersToDashes = () => {
    if (this.word === undefined) {
      return;
    }
    for (let i = 0; i < this.word.length; i++) {
      for (let i = 0; i < this.word.length; i++) {
        const div = document.querySelectorAll(".space")[i];
        div.setAttribute("data-letter", this.word[i]);
      }
    }
  };

  this.revealLetter = () => {
    const divs = [...document.querySelectorAll(".space")];
    divs.forEach(div => {
      if (div.getAttribute("data-letter") === event.key) {
        div.style.fontSize = "30px";
        div.textContent = event.key.toUpperCase();
      }
    });
  };

  this.addLetterToWrongGuesses = (guesses) => {
    let div = document.createElement("div");
    div.style.fontSize = "30px";
    div.textContent = event.key.toUpperCase();
    let wrongGuesses = [...document.querySelectorAll("#guesses div")].
      map(div => div.textContent);
    if (!wrongGuesses.includes(event.key.toUpperCase())) {
      this.removeApple();
      this.checkIfLose();
      guesses.appendChild(div);
      this.styleDashes(div);
    }
  }

  this.removeApple = (function() {
    let guess_count = 1;
    return function() {
      const apples = document.querySelector("#apples");
      apples.classList.add(`guess_${guess_count}`);
      guess_count += 1;
    };
  })();

  this.updateCorrectGuesses = () => {
    const divs = [...document.querySelectorAll(".space")];
    divs.forEach(div => {
      if (div.getAttribute("data-letter") === event.key &&
        !this.lettersGuessed.includes(event.key)) {
        this.lettersGuessed.push(event.key);
      }
    });
  }

  this.checkIfWin = () => {
    const wordUniqueLetters = [... new Set(this.word.split(""))].sort().join("");
    const currentGuesses = [... new Set(this.lettersGuessed)].sort().join("")
    if (wordUniqueLetters === currentGuesses) {
      this.body.classList.add("win");
      const loseMessage = document.createTextNode("You win");
      this.message.appendChild(loseMessage);
      this.gameOn = false;
    }
  };

  this.checkIfLose = () => {
    this.allowedWrongGuesses -= 1;
    if (this.allowedWrongGuesses < 0) {
      this.body.classList.add("lose");
      const loseMessage = document.createTextNode("Sorry you're out of guesses");
      this.message.appendChild(loseMessage);
      this.gameOn = false;
    }
  };

  this.reset = () => {
    this.allowedWrongGuesses = 6;
    this.currentWrongGuesses = 0;
    this.lettersGuessed = [];

    this.body.classList.remove("win");
    this.body.classList.remove("lose");
    this.message.textContent = "";
    const allDashes = [...document.querySelectorAll(".space")].forEach(div => {
      div.remove();
    });

  };

  this.playAgain = () => {
    console.log(this.word);
    this.reset();
    this.makeWordDashes();
    this.assignLettersToDashes();
    const letters = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM".split('');
    const guesses = document.querySelector("#guesses");
    guesses.style.display = "flex";
    guesses.style.display.justifyContent = "space-between";

    document.addEventListener("keypress", event => {
      if (this.gameOn) {
        if (!letters.includes(event.key)) {
          return;
        }

        if (this.word.split('').includes(event.key)) {
          this.revealLetter();
          this.updateCorrectGuesses();
          this.checkIfWin();
        } else {
          this.addLetterToWrongGuesses(guesses);
        }
      }
    });
  }
}

function playGame() {
  const game = new Game();
  game.playAgain();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#replay").addEventListener("click", event => {
    event.preventDefault();
    this.gameOn = true;
    playGame();
  });

  playGame();

});
