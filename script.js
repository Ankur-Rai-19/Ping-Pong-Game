var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");

/* Getting the element with the id "message" and storing it in the variable "message". */
var message = document.getElementById("message");

//this is function to creating audio object
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}
/* Audio when ball touch the rod */
var touch = new sound("POOL-Pool_Shot-709343898.wav");

/* Declaring constants. */
const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

/* Declaring variables. */
let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

/* A variable that is used to check if the game is on or not. */
let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === "null" || maxScore === "null") {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = "Rod1";
    } else {
        alert(rod + " has maximum score of " + maxScore * 100);
    }

    resetBoard(rod);
})();

/**
 * It resets the board to the starting position
 * @param rodName - The name of the rod that lost the game.
 */
function resetBoard(rodName) {
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

    // Losing player gets the ball
    if (rodName === rod2Name) {
        ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;
}

/* It stores the winner of the game in local storage, and then alerts the winner of the game */
function storeWin(rod, score) {
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(movement);
    resetBoard(rod);

    alert(
        rod +
            " wins with a score of " +
            score * 100 +
            ". Max score is: " +
            maxScore * 100
    );
}

/* A function that is called when a key is pressed. */
window.addEventListener("keypress", function () {
    let rodSpeed = 20;

    /* Getting the position of the rod. */
    let rodRect = rod1.getBoundingClientRect();

    /* Moving the rod left and right. */
    if (
        event.code === "KeyD" &&
        rodRect.x + rodRect.width < window.innerWidth
    ) {
        rod1.style.left = rodRect.x + rodSpeed + "px";
        rod2.style.left = rod1.style.left;
    } else if (event.code === "KeyA" && rodRect.x > 0) {
        rod1.style.left = rodRect.x - rodSpeed + "px";
        rod2.style.left = rod1.style.left;
    }

    /* A function that is called when a key is pressed. */
    if (event.code === "Space") {
        message.style.visibility = "hidden";
        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            movement = setInterval(function () {
                // Move ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + "px";
                ball.style.top = ballY + "px";

                /* Checking if the ball is touching the left or right side of the window. If it is, then it reverses the direction of the ball. */
                if (ballX + ballDia > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                /* It specifies the center of the ball on the viewport. */
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                /* Checking if the ball is touching the rod. If it is, then it reverses the direction of the ball. */
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY;
                    score++;
                    touch.play();

                    // Check if the game ends
                    if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
                        storeWin(rod2Name, score);
                        message.style.visibility = "visible";
                    }
                }

                // Check for Rod 2
                else if (ballY + ballDia >= windowHeight - rod2Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;
                    touch.play();

                    // Check if the game ends
                    if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
                        storeWin(rod1Name, score);
                        message.style.visibility = "visible";
                    }
                }
            }, 10);
        }
    }
});
