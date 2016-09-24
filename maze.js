var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var restart = document.getElementById("restart");
var msg = document.getElementById("msg");
// var mark = document.getElementById("mark");
var clock = document.getElementById("clock");
var failBox = document.getElementById("fail");
var tryAgain = failBox.getElementsByTagName('a')[0];

canvas.width = 505;
canvas.height = 505;

var flag;
var brickLength = 20;
var space = 5;
var sx = 0;
var sy = 0;
var ex = 19;
var ey = 19;
var routeArr = [];
var bricks = [];
var inarr = false;
var inran = false;
var speed = 5;
var start = space+brickLength/2;
var lastx = start;
var lasty = start;
var cx = start;
var cy = start;
var fail = 1;
var begin = 0;
var time = 60;
var timer;

document.body.onload = init;

msg.onclick = function() {
	this.style.display = 'none';
}

restart.onclick = playAgain;

tryAgain.onclick = playAgain;

document.onkeydown = function(e) {
	if ( fail && begin ) {
		switch( e.keyCode ) {
			case 37: 
				moveLeft();
				break;
			case 38: 
				moveUp();
				break;
			case 39: 
				moveRight();
				break;
			case 40: 
				moveDown();
				break;
			default:
				break;
		}
	}
	WinJudge();
}

function WinJudge() {
	if ( cx==(space+brickLength)*ex+brickLength/2+space && cy==(space+brickLength)*ey+brickLength/2+space ) {
		fail = 0;
		msg.style.display = 'block';
		clock.style.display = 'none';
		clearInterval(timer);
		clock.style.display = 'none';
	}
}

function init() {
	setBck();
}

function setBck() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.save();
	drawClip();
	context.fillStyle = "#FAFAD2";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawMoveBall(cx, cy);
	drawGoalBall();
	if ( bricks.length ) {
		for ( var i=0; i<bricks.length; i++ ) {
			draw(bricks[i].x, bricks[i].y);
		}
	} else {
		drawBrick();
	}
	context.restore();
}

function showTime() {
	clearInterval(timer);
	var curTime = Date.now();
	timer = setInterval(function() {
		if ( begin ) {
			if ( Date.now()-curTime>=1 ) {
				curTime = Date.now();
				time --;
				if ( time>0 ) {
					countTime();
				} else {
					clearInterval(timer);
					gameover();
				}
			}
		}
	}, 1000);
}

function drawClip() {
	context.beginPath();
	context.strokeStyle = "#696969";
	context.arc(cx, cy, 30, 0, 2*Math.PI, false);
	context.stroke();
	context.clip();
}

function drawGoal(mcxt) {
	mcxt.moveTo(490+10*Math.cos(Math.PI/2), 490+10*Math.sin(Math.PI/2));
	mcxt.lineTo(490+5*Math.cos(Math.PI/2+Math.PI/5), 490+5*Math.sin(Math.PI/2+Math.PI/5));
	mcxt.lineTo(490+10*Math.cos(Math.PI/2+Math.PI*2/5), 490+10*Math.sin(Math.PI/2+Math.PI*2/5));
	mcxt.lineTo(490+5*Math.cos(Math.PI/2+Math.PI*3/5), 490+5*Math.sin(Math.PI/2+Math.PI*3/5));
	mcxt.lineTo(490+10*Math.cos(Math.PI/2+Math.PI*4/5), 490+10*Math.sin(Math.PI/2+Math.PI*4/5));
	mcxt.lineTo(490+5*Math.cos(Math.PI/2+Math.PI*5/5), 490+5*Math.sin(Math.PI/2+Math.PI*5/5));
	mcxt.lineTo(490+10*Math.cos(Math.PI/2+Math.PI*6/5), 490+10*Math.sin(Math.PI/2+Math.PI*6/5));
	mcxt.lineTo(490+5*Math.cos(Math.PI/2+Math.PI*7/5), 490+5*Math.sin(Math.PI/2+Math.PI*7/5));
	mcxt.lineTo(490+10*Math.cos(Math.PI/2+Math.PI*8/5), 490+10*Math.sin(Math.PI/2+Math.PI*8/5));
	mcxt.lineTo(490+5*Math.cos(Math.PI/2+Math.PI*9/5), 490+5*Math.sin(Math.PI/2+Math.PI*9/5));
}

function random() {
	return Math.round(Math.random());
}

function route() {
	routeArr.push({x:sx, y:sy});
	while ( sx<=ex || sy<=ey ) {
		var dir = random();
		if ( sx<ex && sy<ey ) {
			if ( dir ) {
				sx++;
			} else {
				sy++;
			}
		} else if ( sx==ex && sy<ey ) {
			sy++;
		} else if ( sx<ex && sy==ey) {
			sx++;
		} else if ( sx==ex && sy==ey ){
			break;
		}
		routeArr.push({x:sx, y:sy});
	}
}

