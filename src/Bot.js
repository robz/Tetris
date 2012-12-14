var weights = [[-1.0026654310666072,-0.6559017389101298,0.1512021014183981,0.6955328366505259,-0.03745176363340033,0.46213490303022337,0,0,0],[-1.2291238147699661,-1.3873636889515304,0.4287064176630322,1.0789677522117074,0.6301894333760184,0.24309187037510185,0,0,0],[-1.2029201470421258,-1.8372069186101592,0.2404891918293976,1.5056179252435886,0.43968928054125567,0.899363099649974,0,0,0],[-0.6983594469883232,-1.1477962298809026,0.12513845917263722,0.8703741056144092,0.1500372866948673,0.18088698912038223,0,0,0],[-0.9731216540538389,-1.6651932048383482,0.11236223838756428,1.3167857082072112,0.7966979256624362,0.3683960386931109,0,0,0],[-0.7893588585476901,-1.0025066096837143,0.11386415840699922,1.074054204434228,-0.10308570682560064,0.2577383175727329,0,0,0],[-0.6507477282884422,-1.0532754249325484,0.10999198953238701,0.8635798638811599,0.18411309841103296,0.22413769744481188,0,0,0]];
//[[-0.2618904284556832,-0.4150006144592989,0.011978652592580095,0.5031066153716585,0.005412414922187349,0.06452610608345125,-0.1686963107747463,-0.7147068200350347,-0.4150006144592989],[-1.7989197411469342,-0.8949317460598374,0.4842073661485727,0.42831196385136033,1.3882592049511735,0.7604774419162357,-0.8539984845873287,-2.53919973015326,-0.891494007327981],[-0.5635628083528393,-1.0237424725242625,0.0180084746303337,1.2037031969672563,0.11480165470223258,0.044875601093208976,-0.3343675352686339,-1.5911732108700167,-1.073503756034355],[-0.8641927210422793,-1.5737277961105358,-0.009307014999651175,0.9844306555738168,-0.3292651337051759,0.7954172623323759,-0.562991638408592,-1.4522423620936395,-1.565498862890144],[-0.283260200229442,-0.5992682801087367,-0.0006033532626791946,0.5015819441165975,0.0150336517603489,0,-0.20785646566591043,-0.4916889698537914,-0.5992682801087367],[-0.9799012014355787,-1.0241506002664043,0.09237192943853978,1.1759943213090462,-0.01147602161150271,0.2882084677673522,-0.516031974464953,-1.7356192667280599,-1.2101369410891873],[-0.7114451198352577,-1.1388903496130474,0.04649569590498771,1.5475194179625709,-0.06949531495556001,0.04149049313158394,-0.553185350723227,-1.8779370556736088,-1.2751083953125257]];
//[[-0.46569675468427935,-1.1404858326212202,-0.16536701091085795],[-0.9870389726354839,-2.4142183401969204,-0.3778033681830154],[-1.4967776974539297,-3.7682649892789795,-1.2824045674166877],[-0.9656863905339986,-2.2704244383806422,-0.9580008184129206],[-0.8705595728258567,-2.309349860979505,-0.8326882225321911],[-0.9368522498925134,-2.3816227895206583,-0.7704783085093835],[-1.0101097932252994,-2.2128292881459477,-1.119442515141523]];

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

	// overall pile height
	function(old_board, piece, new_board) {
		var flag = false, 
			old_r = 0,
			new_r = 0;
		
		for (; old_r < ROWS; old_r++) {
			for (var c = 0; c < COLS; c++) {
				if (old_board.cells[old_r][c] > 0) {
					flag = true;
					break;
				}
			}
			
			if (flag) {
				break;
			}
		}
		
		flag = false;
		
		for (; new_r < ROWS; new_r++) {
			for (var c = 0; c < COLS; c++) {
				if (new_board.cells[new_r][c] > 0) {
					flag = true;
					break;
				}
			}
			
			if (flag) {
				break;
			}
		}
		
		return (ROWS - new_r) - (ROWS - old_r);
	},
	
	// pile area roughness
	function(old_board, piece, new_board) {
		var old_count = 0,
			new_count = 0;
	
		for (var r = 0; r < ROWS; r++) {
			for (var c = 0; c < COLS-1; c++) {
				if ((old_board.cells[r][c] == 0) 
					!= (old_board.cells[r][c+1] == 0)) {
					old_count++;
				}
				
				if ((new_board.cells[r][c] == 0) 
					!= (new_board.cells[r][c+1] == 0)) {
					new_count++;
				}
			}
		}
		
		return new_count - old_count;
	},
	
	// buried cells
	function(old_board, piece, new_board) {
		var old_count = 0,
			new_count = 0;
	
		for (var c = 0; c < COLS; c++) {
			var old_flag = false,
				new_flag = false;
			
			for (var r = 0; r < ROWS; r++) {
				if (old_board.cells[r][c] > 0) {
					old_flag = true;
				} else if (old_flag) {
					old_count++;
				}
				
				if (new_board.cells[r][c] > 0) {
					new_flag = true;
				} else if (new_flag) {
					new_count++;
				}
			}
		}
		
		return new_count - old_count;
	}
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
				// weight += weights[i]*features[i](board, piece, board_copy);
				weight += weights[piece.index][i]*features[i](board, piece, board_copy);
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