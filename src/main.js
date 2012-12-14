var NUM_SIDE_PANELS = 5, ROWS = 20, COLS = 10;
var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40, SPACE = 32;

var piece, board, main_panel, side_panels, score_label, lines_label;

var gameover = true, botplaying = false, score = 0, lines = 0, update_period = 1000;

var ave_score = 0, ave_lines = 0, play_count = 0;

window.onload = function() {
	score_label = document.getElementById("score");
	lines_label = document.getElementById("lines");

	side_panels = new Array(NUM_SIDE_PANELS);
	for (var i = 0; i < NUM_SIDE_PANELS; i++) {
		side_panels[i] = new Panel("side_panel"+i, 4, 4, 6, true);
	}
	
	main_panel = new Panel("main_panel", ROWS, COLS, 4, false);
	board = new Board();	
	nexts = new Array(NUM_SIDE_PANELS);
	
	init_watcher();
	
	// botbtn();
	
	setTimeout(update, update_period);
};

function botbtn() {
	document.getElementById("botbtn").blur();
	
	board.clear();
	
	for (var i = 0; i < NUM_SIDE_PANELS; i++) {
		nexts[i] = new Piece(Math.floor(Math.random()*7));
	}
	
	piece = new Piece(Math.floor(Math.random()*7));

	for (var i = 0; i < side_panels.length; i++) {
		side_panels[i].redraw(null, nexts[i]);
	}
	main_panel.redraw(board, piece);
	
	score = 0;
	lines = 0;
	botplaying = true;
	gameover = false;
	update_period = 0;
}

function playbtn() {
	document.getElementById("playbtn").blur();
	
	board.clear();
	
	for (var i = 0; i < NUM_SIDE_PANELS; i++) {
		nexts[i] = new Piece(Math.floor(Math.random()*7));
	}
	
	piece = new Piece(Math.floor(Math.random()*7));

	for (var i = 0; i < side_panels.length; i++) {
		side_panels[i].redraw(null, nexts[i]);
	}
	main_panel.redraw(board, piece);
	
	score = 0;
	lines = 0;
	botplaying = false;
	gameover = false;
	update_period = 200;
}

function updateUI() {
	for (var i = 0; i < side_panels.length; i++) {
		side_panels[i].redraw(null, nexts[i]);
	}
	main_panel.redraw(board, piece);
	
	score_label.innerHTML = ""+score;
	lines_label.innerHTML = ""+lines;
}

function place_and_set_new() {
	var old_board = board.clone();
	board.fix(piece);
	board.delete_rows();

	/*
	console.log(features[0](old_board, piece, board), 
				features[1](old_board, piece, board), 
				features[2](old_board, piece, board));
	*/
	
	watch(old_board, piece, board);
	
	piece = nexts[0];
	for (var i = 0; i < NUM_SIDE_PANELS-1; i++) {
		nexts[i] = nexts[i+1];
	}
	nexts[NUM_SIDE_PANELS-1] = new Piece(Math.floor(Math.random()*7));
	
	if (!board.fits(piece, 0, 0, 0)) {
		gameover = true;
	}
}

function update() {
	if (gameover) {	
		/*
		ave_score = ((ave_score*play_count) + score)/(play_count+1);
		ave_lines = ((ave_lines*play_count) + lines)/(play_count+1);
		console.log("current: ", score, lines);
		console.log("averages: ", ave_score, ave_lines);
		play_count++;
		botbtn();
		*/
		
		setTimeout(update, update_period);
		return;
	}
	
	if (botplaying) {
		var action = get_action(board, piece);
		
		piece.move(0, action.col_dif, action.orient_dif);
		
		if (!board.fits(piece, 0, 0, 0)) {
			gameover = true;
		} else {
			board.drop(piece);
			place_and_set_new();
		}
		
		updateUI();
	} else {
		if (!board.drop(piece, 1)) {
			place_and_set_new();
		}
		
		updateUI();
	}
	
	if (gameover) {
		//alert("gameover!");
	}
	
	setTimeout(update, update_period);
}

function keypressed(event) {
	if (gameover || botplaying) {
		return;
	}
	
	var key = event.which;
	
	if (key == SPACE) {
		board.drop(piece);
		place_and_set_new();
	} else if (key == LEFT) {
		if (board.fits(piece, 0, -1, 0)) {
			piece.move(0, -1, 0);
		}
	} else if (key == RIGHT) {
		if (board.fits(piece, 0, 1, 0)) {
			piece.move(0, 1, 0);
		}
	} else if (key == UP) {
		if (board.fits(piece, 0, 0, 1)) {
			piece.move(0, 0, 1);
		}
	} else if (key == DOWN) {
		if (board.fits(piece, 1, 0, 0)) {
			piece.move(1, 0, 0);
		}
	}
	
	updateUI();
	
	if (gameover) {
		alert("gameover!");
	}
}