
// fetch the canvas by the id "myCanvas"
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;


// ball definition
const ball = {
    x: canvas.width/2,
    y: canvas.height-30,
};
const RADIUS = 10;

// speed of the ball
let dx = 2;
let dy = -2;


// paddle definition
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (CANVAS_WIDTH - paddleWidth)/2;
const PADDLE_SPEED = 7;

// paddle control variables
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function movePaddle() {
    // check for inputs as well as collision with the wall
    if(rightPressed && paddleX + paddleWidth < CANVAS_WIDTH) {
        paddleX += PADDLE_SPEED;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SPEED;
    }
}

// event handlers for keyboard inputs
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if(e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if(e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, CANVAS_HEIGHT - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionCheck() {
    // check for top & bottom collision
    if (ball.y + dy < RADIUS || ball.y + dy > CANVAS_HEIGHT - RADIUS) {
        dy = -dy;
    }
    // check for left & right collision
    if (ball.x + dx < RADIUS || ball.x + dx > CANVAS_WIDTH - RADIUS) {
        dx = -dx;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    movePaddle();
    drawPaddle();
    drawBall();
    collisionCheck();
    ball.x += dx;
    ball.y += dy;
}

window.requestAnimationFrame(draw);