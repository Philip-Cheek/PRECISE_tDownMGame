var Game = function(canvasID, crossID, mapID){
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
	this.soldier = new Soldier();
	this.map = new Map([1000,1000], mapID);
	this.camera = [];
	this.cursor = [];
	this.scale = .65;
	this.cross = document.getElementById(crossID);
	this.crossScale = 1;
	this.startTime = 0;
	this.fps = 80
}

Game.prototype.init = function(){
	var self = this;

	setCanvas(this.canvas, this.context);
	this.map.demoAssemble(this.scale);
	this.camera = adjustCamera();
	this.soldier.collectSprites();
	this.soldier.gun.setGunCoord();

	document.addEventListener('mousemove', function(e){
		self.cursor = [e.pageX, e.pageY];
	});

	document.addEventListener('mousedown', function(e){
		self.soldier.gun.fire = true;
	});

	document.addEventListener('mouseup', function(e){
		self.soldier.gun.fire = false;
	});

}

Game.prototype.start = function(){
	var self = this,
		count = 1;

	this.camera = adjustCamera();
	this.soldier.watchForMovement();


	function animate(){
		window.requestAnimFrame(animate)

		var startTime = self.startTime,
			now = new Date().getTime(),
			elapsedTime = now - startTime,
			fps = 1000/self.fps;

		if (startTime == 0 || elapsedTime >= fps){
			self.startTime = now;

			var camera = self.camera,
				cursor = self.cursor,
				cavnas = self.canvas,
				context = self.context,
				scale = self.scale;
		
			self.camera = adjustCamera();
			setCanvas(canvas, context);
			var camOffset = getMouseOffset(cursor, camera);
			
			context.save();
			context.scale(scale, scale);
			self.map.draw([
				camOffset[0] - (0 + self.soldier.mapPos[0]),
				camOffset[1] - (0 + self.soldier.mapPos[1])
			]);
			self.drawCrosshairs();
			self.soldier.update(context, camOffset, scale, cursor);
			context.restore();

		}
	}

	animate();
}

Game.prototype.drawCrosshairs = function(){
	this.context.save();

	if (this.soldier.gun.fire){
		if (this.crossScale > .5){
			this.crossScale -= .05;
		}
		this.context.scale(this.crossScale, this.crossScale);
	}else if (this.crossScale < 1){
		this.crossScale += .05;
		this.context.scale(this.crossScale, this.crossScale);
	}

	this.context.drawImage(
		this.cross, 
		(this.cursor[0]/(this.scale * this.crossScale)) - this.cross.width * .5, 
		(this.cursor[1]/(this.scale * this.crossScale)) - this.cross.height * .5
	);
	this.context.restore();
}

function getMouseOffset(cursor, center, scale){
	if (cursor.length > 0){
		var c = [
			cursor[0],
			cursor[1]
		]

		if (c[1] > window.innerHeight * .95){
			c[1] = window.innerHeight * .95
		}else if (c[1] < window.innerHeight * .03){
			c[1] = window.innerHeight * .03
		}

		if (c[0] > window.innerWidth * .92){
			c[0] = window.innerWidth * .92
		}else if (c[0] < window.innerWidth * .08){
			c[0] = window.innerWidth * .08
		}

		return [
			center[0] - c[0],
			center[1] - c[1]
		]
	}

	return [0, 0]
}
function setCanvas(canvas, context){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function adjustCamera(cursor, camera){
	if (!cursor){
		return [
			window.innerWidth/2,
			window.innerHeight/2
		]
	}else if (cursor.length < 1){
		cursor = [0, 0];
	}

	var distX = cursor[0] - camera[0],
		distY = cursor[1] - camera[1]

	return [
		camera[0] + distX,
		camera[1] + distY
	] 

}


