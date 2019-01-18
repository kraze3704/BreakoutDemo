
// fetch the canvas by the id "myCanvas"
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const ball = {
    x: canvas.width/2,
    y: canvas.height-30,
};

// speed of the ball
const dx = 2;
const dy = -2;



function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    window.requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ball.x += dx;
    ball.y += dy;
}

window.requestAnimationFrame(draw);