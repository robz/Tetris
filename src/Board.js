function Board(_cells) {
	this.cells = new Array(ROWS);
	
	if (_cells) {
		for (var r = 0; r < ROWS; r++) {
			this.cells[r] = new Array(COLS);
			for (var c = 0; c < COLS; c++) {
				this.cells[r][c] = _cells[r][c];
			}
		}
	} else {
		for (var r = 0; r < ROWS; r++) {
			this.cells[r] = new Array(COLS);
			for (var c = 0; c < COLS; c++) {
				this.cells[r][c] = 0;
			}
		}
	}
	
	this.fits = function(p, dr, dc, da) {
		if (!p.can_move(dr, dc, da)) {
			return false;
		}
	
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (p.struct[(p.orient + da)%p.num_orients][r][c] == 1) {
					if (r + p.row + dr >= 0
						&& this.cells[r + p.row + dr][c + p.col + dc] != 0) {
						return false;
					}
				}
			}
		}
		
		return true;
	}
	
	this.fix = function(p) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (p.struct[p.orient][r][c]) {
					if (r + p.row >= 0) {
						this.cells[r + p.row][c + p.col] = p.index+1;
					}
				}
			}
		}
	};
	
	this.drop = function(p, rows) {
		if (rows) {
			while (rows > 0 && this.fits(p, 1, 0, 0)) {
				p.move(1, 0, 0);
				rows--;
			}
		
			return rows == 0;
		} else {
			while (this.fits(p, 1, 0, 0)) {
				p.move(1, 0, 0);
			}
			
			return true;
		}
	};
	
	this.scored_prev = false;
	
	this.delete_rows = function() {
		var cleared_rows = 0;
		
		for (var r = ROWS-1; r >= 0; r--) {
			var is_full = true;
			
			for (var c = 0; c < COLS; c++) {
				is_full &= (this.cells[r][c] != 0);
				this.cells[r + cleared_rows][c] = this.cells[r][c];
			}
			
			if (is_full) {
				cleared_rows++;
			}
		}
		
		lines += cleared_rows;
		
		if (cleared_rows == 2) {
			score += 1;
		} else if (cleared_rows == 3) {
			score += 2;
		} else if (cleared_rows == 4) {
			score += 4;
		}
		
		if (cleared_rows > 0 && this.scored_prev) {
			score++;
		}
		
		this.scored_prev = (cleared_rows > 0);
	};
	
	this.clear = function() {
		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS; c++) {
				this.cells[r][c] = 0;
			}
		}
	};
	
	this.clone = function() {
		return new Board(this.cells);
	};
}