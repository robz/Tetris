function Piece(index) {
	this.index = index;

	this.row = -1; 
	this.col = 3;
	this.orient = 0;
	
	this.struct = structures[index];
	this.color = colors[index];
	
	this.num_orients = this.struct.length;
	this.first_row = new Array(this.num_orients);
	this.last_row = new Array(this.num_orients);
	this.left_col = new Array(this.num_orients);
	this.right_col = new Array(this.num_orients);
	
	for (var i = 0; i < this.num_orients; i++) {
		// determine first row
		var r = -1;
		for (r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (this.struct[i][r][c] == 1) {
					break;
				}
			}
			if (c < 4) {
				break;
			}
		}
		this.first_row[i] = r;
		
		// determine last row
		r = -1;
		for (r = 3; r >= 0; r--) {
			for (var c = 0; c < 4; c++) {
				if (this.struct[i][r][c] == 1) {
					break;
				}
			}
			if (c < 4) {
				break;
			}
		}
		this.last_row[i] = r;
		
		// determine farthest left col
		var c = -1;
		for (c = 0; c < 4; c++) {
			for (r = 0; r < 4; r++) {
				if (this.struct[i][r][c] == 1) {
					break;
				}
			}
			if (r < 4) {
				break;
			}
		}
		this.left_col[i] = c;
		
		// determine farthest left col
		var c = -1;
		for (c = 3; c >= 0; c--) {
			for (r = 0; r < 4; r++) {
				if (this.struct[i][r][c] == 1) {
					break;
				}
			}
			if (r < 4) {
				break;
			}
		}
		this.right_col[i] = c;
	}
	
	// check if in bounds
	this.in_bounds = function(row, col, orient, ignore_top) {
		if ((row + this.first_row[orient] < 0 && !ignore_top)
			|| row + this.last_row[orient] >= ROWS
			|| col + this.left_col[orient] < 0
			|| col + this.right_col[orient] >= COLS) {
			return false;
		}
		
		return true;
	}
	
	this.can_move = function(dr, dc, da) {
		var new_row = dr + this.row,
			new_col = dc + this.col,
			new_orient = (this.orient + da)%this.num_orients;
			
		if (this.in_bounds(new_row, new_col, new_orient, true)) {
			return true;
		}
	
		return false;
	};
	
	this.move = function(dr, dc, da) {
		this.row = dr + this.row;
		this.col = dc + this.col;
		this.orient = (this.orient + da)%this.num_orients;
	};
	
	this.reset = function() {
		this.row = -1; 
		this.col = 3;
		this.orient = 0;
	};
}

var colors = [
	"red",
	"orange",
	"yellow",
	"magenta",
	"blue",
	"green",
	"cyan",
];

var structures = [
	[
	[[0,1,1,0],
	 [0,1,1,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	],
	 
	[
	[[0,0,0,0],
	 [1,1,1,1],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,0,1,0],
	 [0,0,1,0],
	 [0,0,1,0],
	 [0,0,1,0]],
	 
	[[0,0,0,0],
	 [0,0,0,0],
	 [1,1,1,1],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [0,1,0,0],
	 [0,1,0,0],
	 [0,1,0,0]],
	],
	
	[
	[[0,1,0,0],
	 [1,1,1,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [0,1,1,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	 
	[[0,0,0,0],
	 [1,1,1,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [1,1,0,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	],
	
	[
	[[1,0,0,0],
	 [1,1,1,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,1,1,0],
	 [0,1,0,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	 
	[[0,0,0,0],
	 [1,1,1,0],
	 [0,0,1,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [0,1,0,0],
	 [1,1,0,0],
	 [0,0,0,0]],
	],
	
	[
	[[0,0,1,0],
	 [1,1,1,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [0,1,0,0],
	 [0,1,1,0],
	 [0,0,0,0]],
	 
	[[0,0,0,0],
	 [1,1,1,0],
	 [1,0,0,0],
	 [0,0,0,0]],
	 
	[[1,1,0,0],
	 [0,1,0,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	],
	
	[
	[[1,1,0,0],
	 [0,1,1,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,0,1,0],
	 [0,1,1,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	 
	[[0,0,0,0],
	 [1,1,0,0],
	 [0,1,1,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [1,1,0,0],
	 [1,0,0,0],
	 [0,0,0,0]],
	],
	
	[
	[[0,1,1,0],
	 [1,1,0,0],
	 [0,0,0,0],
	 [0,0,0,0]],
	 
	[[0,1,0,0],
	 [0,1,1,0],
	 [0,0,1,0],
	 [0,0,0,0]],
	 
	[[0,0,0,0],
	 [0,1,1,0],
	 [1,1,0,0],
	 [0,0,0,0]],
	 
	[[1,0,0,0],
	 [1,1,0,0],
	 [0,1,0,0],
	 [0,0,0,0]],
	],
];
