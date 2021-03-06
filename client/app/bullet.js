var Bullet = function(bCoord, theta, point, origin, arc, mouse, speed, offset){
	this.coord = getTrueOrigin(bCoord, theta, point, origin, arc, offset);
	this.velocity = getVelocities(this.coord, mouse, speed, offset);
	// this.coord[0] += (this.velocity[0] * 3.5);
	// this.coord[1] += (this.velocity[1] * 3.5);
	this.range = 900;
};

var test;

Bullet.prototype.update = function(context, offset, tile){
	console.log('ucheck:',this.coord)
	var collision = ifCollision(this.coord, tile);
	this.coord = collision.coord;

	if (!test){
		test = [
			this.coord[0],
			this.coord[1]
		];
	}
	this.velocity[0] *= collision.revVals[0];
	this.velocity[0] *= collision.revVals[1];

	var relCoord = [
		test[0] + offset[0],
		test[1] + offset[1]
	]

	context.save();
	context.strokeStyle = 'red';
	context.beginPath();
	context.arc(relCoord[0], relCoord[1],15,0,2*Math.PI);
	context.fillStyle = "orange";
	context.fill();
	context.stroke();
	context.restore();

	// this.coord[0] += this.velocity[0];
	// this.coord[1] += this.velocity[1];
	this.range -= 1;
};

function ifCollision(coord, tile){
	var c = coord, rVal = [1, 1];

	console.log('we have tile', tile, tile && tile.material == 'reflect');
	// if (tile && tile.material && tile.material == 'reflect'){
	// 	console.log('we evaluate');
	// 	var x, y, sides = [
	// 		tile.coord[0],
	// 		tile.coord[0] + 100,
	// 		tile.coord[1],
	// 		tile.coord[1] + 100
	// 	];

	// 	if (Math.abs(c[0] - sides[0]) < Math.abs(c[0] - sides[1])){
	// 		x = sides[0];
	// 		rVal[0] *= -1
	// 	}else{
	// 		x = sides[1];
	// 		rVal[0] *= -1
	// 	}

	// 	if (Math.abs(c[1] - sides[2]) < Math.abs(c[1] - sides[3])){
	// 		y = sides[2];
	// 	}else{
	// 		y = sides[3];
	// 	}

	// 	if (x > y){
	// 		c[0] = x;
	// 	}else{
	// 		c[1] = y;
	// 	}

	// }

	return {'coord': c, "revVals": rVal}
}
function getVelocities(coord, mouse, speed, offset){
	var mTheta = (Math.atan2(
		mouse[0] - (coord[0] + offset.pan[0]),
		mouse[1] - (coord[1] + offset.pan[1])
	) - Math.PI/2) * -1;

	return [
		speed * Math.cos(mTheta),
		speed * Math.sin(mTheta)
	];
}

function getTrueOrigin(bCoord, theta, point, origin, arc, offset){
	var coord = [
		origin[0] + bCoord[0],
		origin[1] + bCoord[1]
	];

	theta = (theta + arc) * -1;

	var tX = coord[0] - point[0],
		tY = coord[1] - point[1],
		x = ((Math.cos(theta) * tX) - (Math.sin(theta) * tY)) + point[0],
		y = ((Math.sin(theta) * tX) + (Math.cos(theta) * tY)) + point[1]

	return [x, y];
}