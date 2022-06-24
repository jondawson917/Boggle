BASE_URL = "http://127.0.0.1:5000";

// function startGame(){$('section').append($('<ul class="list-of-words"></ul>'));$('section').append($('<p class="message"></p>'));$('section').append($('<p class="timer"></p>'));$('section').prepend('<i class = "score"></i>');$("section").append(
//   $('<form action="#" type="submit" id="form1" method=["POST"]></form>')
// );

// $("form").append($('<button type="submit">Guess!</button>'));
// $("form").append(
//   $(
//     '<input type="text" name="guess" class="word">Enter Guess and submit</input>'
//   )
// );}

class Game {
  constructor(boardNum, time = 30) {
    this.id = $("Board #" + boardNum);
    this.sec = time;
    this.wordDict = new Set();
    this.score = 0;
    this.hiScore = 0;
    this.timer = setInterval(this.tock().bind(this), 1000);
    $("#form1", this.id).on("submit", this.guess.bind(this))
    ;

  }
  /*Show functions that add block elements to the board game */
  
  
 
  /*Functions that retrieve values and add them to their respective place */
  inputWord(word){
    $('.list-of-words', this.id).append($(`<li>${word}</li>`));
  }
  
  inputMsg(message, class1){
    $('.message', this.id).text(message).removeClass().addClass(`message ${class1}`);}
  inputScore(){
    $('.score', this.id).text(this.score);
  }
 inputTimer(){
  /*Display the current second in the timer class of <p> element */
  $('.timer', this.id).text(this.sec);
 }

  /*Asynchronous Timer function is run while game is running in browser */
  async tock() {
    this.sec -= 1;
    this.inputTimer();
    if (this.sec == 0) {
      clearInterval(this.timer);
      await this.wrapUp();
    }
  }
/*Function can be modified to prepend UL to different HTML elements */
  
  async guess(e) {
    debugger;
    e.preventDefault();
    const $guess = ($(".word"), this.id);
    const guess = $guess.val();
    if (!guess) {
      return;
    }
    if(this.wordDict.has(guess)){
      this.inputMsg(`Already found ${guess}, 'error'`);
      return
    }
    /*Display message to show guessed word*/

    const res = await axios.get(`/words`, {
      params: { word: guess },
    });
    console.log(res.data.result);
    if (res.data.result == "not-word") {
      this.inputMsg(`${guess} is not a valid Dictionary word`, 'error');
    } else if (res.data.result == "not-on-board") {
      this.inputMsg(`${guess} is  not a valid word on the board`, 'error');
    } else {
      this.inputWord(guess);
    this.score += guess.length;
    this.inputScore(); 
    this.wordDict.add(guess);
    this.inputMsg(`Added: ${guess}`, 'ok');}
    $guess.val('').focus();  
  }

  async wrapUp(){
$('input', this.id).css({'color':'white','transition-delay':'2s'});
const res = await axios.post('/end-game', {score: this.score});
if(res.data.aNewRecord){
  this.inputMsg(`The highest score: ${this.score}`, 'ok');
}
else {this.inputMsg(`Current round score is ${this.score}`, 'ok');}
  }
}
// startGame();


