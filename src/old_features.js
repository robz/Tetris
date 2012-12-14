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