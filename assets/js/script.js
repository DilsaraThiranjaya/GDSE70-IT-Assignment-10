$(document).ready(function () {
  // ========================================== Variables ==========================================

  const soundBtn = $("#sound-btn");
  const pauseBtn = $("#pause-btn");
  const repeatBtn = $("#repeat-btn");
  const introPlayBtn = $("#intro-play-btn");
  const playAgainBtn = $("#play-again-btn");
  const mainMenuBtn = $("#main-menu-btn");
  const nextLevelBtn = $("#next-level-btn");

  const userCar = $("#car-1");
  const otherCar1 = $("#car-2");
  const otherCar2 = $("#car-3");

  let gameWidth = $(window).width();
  let gameHeight = $(window).height();
  let roadWidth = 490;
  let level = 1;
  let unlockedLevels = 1;
  let score = 0;
  let gameTime = 0;
  let carSpeed = 1;
  let gameRunning = false;

  let highestScore = [0, 0, 0, 0];

  let roadSpeed;
  let scoreInterval;
  let gameDuration;
  let stars;

  let moveRoadLoop;
  let gameTimeLoop;
  let updateScoreLoop;
  let moveInterval;
  let spawnInterval;

  // Car Movement Variables
  let moveLeft = false;
  let moveRight = false;
  let moveUp = false;
  let moveDown = false;

  const bgMusic = new Audio("/assets/audio/Bg-music.mp3");

  // ========================================== Initialization ==========================================

  bgMusic.loop = true;
  bgMusic.volume = 0;

  bgMusic
    .play()
    .then(() => {
      setTimeout(() => {
        bgMusic.volume = 0.5;
      }, 6000);
    })
    .catch(() => {
      $("#sound-btn img").attr(
        "src",
        "/assets/images/UI/SoundOff/Default@2x.png"
      );
      bgMusic.volume = 0.5;
      bgMusic.pause();
    });

  setTimeout(() => {
    $("#dt-games-logo").addClass("d-none");
    $("#speed-shifter-intro").removeClass("d-none");
    $("#sound-button-container").removeClass("d-none");
  }, 6000);

  initializeLevels();

  // ========================================== Hover ==========================================

  soundBtn.hover(
    function () {
      // Mouse enter
      if (bgMusic.paused) {
        $("#sound-btn img").attr(
          "src",
          "/assets/images/UI/SoundOff/Hover@2x.png"
        );
      } else {
        $("#sound-btn img").attr(
          "src",
          "/assets/images/UI/SoundOn/Hover@2x.png"
        );
      }
    },
    function () {
      // Mouse leave
      if (bgMusic.paused) {
        $("#sound-btn img").attr(
          "src",
          "/assets/images/UI/SoundOff/Default@2x.png"
        );
      } else {
        $("#sound-btn img").attr(
          "src",
          "/assets/images/UI/SoundOn/Default@2x.png"
        );
      }
    }
  );

  pauseBtn.hover(
    function () {
      // Mouse enter
      if (gameRunning) {
        $("#pause-btn img").attr("src", "/assets/images/UI/Pause/Hover@2x.png");
      } else {
        $("#pause-btn img").attr("src", "/assets/images/UI/Play/Hover@2x.png");
      }
    },
    function () {
      // Mouse leave
      if (gameRunning) {
        $("#pause-btn img").attr(
          "src",
          "/assets/images/UI/Pause/Default@2x.png"
        );
      } else {
        $("#pause-btn img").attr(
          "src",
          "/assets/images/UI/Play/Default@2x.png"
        );
      }
    }
  );

  repeatBtn.hover(
    function () {
      // Mouse enter
      $("#repeat-btn img").attr("src", "/assets/images/UI/Repeat/Hover@2x.png");
    },
    function () {
      // Mouse leave
      $("#repeat-btn img").attr(
        "src",
        "/assets/images/UI/Repeat/Default@2x.png"
      );
    }
  );

  introPlayBtn.hover(
    function () {
      // Mouse enter
      $("#intro-play-btn img").attr(
        "src",
        "/assets/images/UI/PlayText/Hover@2x.png"
      );
    },
    function () {
      // Mouse leave
      $("#intro-play-btn img").attr(
        "src",
        "/assets/images/UI/PlayText/Default@2x.png"
      );
    }
  );

  $("#levels button").hover(
    function () {
      // Mouse enter
      if (!$(this).hasClass("active")) {
        if ($(this).val() <= unlockedLevels) {
          $(this)
            .find("img")
            .attr("src", "/assets/images/UI/Levels/Unlocked/Hover@2x.png");
        } else {
          $(this)
            .find("img")
            .attr("src", "/assets/images/UI/Levels/Locked/Hover@2x.png");
        }
      }
    },
    function () {
      // Mouse leave
      if (!$(this).hasClass("active")) {
        if ($(this).val() <= unlockedLevels) {
          $(this)
            .find("img")
            .attr("src", "/assets/images/UI/Levels/Unlocked/Default@2x.png");
        } else {
          $(this)
            .find("img")
            .attr("src", "/assets/images/UI/Levels/Locked/Default@2x.png");
        }
      }
    }
  );

  // ========================================== Events ==========================================

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

  pauseBtn.click(function () {
    if (gameRunning) {
      clearInterval(moveRoadLoop);
      clearInterval(gameTimeLoop);
      clearInterval(updateScoreLoop);
      clearInterval(gameDurationLoop);
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
      gameRunning = false;
      $("#pause-btn img").attr("src", "/assets/images/UI/Play/Default@2x.png");
    } else {
      moveRoadLoop = setInterval(moveRoad, roadSpeed);
      gameTimeLoop = setInterval(updateGameTime, 1000);
      updateScoreLoop = setInterval(() => updateScore(1), scoreInterval);
      moveInterval = setInterval(gameLoop, roadSpeed / 2);
      spawnInterval = setInterval(spawnRandomCars, 3000);

      gameDurationLoop = setTimeout(() => {
        showGameOverBoard();
      }, gameDuration - gameTime * 1000);
      gameRunning = true;
      $("#pause-btn img").attr("src", "/assets/images/UI/Pause/Default@2x.png");
    }
  });

  repeatBtn.click(function () {
    clearInterval(moveRoadLoop);
    clearInterval(gameTimeLoop);
    clearInterval(updateScoreLoop);
    clearInterval(gameDurationLoop);
    clearInterval(moveInterval);
    clearInterval(spawnInterval);
    gameRunning = false;
    $("#pause-btn img").attr("src", "/assets/images/UI/Play/Default@2x.png");
  });

  $("#confirmPlayAgain").click(function () {
    $("#pause-btn img").attr("src", "/assets/images/UI/Pause/Default@2x.png");
    gameRunning = true;
    resetGame();
    playGame();
  });

  introPlayBtn.click(function () {
    $("#speed-shifter-intro").addClass("d-none");
    $("#game-play").removeClass("d-none");
    resetGame();
    playGame();
    gameRunning = true;
  });

  playAgainBtn.click(function () {
    gameRunning = true;
    resetGame();
    playGame();
  });

  mainMenuBtn.click(function () {
    gameRunning = false;
    initializeLevels();
    resetGame();
    $("#speed-shifter-intro").removeClass("d-none");
    $("#game-play").addClass("d-none");
  });

  nextLevelBtn.click(function () {
    if (level < 4) {
      level++;
    }

    gameRunning = true;
    resetGame();
    playGame();
  });

  $(".toggle-btn").click(function () {
    // Check if the button is locked
    if ($(this).val() > unlockedLevels) {
      return; // Exit the function early if the level is locked
    } else {
      // Proceed with the logic for unlocked buttons
      const activeElements = $(".active").toArray();

      $(activeElements[0])
        .find("img")
        .attr("src", "/assets/images/UI/Levels/Unlocked/Default@2x.png");

      // Remove the active class from all buttons
      $(".toggle-btn").removeClass("active");

      // Add the active class to the clicked button
      $(this).addClass("active");
      $(this)
        .find("img")
        .attr("src", "/assets/images/UI/Levels/Unlocked/Hover@2x.png");

      level = parseInt($(this).val(), 10);
    }
  });

  // Keyboard Controls
  $(document).on("keydown", function (e) {
    if (!gameRunning) return;

    switch (e.key) {
      case "ArrowLeft":
        moveLeft = true;
        break;
      case "ArrowRight":
        moveRight = true;
        break;
      case "ArrowUp":
        moveUp = true;
        break;
      case "ArrowDown":
        moveDown = true;
        break;
    }
  });

  $(document).on("keyup", function (e) {
    switch (e.key) {
      case "ArrowLeft":
        moveLeft = false;
        break;
      case "ArrowRight":
        moveRight = false;
        break;
      case "ArrowUp":
        moveUp = false;
        break;
      case "ArrowDown":
        moveDown = false;
        break;
    }
  });

  // ========================================== Functions ==========================================

  function initializeLevels() {
    $("#level-1-btn").addClass("active");

    switch (unlockedLevels) {
      case 1:
        $("#level-1-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Hover@2x.png"
        );
        $("#level-2-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        $("#level-3-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        $("#level-4-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        break;
      case 2:
        $("#level-1-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Hover@2x.png"
        );
        $("#level-2-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-2-btn span").text("2");
        $("#level-3-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        $("#level-4-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        break;
      case 3:
        $("#level-1-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Hover@2x.png"
        );
        $("#level-2-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-2-btn span").text("2");
        $("#level-3-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-3-btn span").text("3");
        $("#level-4-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Locked/Default@2x.png"
        );
        break;
      case 4:
        $("#level-1-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Hover@2x.png"
        );
        $("#level-2-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-2-btn span").text("2");
        $("#level-3-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-3-btn span").text("3");
        $("#level-4-btn img").attr(
          "src",
          "/assets/images/UI/Levels/Unlocked/Default@2x.png"
        );
        $("#level-4-btn span").text("4");
        break;
    }
  }

  function playGame() {
    switch (level) {
      case 1:
        roadSpeed = 50;
        scoreInterval = 1000;
        gameDuration = 10000; //60000
        break;
      case 2:
        roadSpeed = 30;
        scoreInterval = 1500;
        gameDuration = 15000; //90000
        break;
      case 3:
        roadSpeed = 20;
        scoreInterval = 2000;
        gameDuration = 20000; //120000
        break;
      case 4:
        roadSpeed = 10;
        scoreInterval = 2500;
        gameDuration = 25000; //150000
        break;
    }

    setTimeout(() => {
      $("#countdown").addClass("d-none");
      moveRoadLoop = setInterval(moveRoad, roadSpeed);
      gameTimeLoop = setInterval(updateGameTime, 1000);
      updateScoreLoop = setInterval(() => updateScore(1), scoreInterval);
      moveInterval = setInterval(gameLoop, roadSpeed / 2);
      spawnInterval = setInterval(spawnRandomCars, 3000);
      $("#pause-button-container").removeClass("d-none");
      $("#repeat-button-container").removeClass("d-none");
    }, 4000);

    gameDurationLoop = setTimeout(() => {
      showGameOverBoard();
    }, gameDuration + 5000);
  }

  function updateScore(points) {
    score += points;
    $("#score").text(score);
  }

  function updateGameTime() {
    gameTime++;
    $("#game-time").text(formatTime(gameTime));
  }

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  function resetGame() {
    // Center the user car horizontally and place at bottom of screen
    userCar.css({
      left: gameWidth / 2 - userCar.width(),
      top: gameHeight - userCar.height() - 50,
    });

    // Reset other cars to top of screen with random horizontal positions
    otherCar1.css({
      left: Math.random() * (gameWidth - otherCar1.width()),
      top: -otherCar1.height(),
    });

    otherCar2.css({
      left: Math.random() * (gameWidth - otherCar2.width()),
      top: -otherCar2.height(),
    });

    // Clear all existing intervals to prevent multiple timers
    clearInterval(moveRoadLoop);
    clearInterval(gameTimeLoop);
    clearInterval(updateScoreLoop);
    clearInterval(moveInterval);
    clearInterval(spawnInterval);

    // Reset game state variables
    score = 0;
    gameTime = 0;
    gameRunning = false; // Explicitly set game state to not running

    // Reset UI elements
    $("#score").text(score);
    $("#game-time").text("00:00");

    // Reset star displays
    $("#stars-0, #stars-1, #stars-2, #stars-3").addClass("d-none");

    // Show countdown, hide game over elements
    $("#countdown").removeClass("d-none");
    $("#game-over-overlay").addClass("d-none");
    $("#game-over-board").addClass("d-none");

    // Hide control buttons
    $("#pause-button-container").addClass("d-none");
    $("#repeat-button-container").addClass("d-none");
    $("#next-level-btn").addClass("d-none"); // Hide next level button
  }

  // Road Movement
  function moveRoad() {
    $(".road").each(function () {
      // Get the current top position
      let currentTop = parseFloat($(this).css("top"));
      // Calculate the new position
      let newTop = currentTop + 5; // Move down 10 pixels per frame
      // Reset the position when the image moves out of view
      if (newTop >= $(window).height() * 2) {
        newTop = -$(window).height() + 5; // Reset to just above the viewport
      }
      // Apply the new position
      $(this).css("top", `${newTop}px`);
    });
  }

  function showGameOverBoard() {
    clearInterval(moveRoadLoop);
    clearInterval(gameTimeLoop);
    clearInterval(updateScoreLoop);
    clearInterval(gameDurationLoop);
    clearInterval(moveInterval);
    clearInterval(spawnInterval);

    gameRunning = false;

    $("#pause-button-container").addClass("d-none");
    $("#repeat-button-container").addClass("d-none");

    $("#final-score").text(score); // Display the final score
    $("#highest-score").text(highestScore[level - 1]); // Display the highest score
    $("#current-level").text(level); // Display the current level

    // Save highest score if beaten
    if (score > highestScore[level - 1]) {
      highestScore[level - 1] = score;
    }

    let compareScore = gameDuration / scoreInterval / 4;

    if (score >= compareScore * 3) {
      stars = 3;
    } else if (score >= compareScore * 2) {
      stars = 2;
    } else if (score >= compareScore) {
      stars = 1;
    } else {
      stars = 0;
    }

    // Display stars
    switch (stars) {
      case 0:
        $("#stars-0").removeClass("d-none");
        break;
      case 1:
        $("#stars-1").removeClass("d-none");
        break;
      case 2:
        $("#stars-2").removeClass("d-none");
        break;
      case 3:
        $("#stars-3").removeClass("d-none");
        break;
    }

    if (stars > 0) {
      switch (level) {
        case 1:
          unlockedLevels = 2;
          break;
        case 2:
          unlockedLevels = 3;
          break;
        case 3:
          unlockedLevels = 4;
          break;
      }
      $("#next-level-btn").removeClass("d-none");
    }

    if (level === 4) {
      $("#next-level-btn").addClass("d-none");
    }

    // Show the game over board
    $("#game-over-overlay").removeClass("d-none");
    $("#game-over-board").removeClass("d-none");
  }

  // Car Movement Function
  function moveUserCar() {
    let currentLeft = parseInt(userCar.css("left"));
    let currentTop = parseInt(userCar.css("top"));

    if (moveLeft && currentLeft > 0) {
      userCar.css("left", currentLeft - carSpeed);
    }
    if (moveRight && currentLeft < gameWidth - userCar.width()) {
      userCar.css("left", currentLeft + carSpeed);
    }
    if (moveUp && currentTop > 0) {
      userCar.css("top", currentTop - carSpeed);
    }
    if (moveDown && currentTop < gameHeight - userCar.height()) {
      userCar.css("top", currentTop + carSpeed);
    }
  }

  // Random Car Spawning
  // function spawnRandomCars() {
  //   const cars = [otherCar1, otherCar2];

  //   cars.forEach((car) => {
  //     let currentTop = parseInt(car.css("top"));

  //     // If car is out of view, reset its position
  //     if (currentTop > gameHeight) {
  //       // Random vertical start point above the screen
  //       let randomVerticalStart = -car.height() - Math.random() * gameHeight;

  //       car.css("top", randomVerticalStart);
  //       car.css("left", Math.random() * (gameWidth - car.width()));
  //     } else {
  //       car.css("top", currentTop + roadSpeed);
  //     }
  //   });
  // }
  function spawnRandomCars() {
    const cars = [otherCar1, otherCar2];

    cars.forEach((car) => {
      let currentTop = parseInt(car.css("top"));

      // If car is out of view, reset its position and randomize horizontal position
      if (currentTop > gameHeight) {
        let attempts = 0;
        let collision, newLeft;

        do {
          // Ensure car stays fully within viewport
          newLeft = Math.floor(Math.random() * (gameWidth - car.width()));
          car.css("left", newLeft);
          car.css("top", -car.height());

          // Check collision with the other car
          collision = cars.some((otherCar) => {
            if (otherCar !== car) {
              return checkCollision(car, otherCar);
            }
            return false;
          });

          attempts++;

          // Prevent infinite loop
          if (attempts > 10) {
            // Force a position if too many attempts
            newLeft = Math.floor(gameWidth / 2);
            car.css("left", newLeft);
            break;
          }
        } while (collision);
      } else {
        car.css("top", currentTop + roadSpeed);
      }
    });
  }

  // Collision Detection
  function checkCollision(car1, car2) {
    const rect1 = car1[0].getBoundingClientRect();
    const rect2 = car2[0].getBoundingClientRect();

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  // Game Loop
  function gameLoop() {
    if (!gameRunning) return;

    moveUserCar();
    spawnRandomCars();
    moveRoad();

    // Check collision with other cars
    if (
      checkCollision(userCar, otherCar1) ||
      checkCollision(userCar, otherCar2)
    ) {
      showGameOverBoard();
    }
  }
});
