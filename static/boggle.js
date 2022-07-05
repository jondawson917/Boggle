class BoggleGame {
  /* start a new game at this DOM id */

  constructor(boardId, time = 30) {
    this.secs = time; // game time in seconds
    this.showTimer();

    this.score = 0;
    this.words = new Set();
    this.board = $(boardId + "#");

    // every 1000 msec, "tock"
    this.timer = setInterval(this.tock.bind(this), 1000);

    $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

  /* show word in list of words */

  showWord(word) {
    $(".words", this.board).append($(`<li>${word}</li>`));
  }

  /* show score in html */

  showScore() {
    $(".score", this.board).text(this.score);
  }

  /* show a status message */

  displayMessage(message, cls) {
    $(".message", this.board)
      .text(message)
      .removeClass()
      .addClass(`message ${cls}`);
  }

  /* handle submission of word: if unique and valid, score & show */

  async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.displayMessage(`Already found ${word}`, "error");
      return;
    }

    // check server for validity
    const resp = await axios.get("/verify-word", { params: { word: word }});
    if (resp.data.result == "not-word") {
      this.displayMessage(`${word} is not a valid English word`, "error");
    } else if (resp.data.result == "not-on-board") {
      this.displayMessage(`${word} is not a valid word on this board`, "error");
    } else {
      this.showWord(word);Tock
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.displayMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }

  /* Update timer in DOM */

  showTimer() {
    $(".timer", this.board).text(this.secs);
  }

  /* Tock: handle a second passing in game */

  async tock() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  /* end of game: score and update message. */

  async scoreGame() {
    $(".add-word", this.board).hide();
    const resp = await axios.post("/post-score", { score: this.score });
    if (resp.data.brokeRecord) {
      this.displayMessage(`New record: ${this.score}`, "ok");
    } else {
      this.displayMessage(`Final score: ${this.score}`, "ok");
    }
  }
}
