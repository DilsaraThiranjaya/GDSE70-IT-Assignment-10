$(document).ready(function () {
  // ========================================== Variables ==========================================
  const userCar = $("#car-1");
  const soundBtn = $("#sound-btn");
  const pauseBtn = $("#pause-btn");
  const repeatBtn = $("#repeat-btn");
  const gameOverBoard = $("#game-over-board");
  const finalScore = $("#final-score");
  const gameOverOverlay = $("#game-over-overlay");

  let gameInterval;
  let obstacles = [];
  let score = 0;
  let gameRunning = false;
  let bgMusic = new Audio("/assets/audio/Bg-music.mp3");

  // Start the game
  function startGame() {
    gameRunning = true;
    score = 0;
    obstacles = [];
    gameOverBoard.addClass("d-none");
    gameOverOverlay.addClass("d-none");
    userCar.css({ top: "80vh", left: "50vw" }); // Reset user car position
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play();

    gameInterval = setInterval(function () {
      spawnObstacle();
      moveObstacles();
      checkCollision();
      score++; // Increment score over time
      $("#score").text(score); // Update score display
    }, 1000); // Adjust interval as needed
  }

  // Spawn obstacles
  function spawnObstacle() {
    const carType = Math.random() < 0.5 ? "car-other-1" : "car-other-2"; // Randomly choose car type
    const obstacle = $(
      `<img class="${carType} car position-absolute" src="/assets/images/${carType}.png">`
    );
    const randomX = Math.random() * (window.innerWidth - 100); // Adjust for car width
    obstacle.css({ left: randomX, top: "-100px" }); // Start above the screen
    $("#game-play").append(obstacle);
    obstacles.push(obstacle); // Add to obstacles array
  }

  // Move obstacles down
  function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
      let currentTop = parseFloat(obstacle.css("top"));
      obstacle.css("top", currentTop + 5); // Move down

      // Remove obstacle if it goes out of view
      if (currentTop > window.innerHeight) {
        obstacle.remove();
        obstacles.splice(index, 1); // Remove from array
      }
    });
  }

  // Check for collisions
  function checkCollision() {
    const userCarRect = userCar[0].getBoundingClientRect();
    obstacles.forEach((obstacle) => {
      const obstacleRect = obstacle[0].getBoundingClientRect();
      if (
        userCarRect.x < obstacleRect.x + obstacleRect.width &&
        userCarRect.x + userCarRect.width > obstacleRect.x &&
        userCarRect.y < obstacleRect.y + obstacleRect.height &&
        userCarRect.y + userCarRect.height > obstacleRect.y
      ) {
        gameOver();
      }
    });
  }

  // Handle game over
  function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    bgMusic.pause();
    finalScore.text(score); // Display final score
    gameOverOverlay.removeClass("d-none");
    gameOverBoard.removeClass("d-none");
  }

  // Control user car movement
  $(document).keydown(function (e) {
    if (gameRunning) {
      const userCarPosition = userCar.position();
      switch (e.which) {
        case 37: // left arrow
          if (userCarPosition.left > 0) {
            userCar.css("left", userCarPosition.left - 10);
          }
          break;
        case 38: // up arrow
          if (userCarPosition.top > 0) {
            userCar.css("top", userCarPosition.top - 10);
          }
          break;
        case 39: // right arrow
          if (userCarPosition.left < $(window).width() - userCar.width()) {
            userCar.css("left", userCarPosition.left + 10);
          }
          break;
        case 40: // down arrow
          if (userCarPosition.top < $(window).height() - userCar.height()) {
            userCar.css("top", userCarPosition.top + 10);
          }
          break;
      }
    }
  });

  // Sound button click event
  soundBtn.click(function () {
    if (bgMusic.paused) {
      bgMusic.play();
      $("#sound-btn img").attr(
        "src",
        "/assets/images/UI/SoundOn/Default@2x.png"
      );
    } else {
      bgMusic.pause();
      $("#sound-btn img").attr(
        "src",
        "/assets/images/UI/SoundOff/Default@2x.png"
      );
    }
  });

  // Pause button click event
  pauseBtn.click(function () {
    if (gameRunning) {
      clearInterval(gameInterval);
      gameRunning = false;
      bgMusic.pause();
      $(this).find("img").attr("src", "/assets/images/UI/Pause/Default@2x.png");
    } else {
      startGame(); // Restart the game if it was paused
      $(this).find("img").attr("src", "/assets/images/UI/Pause/Hover@2x.png");
    }
  });

  // Repeat button click event
  repeatBtn.click(function () {
    location.reload(); // Reload the page to restart the game
  });

  // Hover effects for pause and repeat buttons
  pauseBtn.hover(
    function () {
      if (gameRunning) {
        $(this).find("img").attr("src", "/assets/images/UI/Pause/Hover@2x.png");
      }
    },
    function () {
      if (gameRunning) {
        $(this)
          .find("img")
          .attr("src", "/assets/images/UI/Pause/Default@2x.png");
      }
    }
  );

  repeatBtn.hover(
    function () {
      $(this).find("img").attr("src", "/assets/images/UI/Repeat/Hover@2x.png");
    },
    function () {
      $(this)
        .find("img")
        .attr("src", "/assets/images/UI/Repeat/Default@2x.png");
    }
  );

  // Start the game when the play button is clicked
  $("#intro-play-btn").click(function () {
    $("#speed-shifter-intro").addClass("d-none");
    $("#game-play").removeClass("d-none");
    startGame(); // Start the game
  });
});
