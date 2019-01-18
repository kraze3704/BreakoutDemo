
// fetch the canvas by the id "myCanvas"
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;

const ball = {
    x: canvas.width/2,
    y: canvas.height-30,
};
// radius of the ball
const RADIUS = 10;

// speed of the ball
let dx = 2;
let dy = -2;


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
    drawBall();
    collisionCheck();
    ball.x += dx;
    ball.y += dy;
}

window.requestAnimationFrame(draw);