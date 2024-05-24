const gameContainer = document.getElementById('game-container');
const image = document.getElementById('image');
const timerElement = document.getElementById('timer'); // Added timer element
const lasers = [];
const rocks = [];
const maxRocks = 10; // Adjust this value to control the maximum number of rocks
let shooting = false; // Flag to track laser shooting
let startTime = null; // Added startTime for the timer
let score = 0; // Added score variable

// Function to start the timer
function startTimer() {
    startTime = new Date().getTime();
    setInterval(updateTimer, 100); // Update the timer every 100 milliseconds
}

// Function to update the timer
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
    timerElement.textContent = `Time: ${elapsedTime.toFixed(1)}s`; // Update the timer text
    score = elapsedTime.toFixed(1); // Update the score
}

// Initial position and rotation for the X-wing
let posX = 0;
let posY = 0;
let rotation = 0; // Initial rotation (0 degrees)
const moveAmount = 4; // Adjust this value to change the movement speed
const laserSpeed = 7; // Adjust this value to change the laser speed
const arrowKeysPressed = {};

// Function to move the X-wing and handle rotations
function update() {
    let moveX = 0;
    let moveY = 0;

    if ('ArrowUp' in arrowKeysPressed) {
        moveY -= moveAmount;
    }
    if ('ArrowDown' in arrowKeysPressed) {
        moveY += moveAmount;
    }
    if ('ArrowLeft' in arrowKeysPressed) {
        moveX -= moveAmount;
    }
    if ('ArrowRight' in arrowKeysPressed) {
        moveX += moveAmount;
    }

    if (moveX !== 0 || moveY !== 0) {
        rotation = (Math.atan2(moveY, moveX) * 180) / Math.PI + 90;
    }

    posX += moveX;
    posY += moveY;

    // Check for collision with rocks
    for (const rock of rocks) {
        if (checkCollision(image, rock)) {
            // Display a message on collision with the score
            alert(`Game Over\nYour Score: ${score}`);
            location.reload(); // Refresh the page
        }
    }

    image.style.left = posX + 'px';
    image.style.top = posY + 'px';
    image.style.transform = `rotate(${rotation}deg)`;

    requestAnimationFrame(update);
}

// Function to check collision between two elements
function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// Function to create a new rock
function createRock() {
    const rock = document.createElement('div');
    rock.classList.add('rock');

    // Set the initial position for the rock
    const initialX = Math.random() * window.innerWidth;
    rock.style.left = initialX + 'px';
    rock.style.top = '-20px';

    gameContainer.appendChild(rock);
    rocks.push(rock);

    requestAnimationFrame(moveRocks);
}

// Function to move the rocks and remove them when they go out of the viewport
function moveRocks() {
    for (let i = 0; i < rocks.length; i++) {
        const rock = rocks[i];
        const currentY = parseFloat(rock.style.top);

        // Move the rock downward
        rock.style.top = currentY + 1 + 'px'; // Adjust the speed

        // Check if the rock is out of the viewport
        if (currentY > window.innerHeight) {
            gameContainer.removeChild(rock);
            rocks.splice(i, 1);
            i--; // Decrement the index since the array length has changed
        }
    }

    requestAnimationFrame(moveRocks);
}

// Function to create a rotating laser
function createLaser() {
    const laser = document.createElement('div');
    laser.classList.add('laser');

    // Set the initial position for the laser based on X-wing rotation
    const laserX = posX + 15; // Adjust for laser position
    const laserY = posY;
    laser.style.left = laserX + 'px';
    laser.style.top = laserY + 'px';
    laser.style.transform = `rotate(${rotation}deg)`; // Rotate the laser

    gameContainer.appendChild(laser);
    lasers.push({ element: laser, direction: rotation }); // Store the direction of the laser

    // Move the rotating laser
    function moveLaser(laserObj) {
        const currentX = parseFloat(laserObj.element.style.left);
        const currentY = parseFloat(laserObj.element.style.top);

        const newX = currentX + Math.cos((laserObj.direction - 90) * (Math.PI / 180)) * laserSpeed;
        const newY = currentY + Math.sin((laserObj.direction - 90) * (Math.PI / 180)) * laserSpeed;

        // Check if the laser is out of the viewport
        if (newX < 0 || newX > window.innerWidth || newY < 0 || newY > window.innerHeight) {
            gameContainer.removeChild(laserObj.element);
            lasers.splice(lasers.indexOf(laserObj), 1);
        } else {
            laserObj.element.style.left = newX + 'px';
            laserObj.element.style.top = newY + 'px';
            requestAnimationFrame(() => moveLaser(laserObj));
        }
    }

    moveLaser(lasers[lasers.length - 1]);
}

// Event listener to track arrow key presses and releases for the X-wing
document.addEventListener('keydown', (event) => {
    arrowKeysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    delete arrowKeysPressed[event.key];
});

// Event listener for shooting a laser
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !shooting) {
        shooting = true;
        createLaser();
    }
});

// Event listener for releasing the spacebar (stops shooting)
document.addEventListener('keyup', (event) => {
    if (event.key === ' ') {
        shooting = false;
    }
});

// Start the X-wing movement
requestAnimationFrame(update);

// Start creating rocks with a shorter interval
setInterval(createRock, 500); // Adjust the interval as needed

// Event listener for starting the timer when the game starts
startTimer();

  // Function to play music when the "M" key is pressed
  document.addEventListener("keydown", function(event) {
    if (event.key === "M" || event.key === "m") {
        var music = document.getElementById("music");
        if (music.paused) {
            music.play();
        } else {
            music.pause();
            music.currentTime = 0; // Rewind to the beginning
        }
    }
});