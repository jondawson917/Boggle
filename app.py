from flask import Flask, render_template, session, jsonify, request
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sesame123'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle()

@app.route('/')
def make_board():
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    round_num = session.get('rounds',0)
    
    return render_template('home.html', board=board, round=round_num, highscore=highscore)

@app.route('/words')
def handleWords():
    board = session['board']
    word = request.args['guess']
    result1 = Boggle().check_valid_word(board,word)
    return jsonify({'result': result1}) 

@app.route('/end-game', methods=["POST"])
def end_game():
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    round_num = session.get('rounds', 0)

    session['rounds'] = round_num +1
    session['highscore'] = max(score, highscore)
    
    return jsonify(aNewRecord=score > highscore)
