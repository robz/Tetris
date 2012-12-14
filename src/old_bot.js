var weights = [-6.059, -1.235, 1.857, 3.765, 0, 0];
//[-3.78, -2.31, 1.6, 3.97, 6.52, .65];
var diffs = [[0,1],[0,-1],[1,0],[-1,0]];

var features = [
	// height
	function(old_board, piece, new_board) {
		var row = piece.first_row[piece.orient] + piece.row;
		return ROWS - row - new_board.rows_cleared_prev;
	},
	
	// holes
	function(old_board, piece, new_board) {
		var count = 0;
	
		for (var c = 0; c < 4; c++) {
			var col = c + piece.col;
			
			for (var r = 3; r >= 0; r--) {
				if (piece.struct[piece.orient][r][c] > 0) {
					for (var row = r + piece.row + 1; row < ROWS; row++) {
						if (old_board.cells[row][col] == 0) {
							count++;
						} else {
							break;
						}
					}
					break;
				}
			}
		}
		
		return count;
	},
	
	// lines cleared
	function(old_board, piece, new_board) {
		return new_board.rows_cleared_prev;
	},
	
	/*
	// exposed surface area
	function(old_board, piece, new_board) {
		var count = 0;
	
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (piece.struct[piece.orient][r][c] > 0) {
					for (var i = 0; i < diffs.length; i++) {
						var new_pr = r + diffs[i][0],
							new_pc = c + diffs[i][1];
						
						var in_bounds = new_pr >= 0 && new_pr < 4
										&& new_pc >= 0 && new_pr < 4;
						
						if (!in_bounds || (in_bounds && 
							piece.struct[piece.orient][new_pr][new_pc] == 0)) {
							
							var new_br = new_pr + piece.row,
								new_bc = new_pc + piece.col;
							
							if (new_br >= 0 && new_br < ROWS
								&& new_bc >= 0 && new_bc < COLS
								&& old_board.cells[new_br][new_bc] == 0) {
								count++;
							}
						}
					}
				}
			}
		}
		
		return count;
	},*/
	
	// contiguous blocks
	function(old_board, piece, new_board) {
		var count = 0;
	
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (piece.struct[piece.orient][r][c] > 0) {
					for (var i = 0; i < diffs.length; i++) {
						var new_row = r + piece.row + diffs[i][0],
							new_col = c + piece.col + diffs[i][1];
							
						if (new_row >= 0 && new_row < ROWS
							&& new_col >= 0 && new_col < COLS
							&& old_board.cells[new_row][new_col] > 0) {
							count++;
						}
					}
				}
			}
		}
		
		return count;
	},
	
	// touching walls
	function(old_board, piece, new_board) {
		var count = 0;
	
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (piece.struct[piece.orient][r][c] > 0) {
					if (c + piece.col + 1 >= COLS) {
						count++;
					} 
					if (c + piece.col - 1 < 0) {
						count++;
					}
				}
			}
		}
		
		return count;
	},
	
	// touching floor
	function(old_board, piece, new_board) {
		var count = 0;
	
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (piece.struct[piece.orient][r][c] > 0) {
					if (r + piece.row + 1 >= ROWS) {
						count++;
					}
				}
			}
		}
		
		return count;
	},
];

function get_action(board, piece) {
	// iterate over each orientation
	//   iterate over each position
	//     drop piece
	//     extract feature values from new board
	//	   create weight
	//     remember the action if it's been the best so far
	// return the best action
	
	var best_weight = -999999999,
		best_action = null;
	
	for (var orient = 0; orient < piece.num_orients; orient++) {
		var left_col = -piece.left_col[orient],
			right_col = COLS - piece.right_col[orient] - 1;
			
		for (var new_col = left_col; new_col <= right_col; new_col++) {
			var board_copy = board.clone();
			
			piece.reset();
			var col_dif = new_col - piece.col;
			piece.move(0, col_dif, orient);
			
			board_copy.drop(piece);
			board_copy.fix(piece);
			board_copy.delete_rows();
			
			var weight = 0;
			for (var i = 0; i < features.length; i++) {
				weight += weights[i]*features[i](board, piece, board_copy);
			}
			
			if (weight > best_weight) {
				best_weight = weight;
				best_action = create_action(orient, col_dif);
			}
		}
	}
	
	piece.reset();
	return best_action;
}

function create_action(orient_dif, col_dif) {
	return {
		orient_dif: orient_dif,
		col_dif: col_dif
	};
}