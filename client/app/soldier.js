var Soldier = function(){
	this.renderPos = [
		window.innerWidth/2,
		window.innerHeight/2
	];
	this.mapPos = [
		0, 0
	]
	this.sprites = {};
	this.dir = 'b1';
	this.speed = 1;
	this.gun = new Gun();
	this.frame = 1;
	this.motion = {
		'status': false,
		'counter': 0,
		'cap': 5,
	}
}

Soldier.prototype.watchForMovement = function(){
	var self = this;

	document.addEventListener('keydown', function(e){
		console.log('press key', e.keyCode);
		var m = move(e.keyCode, self.mapPos, self.speed)
		self.mapPos = m.pos;
		self.motion.status = m.motion;
		console.log("afterPress", m)
	});

	document.addEventListener('keyup', function(e){
		var m = halt(e.keyCode, self.mapPos, self.speed);
		self.mapPos = m.pos;
		self.motion.status = m.motion;
		console.log("afterHalt", m)
	});
};

Soldier.prototype.update = function(context, offset, scale, cursor){
	var coord = [
		((window.innerWidth/2)/scale) + offset[0],
		((window.innerHeight/2)/scale) + offset[1]
	];

	cursor = [
		cursor[0]/scale,
		cursor[1]/scale
	]

	this.dir = faceDir(cursor, coord, scale);
	var img = this.sprites[this.dir + '1'];

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


//65 -> A -> Left
//87 -> W -> Up
//68 -> D -> Right
//83 -> S -> Down

function move(key, mapPos, speed){
	var s = speed,
		v = 6 * Math.cos(45),
		m = [0, 0];

	switch (key){
		case 65:
			if (m[1] > 0){
				m = [-v, v];
			}else if (m[1] < 0){
				m = [-v, -v];
			}else{
				m = [-s, 0];
			}

			break;

		case 68:
			if (m[1] > 0){
				m = [v, v];
			}else if (m[1] < 0){
				m = [v, -v];
			}else{
				m = [s, 0];
			}

			break;

		case 87:
			if (m[0] > 0){
				m = [v, v];
			}else if (m[0] < 0){
				m = [-v, v];
			}else{
				m = [0, s];
			}

			break;

		case 83:
			if (m[0] > 0){
				m = [v, -v];
			}else if (m[0] < 0){
				m = [-v, -v];
			}else{
				m = [0, -s];
			}

			break;
	}

	return { 
		'pos': [
			mapPos[0] - m[0],
			mapPos[1] - m[1]
		],
		'motion': m[0] != 0 || m[1] != 0
	};
}

function halt(key, mapPos, speed){
	var s = speed,
		m = [0, 0];

	switch (key){
		case 65:
			if (m[1] > 0){
				m = [0, s];
			}else if (m[1] < 0){
				m = [0, -s];
			}else{
				m = [0, 0];
			}

			break;

		case 68:
			if (m[1] > 0){
				m = [0, s];
			}else if (m[1] < 0){
				m = [0, s];
			}else{
				m = [s, 0];
			}

			break;

		case 87:
			if (m[0] > 0){
				m = [0, s];
			}else if (m[0] < 0){
				m = [0, s];
			}else{
				m = [0, 0];
			}

			break;

		case 83:
			if (m[0] > 0){
				m = [s, 0];
			}else if (m[0] < 0){
				m = [-s, 0];
			}else{
				m = [0, 0];
			}

			break;
	}

	return{
		'pos': [
			mapPos[0] - m[0],
			mapPos[1] - m[1]
		], 
		'motion': m[0] != 0 || m[1] != 0
	};
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

