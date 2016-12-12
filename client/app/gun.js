var Gun = function(){
	this.sprites = {};
	this.bulletQueue = [];
	this.fireRate = 15;
	this.rateCounter = this.fireRate;
	this.fireSpeed = 10;
	this.fire = false;
}

Gun.prototype.updateGun = function(dir, context, coord, cursor, scale, panOffset){
	var img = this.sprites[dir].img,
		point = [
			coord[0] + (this.dir[dir].point[0]),
			coord[1] + (this.dir[dir].point[1])
		]
	
	var offset = this.dir[dir].offset,
		arc = this.dir[dir].arcOffset;

	context.save();
	context.translate(point[0],point[1]);
		
	var xI = point[0] + this.dir[dir].intersect[0],
		yI = point[1] + this.dir[dir].intersect[1],
		gunAngle = Math.atan2(cursor[0] - xI, cursor[1] - yI),
		nAngle = (gunAngle + arc) * -1;

	context.rotate(nAngle)
	context.drawImage(img, offset[0], offset[1]);
	context.restore();
	this.handleFire(
		dir, gunAngle, point, 
		coord, arc, cursor, 
		context, panOffset
	);
};

Gun.prototype.handleFire = function(dir, theta, point, origin, arc, cursor, context, offset){
	var eBar = document.getElementById('eBar'),
		energy = document.getElementById('energy');

	if (this.fire && eBar.offsetWidth > 0){
		if (this.rateCounter == this.fireRate){
			this.bulletQueue.push(
				new Bullet(
					this.dir[dir].bCoord,
					theta,
					point,
					origin,
					arc,
					cursor,
					this.fireSpeed,
					offset
				)
			);
		}

		eBar.style.width = (eBar.offsetWidth - 1).toString() + 'px';
	}else if (!this.fire && eBar.offsetWidth < energy.offsetWidth){
		eBar.style.width = (eBar.offsetWidth + 1).toString() + 'px';
	}

	if (this.fire || this.rateCounter < this.fireRate){
		if (this.rateCounter < 0){
			this.rateCounter = this.fireRate;
		}else{
			this.rateCounter--;
		}
	}

	for (var i = this.bulletQueue.length - 1; i >- 0; i--){
		var bullet = this.bulletQueue[i];
		if (bullet.range > 0){
			bullet.update(context, offset);
		}else{
			this.bulletQueue.splice(i, 1);
		}
	}
}

Gun.prototype.setGunCoord = function(scale){
	var img = document.getElementById('b0');

	this.dir = {
		'l': {
			'point': [
				img.width * -.05,
				img.width * .5
			],'offset': [
				(-this.sprites['l'].img.width) * .78,
				(-this.sprites['l'].img.height) * .85
			], 'arcOffset': Math.PI/2,
			'intersect': [
				0,
				(-this.sprites['l'].img.height) * .6
			], 'bCoord': [
				-this.sprites['l'].img.width * .58,
				this.sprites['l'].img.height * .2,
				[-this.sprites['l'].img.width * .18, 0]
			]
		},'r': {
			'point': [
				(img.width) * -.1,
				(img.width) * .4
			],'offset': [
				(-this.sprites['l'].img.width) * .067,
				(-this.sprites['l'].img.height) * .6
			], 'arcOffset': -1.5708,
			'intersect': [
				0, -this.sprites['r'].img.height * .4
			], 'bCoord': [
				this.sprites['r'].img.width * .945,
				this.sprites['r'].img.height * .475
			]
		}, 'f': {
			'point': [
				(img.width) * .3,
				(img.width) *.3
			],'offset': [
				(-img.width) * .058,
				(-img.height) * .603
			], 'arcOffset': Math.PI,
			'intersect': [
				this.sprites['f'].img.width * 0.23, 0
			], 'bCoord': [
				this.sprites['f'].img.width * 1.15,
				-this.sprites['f'].img.height * .8
			]
		}, 'b': {
			'point': [
				(img.width) * .37,
				(img.height) * .1
			],'offset': [
				(-this.sprites['b'].img.width) * .8,
				(-this.sprites['b'].img.height) * .27
			], 'arcOffset':0,
			'intersect': [
				-this.sprites['b'].img.width * .38, 0
			], 'bCoord': [
				-this.sprites['f'].img.width * 1.6,
				this.sprites['f'].img.height * .83
			]
		}, 'bL': {
			'point': [
				(img.width) * .05,
				(img.width) * .25
			],'offset': [
				(-this.sprites['l'].img.width) * .9,
				(-this.sprites['l'].img.height) * .5
			], 'arcOffset': 1.5708,
			'intersect': [
				0, -this.sprites['l'].img.height * .38
			], 'bCoord': [
				-this.sprites['f'].img.width * 1.6,
				this.sprites['f'].img.height * .83
			]
		}, 'bR': {
			'point': [
				(img.width) * .1,
				(img.width) * .25
			],'offset': [
				(-this.sprites['l'].img.width) * .25,
				(-this.sprites['l'].img.height) * .3
			], 'arcOffset': -1.5708,
			'intersect': [
				0, -this.sprites['l'].img.height * .15
			], 'bCoord': [
				-this.sprites['f'].img.width * 1.6,
				this.sprites['f'].img.height * .83
			]
		},'fL': {
			'point': [
				-img.width * .34,
				img.width * .15
			],'offset': [
				-this.sprites['r'].img.width * .7,
				-this.sprites['l'].img.height * .5
			], 'arcOffset': 1.72,
			'intersect': [0, -this.sprites['l'].img.height * .03],
			'bCoord': [
				-this.sprites['fL'].img.width * .97,
				-this.sprites['fL'].img.height * .1
			]
		}, 'fR': {
			'point': [
				(img.width) * .34,
				(img.width) * .15,
			],'offset': [
				(-this.sprites['r'].img.width) * .35,
				(-this.sprites['l'].img.height) * .5
			], 'arcOffset': -1.75,
			'intersect': [0, 0],
			'bCoord': [
				-this.sprites['f'].img.width * 1.12,
				this.sprites['f'].img.height * .13
			]
		}
	}
}


