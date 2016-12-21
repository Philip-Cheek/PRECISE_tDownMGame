var Soldier = function(updateBullet){
	this.renderPos = [
		window.innerWidth/2,
		window.innerHeight/2
	];
	this.mapPos = [
		0, 0
	]
	this.sprites = {};
	this.dir = 'b1';
	this.gun = new Gun(updateBullet);
	this.frame = 1;
	this.motion = {
		'fCounter': 0,
		'fRate': 8,
		'boost': false,
		'speed': 5,
		'bRate': 1.5,
		'dirs': {
			'left': false,
			'up': false,
			'right': false,
			'down': false
		}
	}
}

Soldier.prototype.watchForMovement = function(){
	var keyDown,
		self = this,
		moveKeys = {
			'left': 65,
			'up': 87,
			'right': 68,
			'down': 83,
			'boost': 16
		};


	document.addEventListener('keydown', function(e){
		if (!keyDown || keyDown != e.keyCode){
			keyDown = e.keyCode;
			for (var k in moveKeys){
				if (moveKeys[k] == keyDown){
					self.motion.dirs[k] = true;
					break;
				}
			}
		}
	});

	document.addEventListener('keyup', function(e){
		var keyUp = e.keyCode;
		if (keyUp == keyDown){
			keyDown = undefined;
		}

		for (var k in moveKeys){
			if (moveKeys[k] == keyUp){
				self.motion.dirs[k] = false;
				break;
			}
		}
	});
};

Soldier.prototype.update = function(context, offset, scale, cursor){
	var coord = [
		((window.innerWidth/2)/scale) + offset.pan[0],
		((window.innerHeight/2)/scale) + offset.pan[1]
	];

	cursor = [
		cursor[0]/scale,
		cursor[1]/scale
	]

	this.dir = faceDir(cursor, coord, scale);

	var mInfo = updateMapPostion(this.motion, this.mapPos);
	if (mInfo.status){
		this.mapPos = mInfo.pos;
		if (this.motion.fCounter == 0){
			this.motion.fCounter = this.motion.fRate;

			if (this.frame < 2){
				this.frame++;
			}else{
				this.frame = 0;
			}
		}else{
			this.motion.fCounter--;
		}
	}else{
		this.motion.fCounter = 0;
		this.frame = 1;
	}
	console.log(this.frame);
	var img = this.sprites[this.dir + this.frame.toString()];

	context.imageSmoothingEnabled = true;

	if (this.dir == 'f'){
		this.gun.updateGun(this.dir, context, coord, cursor, scale, offset);

		context.drawImage(
			img, 
			coord[0] - (img.width/2), 
			coord[1] - (img.height/2)
		);
	}else{
		context.drawImage(
			img, 
			coord[0] - (img.width/2), 
			coord[1] - (img.height/2)
		);

		this.gun.updateGun(this.dir, context, coord, cursor, scale, offset);
	}
}

function updateMapPostion(moveInfo, map){
	var s = moveInfo.speed,
		dir = moveInfo.dirs,
		u = [0, 0]

	if (moveInfo.boost){
		s *= moveInfo.bRate;
	}

	var v = s * Math.cos(45);

	if (dir.left){
		if (dir.up){
			u = [-v, v];
		}else if (dir.down){
			u = [-v, -v];
		}else if (!dir.right){
			u = [-s, 0];
		}
	}else if (dir.right){
		if (dir.up){
			u = [v, v];
		}else if (dir.down){
			u = [v, -v];
		}else{
			u = [s, 0];
		}
	}else if (dir.up){
		if (!dir.down){
			u = [0, s];
		}
	}else if (dir.down){
		u = [0, -s];
	}

	if (u[0] == 0 && u[0] == u[1]){
		return {'status': false}
	}else{
		return {
			'status': true,
			'pos': [
				map[0] + u[0],
				map[1] + u[1]
			]
		}
	}
}


Soldier.prototype.collectSprites = function(){
	var dirs = ['b', 'f', 'l', 'r'];

	for (var i = 0; i < dirs.length; i++){
		var gunID = 'g' + dirs[i]; 
		this.gun.sprites[dirs[i]] = {
			'img': document.getElementById(gunID)
		}
		for (var i2 = 0; i2 < 3; i2 ++){
			var dirID = dirs[i] + i2.toString();
			var img = document.getElementById(dirID);
			this.sprites[dirID] = img;
		}

		if (i < 2){
			dirs.push(dirs[i] + 'L');
			dirs.push(dirs[i] + 'R');
			dirs.push('g' + dirs[i] + 'L');
			dirs.push('g' + dirs[i] + 'R')
		}
	}
}


function calcAngle(c2, c1){
	return Math.atan2(
		c2[0] - c1[0],
		c2[1] - c1[1]
	);
}

function findCursorCoord(coord, cursor, scale){
	var reference = document.getElementById('b0');
	
	return calcAngle(cursor, [
		coord[0] + ((reference.width * scale) * .03),
		coord[1] + ((reference.height * scale) * .15)
	]);
}

function faceDir(cursor, coord, scale){

	var angle = findCursorCoord(coord, cursor, scale),
		section = (2 * Math.PI)/8,
		dir;

	if (Math.abs(angle) > Math.PI - section/2.3){
		dir = 'f';
	}else if (Math.abs(angle) > Math.PI - section * 1.2){
		if (angle > 0){
			dir = 'fR';
		}else{
			dir = 'fL';
		}
	}else if (Math.abs(angle) > Math.PI - (section * 2.2)){
		if (angle > 0){
			dir = 'r';
		}else{
			dir = 'l';
		}
	}else if (Math.abs(angle) > Math.PI - (section * 3.3)){
		if (angle > 0){
			dir = 'bR';
		}else{
			dir = 'bL'
		}
	}else{
		dir = 'b';
	}

	return dir;
}

