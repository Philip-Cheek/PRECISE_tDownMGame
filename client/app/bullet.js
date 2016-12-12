var Bullet = function(bCoord, theta, point, origin, arc, mouse, speed, offset){
	this.coord = getTrueOrigin(bCoord, theta, point, origin, arc, offset);
	this.velocity = getVelocities(this.coord, mouse, speed, offset);
	this.coord[0] += (this.velocity[0] * 3.5);
	this.coord[1] += (this.velocity[1] * 3.5);
	this.range = 600;
};

Bullet.prototype.update = function(context, offset){
	context.save();
	context.strokeStyle = 'red';
	context.beginPath();
	context.arc(this.coord[0] + offset[0], this.coord[1] + offset[1],15,0,2*Math.PI);
	context.fillStyle = "orange";
	context.fill();
	context.stroke();
	context.restore();

	this.coord[0] += this.velocity[0];
	this.coord[1] += this.velocity[1];
	this.range -= 1;
};

function getVelocities(coord, mouse, speed, offset){
	var mTheta = (Math.atan2(
		mouse[0] - (coord[0] + offset[0]),
		mouse[1] - (coord[1] + offset[1])
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

	return [x - offset[0], y - offset[1]];
}