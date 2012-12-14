var piece_averages,
	update_count = 0;

function init_watcher() {
	piece_averages = new Array(structures.length);
	for (var i = 0; i < structures.length; i++) {
		piece_averages[i] = new Array(features.length);
		
		for (var j = 0; j < features.length; j++) {
			piece_averages[i][j] = 0;
		}
	}
}

function watch(old_board, piece, new_board) {
	// first calculate feature values for this move
	// then iterate over all actions &
	//	calculate feature value averages 
	// calculate the feature weights for this move
	// update running averages
	
	var move_feature_values = new Array(features.length);
	for (var i = 0; i < features.length; i++) {
		move_feature_values[i] = features[i](old_board, piece, new_board);
	}
	
	var num_moves = 0,
		ave_feature_values = new Array(features.length);
	for (var i = 0; i < features.length; i++) {
		ave_feature_values[i] = 0;
	}
	
	for (var orient = 0; orient < piece.num_orients; orient++) {
		var left_col = -piece.left_col[orient],
			right_col = COLS - piece.right_col[orient] - 1;
			
		for (var new_col = left_col; new_col <= right_col; new_col++) {
			var old_board_copy = old_board.clone();
			
			piece.reset();
			var col_dif = new_col - piece.col;
			piece.move(0, col_dif, orient);
			
			old_board_copy.drop(piece);
			old_board_copy.fix(piece);
			old_board_copy.delete_rows();
			
			for (var i = 0; i < features.length; i++) {
				ave_feature_values[i] += 
					features[i](old_board, piece, old_board_copy);
			}
			
			num_moves++;
		}
	}
	
	for (var i = 0; i < features.length; i++) {
		ave_feature_values[i] /= num_moves;
	}
	
	var move_weights = new Array(features.length);
	for (var i = 0; i < features.length; i++) {
		move_weights[i] = move_feature_values[i] - ave_feature_values[i];
	}
	
	for (var i = 0; i < features.length; i++) {
		piece_averages[piece.index][i] = ((piece_averages[piece.index][i]*update_count)
			+ move_weights[i])/(update_count + 1);
	}
	
	console.log(JSON.stringify(piece_averages));
	
	update_count++;
}






