function drawBrick() {
	route();
	var x = 5;
	var y = 5;
	while ( y<500 ) {
		while ( x<500 ) {
			if ( !inArray(x, y, routeArr) ) {
				flag = random()*6;
				if ( flag ) {
					draw(x, y);
					bricks.push({x:x, y:y});
				}
			}
			x += (brickLength+space);
		}
		y += (brickLength+space);
		x = 5;
	}
}

function draw(x, y) {
	context.fillStyle = '#DCDCDC';
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x+brickLength, y);
	context.lineTo(x+brickLength, y+brickLength);
	context.lineTo(x, y+brickLength);
	context.lineTo(x, y);
	context.closePath();
	context.fill();
}

function inArray(x, y, arr) {
	inarr = false;
	for ( var i=0; i<arr.length; i++ ) {
		if ( (brickLength+space)*arr[i].x+space == x ) {
			if ( (brickLength+space)*arr[i].y+space == y ) {
				inarr = true;
				break;
			}
		}
	}
	return inarr;
}

function inRange(x, y, dir, arr) {
	inran = true;
	if ( dir=='left' ) {
		for ( var i=0; i<arr.length; i++ ) {
			if ( x-brickLength/2>space ) {
				if ( arr[i].y-brickLength/2<y && arr[i].y+brickLength*3/2>y && arr[i].x<x ) {
					if ( arr[i].x+brickLength>=x-brickLength/2 ) {
						inran = false;
						break;
					}
				}
			} else {
				inran = false;
				break;
			}
		}
	} else if ( dir=='right' ) {
		for ( var i=0; i<arr.length; i++ ) {
			if ( x+brickLength/2<canvas.width ) {
				if ( arr[i].y-brickLength/2<y && arr[i].y+brickLength*3/2>y && arr[i].x>x ) {
					if ( arr[i].x<=x+brickLength/2 ) {
						inran = false;
						break;
					}
				}
			} else {
				inran = false;
				break;
			}
		}
	} else if ( dir=='up' ) {
		for ( var i=0; i<arr.length; i++ ) {
			if ( y-brickLength/2>0 ) {
				if ( arr[i].x-brickLength/2<x && arr[i].x+brickLength*3/2>x && arr[i].y<y ) {
					if ( arr[i].y+brickLength>=y-brickLength/2 ) {
						inran = false;
						break;
					}
				}
			}else {
				inran = false;
				break;
			}
		}
	} else if ( dir=='down' ) {
		for ( var i=0; i<arr.length; i++ ) {
			if ( y+brickLength/2<canvas.height ) {
				if ( arr[i].x-brickLength/2<x && arr[i].x+brickLength*3/2>x && arr[i].y>y ) {
					if ( arr[i].y<=y+brickLength/2 ) {
						inran = false;
						break;
					}
				}
			} else {
				inran = false;
				break;
			}
		}
	}
	return inran;
}

function drawMoveBall(x, y) {
	context.fillStyle = '#00868B';
	context.beginPath();
	context.arc(x, y, brickLength/2, 0, 2*Math.PI, true);
	context.closePath();
	context.fill();
	
}

function drawGoalBall() {
	context.strokeStyle = '#CD6839';
	context.beginPath();
	context.arc((space+brickLength)*ex+brickLength/2+space, (space+brickLength)*ey+brickLength/2+space, brickLength/2, 0, 2*Math.PI, true);
	context.closePath();
	context.stroke();
}

function countTime() {
	clock.style.display = 'block';
	clock.innerHTML = time;
}

function moveLeft() {
	if ( inRange(cx, cy, 'left', bricks) ) {
		cx -= speed;
		init();
	}
}

function moveUp() {
	if ( inRange(cx, cy, 'up', bricks) ) {
		cy -= speed;
		init();
	}
}

function moveRight() {
	if ( inRange(cx, cy, 'right', bricks) ) {
		cx += speed;
		init();
	}
}

function moveDown() {
	if ( inRange(cx, cy, 'down', bricks) ) {
		cy += speed;
		init();
	}
}

function gameover() {
	clock.style.display = 'none';
	failBox.style.display = 'block';
	fail = 0;
}

function playAgain() {
	showTime();
	time = 60;
	begin = 1;
	countTime();
	bricks = [];
	fail = 1;
	msg.style.display = 'none';
	failBox.style.display = 'none';
	cx = space+brickLength/2;
	cy = space+brickLength/2;
	init();
}