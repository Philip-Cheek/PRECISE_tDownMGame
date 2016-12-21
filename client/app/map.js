var Map = function(dimensions, mapID){
	this.tileSheet = [];
	this.dimensions = dimensions;
	this.offset = [0, 0]
	this.canvas = document.getElementById(mapID);
	this.context = this.canvas.getContext('2d');
	this.scale;
}

Map.prototype.demoAssemble = function(scale){
	this.scale = scale;
	console.log(scale)
	var granite = document.getElementById('granite');
	for (var r = 0; r < 10; r++){
		var row = [];
		for (var c = 0; c < 10; c++){
			if (r == 0 || r == 9 || c == 0 || c == 9){
				tile = new Tile([r * 100, c * 100], {'fill': '#00ced1', 'material': 'reflect'});
				row.push(tile);
			}else{
				tile = new Tile([r * 100, c * 100], {'texture': granite})
				row.push(tile);

			}
		}
		this.tileSheet.push(row);
	}
}

Map.prototype.produceRelevantTile = function(coord){
	console.log(coord);
	for (var i = 0; i < this.tileSheet.length; i++){
		var row = this.tileSheet[i]
		for (var c = 0; c < row.length; c++){
			var tCoord = row[c].coord;
			inWidth = coord[0] >= tCoord[0] && coord[0] <= tCoord[0] + 100;
			inHeight = coord[1] <= tCoord[1] && coord[1] >= tCoord[1] - 100;

			if (inWidth && inHeight){
				console.log('we in');
				row[c].fill = 'pink';
				return row[c];
			}
		}
	}
} 
Map.prototype.draw = function(offset){

	if ((this.offset[0] == 0 && this.offset[1] == 0) || offset[0] != this.offset[0] || offset[1] != this.offset[1]){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.context.scale(this.scale, this.scale);
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		var tS = this.tileSheet;
		for (var r = 0; r < tS.length; r++){
			for (var c = 0; c < tS.length; c++){
				tS[r][c].draw(this.context, offset);
			}
		}
		this.offset = offset;
	}
}