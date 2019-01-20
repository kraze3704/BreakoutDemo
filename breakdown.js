
const STATUS = document.querySelector("#gameStatus");

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

// brick definition
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// brick array
const bricks = [];
for( let i=0; i<brickColumnCount; i++) {
    bricks[i] = [];
    for(let j=0; j<brickRowCount; j++) {
        bricks[i][j] = {
            x: 0,
            y: 0,
            status: 1,
            // flag to show the brick is active or not
        };
    }
};

/*
    brick collision detection
    1. loop through the array of bricks every frame
    > check for ball status with bricks.status first, then
    2. compare the ball coordinate to see if the ball is hitting the brick
        2.1. y coordinate of the ball BETWEEN brickY ~ brickY + brickHeight?
        AND
        2.2. x coordinate of the ball BETWEEN brickX ~ brickX + brickWidth?
    4. reverse dy, change bricks.status to 0;
*/
function brickCollision() {
    for ( let i=0; i<brickColumnCount; i++) {
        for(let j=0; j<brickRowCount; j++) {
            let CURRENT_BRICK = bricks[i][j];
            // check ball status
            if(CURRENT_BRICK.status == 1) {
                // compare coordinate values
                if(ball.y > CURRENT_BRICK.y && ball.y - RADIUS < CURRENT_BRICK.y + brickHeight && ball.x > CURRENT_BRICK.x && ball.x < CURRENT_BRICK.x + brickWidth) {
                    dy = -dy;
                    CURRENT_BRICK.status = 0;
                }
            }
        }
    }
}

function drawBricks() {
    for( let i=0; i<brickColumnCount; i++) {
        let brickX = (i*(brickWidth + brickPadding)) + brickOffsetLeft;

        for(let j=0; j<brickRowCount; j++) {
            if(bricks[i][j].status == 1) {
                let brickY = (j*(brickHeight + brickPadding)) + brickOffsetTop;

                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillSAAtyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};

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

refreshGame = (e) => {
    e.preventDefault();
    document.location.reload();
}

function collisionCheck() {
    // check for top wall collision & paddle collision
    if (ball.y + dy < RADIUS) {
        dy = -dy;
    } else if (ball.y > CANVAS_HEIGHT - paddleHeight - RADIUS) {
        // when the ball reaches the paddles height check for collision
        if(ball.x > paddleX && ball.x < paddleX + paddleWidth){
            dy = -dy;
        }
    }
    // game-over condition: passing through the bottom floor
    if (ball.y + dy > CANVAS_HEIGHT) {
    //    alert("GAME OVER");
    //    document.location.reload();

        // stop the ball movement
        dx = 0;
        dy = 0;
        // create a gameover text and append
        const gameoverText = document.createElement("h1");
        gameoverText.className = "gameover_Text";
        gameoverText.innerHTML = "GAME OVER";
        STATUS.appendChild(gameoverText);

        // create a start new game button and append
        const newGame = document.createElement("button");
        newGame.type = "button";
        newGame.innerHTML = "NewGame";
        newGame.addEventListener("click", refreshGame);
        STATUS.appendChild(newGame);
    }

    // check for left & right wall collision
    if (ball.x + dx < RADIUS || ball.x + dx > CANVAS_WIDTH - RADIUS) {
        dx = -dx;
    }

    // check for paddle collision
    /*
      paddle attributes: paddleX, paddleHeight, paddleWidth
      ball attributes: ball.x, ball.y, RADIUS

      1. check if the ball is touching the paddle => y value of the ball + RADIUS > CANVAS WIDTH - paddleHeight
         AND
      2. check if center of the ball is between the paddle => x value of the ball BETWEEN paddleX to paddleX + paddleWidth
      3. invert dy
      4. success?
    */
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

    drawBricks();
    brickCollision();

    movePaddle();
    drawPaddle();
    drawBall();
    collisionCheck();
    ball.x += dx;
    ball.y += dy;

}

window.requestAnimationFrame(draw);