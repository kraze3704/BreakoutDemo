
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

// variable to save score
let SCORE = 0;

// variable to save player lives
let LIVES = 3;

drawCleared = () => {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("CONGRATULATIONS!", CANVAS_WIDTH/2, CANVAS_HEIGHT - 30);
}

drawLives = () => {
    ctx.font ="16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + LIVES, CANVAS_WIDTH - 65, 20);
}

drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + SCORE, 8, 20);
    // 1st param: text ("Score: " + score) / 2,3rd: coordinates where the text will be printed
}

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
                    SCORE++;

                    // win condition check: all bricks destroyed
                    if(SCORE == brickRowCount*brickColumnCount) {
                        // stop ball movement
                        dx = 0;
                        dy = 0;

                        // create game completed text and append to html
                        const gameCleared = document.createElement("h1");
                        gameCleared.className = "game_cleared_text";
                        gameCleared.innerHTML = "GAME CLEARED! CONGRATULATIONS";
                        STATUS.appendChild(gameCleared);

                        // create 'new game' button
                        const newGame = document.createElement("button");
                        newGame.type = "button";
                        newGame.innerHTML = "NewGame";
                        newGame.addEventListener("click", refreshGame);
                        STATUS.appendChild(newGame);
                        // display clear time?
                    }
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
    if(rightPressed && paddleX + (paddleWidth/2) < CANVAS_WIDTH) {
        paddleX += PADDLE_SPEED;
    } else if(leftPressed && paddleX + (paddleWidth/2) > 0) {
        // modified so paddle can move more than the left&right border
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
    ctx.rect(paddleX, CANVAS_HEIGHT - paddleHeight, paddleWidth/3, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(paddleX + paddleWidth/3, CANVAS_HEIGHT - paddleHeight, paddleWidth/3, paddleHeight);
    ctx.fillStyle = "#00CCDD";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(paddleX + paddleWidth*2/3, CANVAS_HEIGHT - paddleHeight, paddleWidth/3, paddleHeight);
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
        /*
        // when the ball reaches the paddles height check for collision
        if(ball.x > paddleX && ball.x < paddleX + paddleWidth){
            dy = -dy;
        }
        */
        // if the ball hits left 1/3 part of the paddle dy = -dy AND dx--
        // if ball hits middle 1/3 part dy = -dy
        // if ball hits right 1/3 part dy = -dy AND dx++
        if(ball.x > paddleX && ball.x < paddleX + (paddleWidth/3)) {
            dx--;
            dy = -dy;
        }else if(ball.x > paddleX + (paddleWidth/3) && ball.x < paddleX + (paddleWidth*2/3)) {
            dy = -dy;
        }else if(ball.x > paddleX + (paddleWidth*2/3) && ball.x < paddleX + paddleWidth) {
            dx++;
            dy = -dy;
        }
        // check dx value to verify
//      console.log(dx)
    }
    // game-over condition: passing through the bottom floor
    if (ball.y + dy > CANVAS_HEIGHT) {
        LIVES--;
        // check for player lives to decide next frame
        if(!LIVES) {
            // stop the ball movement
            // move ball out of canvas
            dx = 0;
            dy = 0;
            ball.x = -20;
            ball.y = -20;

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
        } else {
            // reset game to initial state
            ball.x = CANVAS_WIDTH /2;
            ball.y = CANVAS_HEIGHT - 30;
            dx = 2;
            dy = -2;
            paddleX = (CANVAS_WIDTH - paddleWidth)/2;
        }
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
    drawScore();
    drawLives();

    movePaddle();
    drawPaddle();
    drawBall();
    collisionCheck();
    ball.x += dx;
    ball.y += dy;

}

/*
MAYBE...

> add flag to determine when to change main function? => print `congratulations` or `game over` instead of appending html & stop paddle and ball
> js moduling
> different colors for the paddle parts
> different scores for certain bricks (need to modify game clear condition as well)
> background image?
> improve collision detection with paddle and bricks
> clean this messy code
> clean variables?
> define functions for repetetive operations
> start the game with ball falling on paddle instead of flying up
*/

window.requestAnimationFrame(draw);