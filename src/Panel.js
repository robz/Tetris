function Panel(id, num_rows, num_cols, pad, is_side_board) {
	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.col_inc = this.width/num_cols;
	this.row_inc = this.height/num_rows;
	this.pad = pad;
	
	this.drawBackground = function() {
		this.context.fillStyle = "gray";
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.strokeStyle = "black";
		//this.drawGrid();
	};

	this.drawGrid = function() {
		for (var r = 0; r <= ROWS; r++) {
			this.drawLine(0, r*this.row_inc, this.width, r*this.row_inc);
		}
		
		for (var c = 0; c <= COLS; c++) {
			this.drawLine(c*this.col_inc, 0, c*this.col_inc, this.height);
		}
	};

	this.drawLine = function(x1, y1, x2, y2) {
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
	};

	this.drawPiece = function(p) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (p.struct[p.orient][r][c] == 1) {
					var row = r + p.row,
						col = c + p.col;
						
					if (is_side_board) {
						row = r;
						col = c;
					}
				
					this.context.fillStyle = "black";
					this.context.fillRect(col*this.col_inc - this.pad/2, 
										  row*this.row_inc - this.pad/2, 
										  this.col_inc + this.pad, 
										  this.row_inc + this.pad);
					
					this.context.fillStyle = p.color; 
					this.context.fillRect(col*this.col_inc + this.pad/2, 
										  row*this.row_inc + this.pad/2, 
									      this.col_inc - this.pad, 
										  this.row_inc - this.pad);
				}
			}
		}
	};

	this.drawBoard = function(b) {
		for (var r = 0; r < num_rows; r++) {
			for (var c = 0; c < num_cols; c++) {
				var cell_value = b.cells[r][c];
				if (cell_value != 0) {
					this.context.fillStyle = "black";
					this.context.fillRect(c*this.col_inc - this.pad/2, 
										  r*this.row_inc - this.pad/2, 
										  this.col_inc + this.pad, 
										  this.row_inc + this.pad);
					
					this.context.fillStyle = colors[cell_value-1];
					this.context.fillRect(c*this.col_inc + this.pad/2, 
										  r*this.row_inc + this.pad/2, 
										  this.col_inc - this.pad, 
										  this.row_inc - this.pad);
				}
			}
		}
	};
	
	this.redraw = function(board, piece) {
		this.drawBackground();
		if (board) {
			this.drawBoard(board);
		}
		this.drawPiece(piece);
	}
}