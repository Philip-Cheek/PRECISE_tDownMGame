window.onload = function(){
	var game = new Game('canvas', 'cross', 'mapCanvas');
	game.init();
	game.start();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();
