var Tile = function(coord, info){
	this.coord = coord;
	this.texture;
	this.fill;

	if (info && 'fill' in info){
		this.fill = info.fill
	}

	if (info && 'texture' in info){
		this.texture = info.texture;
	}
}

Tile.prototype.draw = function(context, offset){
	context.save();
	var coord = [this.coord[0] + offset[0],this.coord[1] + offset[1]];
	if (this.fill){
		context.fillStyle = this.fill;
		context.fillRect(coord[0],coord[1], 100, 100);
	}else if (this.texture){
		context.drawImage(this.texture, coord[0], coord[1])
	}
	context.restore();
}