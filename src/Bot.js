var weights = [.2, -10, -1, -10];

var features = [
	// contiguous blocks
	function(board) {
		var count = 0;
		
		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS-1; c++) {
				if (board.cells[r][c] > 0 && board.cells[r][c+1] > 0) {
					count++;
				}
			}
		}
		
		for (var c = 0; c < COLS; c++) {
			for (var r = 0; r < ROWS-1; r++) {
				if (board.cells[r][c] > 0 && board.cells[r+1][c] > 0) {
					count++;
				}
			}
		}
		
		return count;
	},
	
	// holes
	function(board) {
		var count = 0;
	
		for (var c = 0; c < COLS; c++) {
			var flag = false;
			
			for (var r = 0; r < ROWS; r++) {
				if (board.cells[r][c] > 0) {
					flag = true;
				}
				
				if (flag && board.cells[r][c] == 0) {
					count++;
				}
			}
		}
		
		return count;
	},

	// exposed surface area
	function(board) {
		var count = 0;
		var flag = true;
		
		for (var c = 0; c < COLS-1; c++) {
			for (var r = 0; r < ROWS; r++) {
				if (flag && board.cells[r][c] > 0) {
					count++;
					flag = false;
				} else if (!flag && board.cells[r][c] == 0) {
					flag = false;
				}
				
				if (board.cells[r][c] == 0 && board.cells[r][c+1] > 0) {
					count++;
				}
			}
		}
		
		for (var c = COLS-1; c >= 1; c--) {
			for (var r = 0; r < ROWS; r++) {
				if (board.cells[r][c] == 0 && board.cells[r][c-1] > 0) {
					count++;
				}
			}
		}
		
		return count;
	},
	
	// height peak
	function(board) {
		var smallest_row = ROWS;
		
		for (var c = 0; c < COLS; c++) {
			var r = 0;
			
			for (; r < ROWS; r++) {
				if (board.cells[r][c] > 0) {
					break;
				}
			}
			
			if (r < smallest_row) {
				smallest_row = r;
			}
		}
		
		return ROWS - smallest_row;
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
				weight += weights[i]*features[i](board_copy);
			}
			
			if (weight > best_weight) {
				best_weight = weight;
				best_action = create_action(orient, col_dif);
			}
		}
	}
	
	piece.reset();
	return best_action;
	//return create_action(0, COLS - piece.right_col[0] - 1 - piece.col);
}

function create_action(orient_dif, col_dif) {
	return {
		orient_dif: orient_dif,
		col_dif: col_dif
	};
}