let imagesData = [];
let boxes = [];
let result = "";
let question = 'Which image represents "work with technology"?';
let correctLabel;
let timeLimit = 10;
let timeLeft;
let points = 0;
let level = 1;
let badge = "";
let gameActive = true;
let numImages = 30;
let imagesToDisplay = 6; // Number shown per round

function preload() {
  for (let i = 1; i <= numImages; i++) {
    let label = "Image " + i;
    let filename = `brush${i}.jpg`;
    let img = loadImage(filename);
    imagesData.push({ filename, label, img });
  }
}

function setup() {
  createCanvas(1000, 600);
  textAlign(CENTER, CENTER);
  imageMode(CORNER);
  textSize(20);
  frameRate(30);
  startLevel();
}

function startLevel() {
  boxes = [];
  result = "";
  gameActive = true;
  timeLeft = timeLimit * 30;

  let selectedImages = shuffle(imagesData).slice(0, imagesToDisplay);
  let correctIndex = floor(random(selectedImages.length));
  correctLabel = selectedImages[correctIndex].label;

  for (let i = 0; i < selectedImages.length; i++) {
    selectedImages[i].isWork = (i === correctIndex);
  }

  let spacing = width / imagesToDisplay;

  for (let i = 0; i < selectedImages.length; i++) {
    boxes.push({
      img: selectedImages[i].img,
      label: selectedImages[i].label,
      isWork: selectedImages[i].isWork,
      x: i * spacing + spacing / 2 - 60,
      y: height / 2 - 60,
      w: 120,
      h: 120
    });
  }
}

function draw() {
  background(240);

  if (gameActive) {
    timeLeft--;
    if (timeLeft <= 0) {
      result = "⏱ Time's Up!";
      gameActive = false;
    }
  }

  fill(0);
  textSize(24);
  text(`Level ${level} — ${question}`, width / 2, 40);

  for (let box of boxes) {
    image(box.img, box.x, box.y, box.w, box.h);
  }

  if (result) {
    textSize(28);
    fill(result === "You Win!" ? "green" : "red");
    text(result, width / 2, height - 60);
  }

  // Timer and points
  textSize(18);
  fill(0);
  text(`⏳ ${Math.ceil(timeLeft / 30)}s`, width - 60, 30);
  text(`⭐ Points: ${points}`, 100, 30);
  if (badge) {
    text(`🏅 Badge: ${badge}`, width / 2, height - 20);
  }
}

function mousePressed() {
  if (!gameActive) return;

  for (let box of boxes) {
    if (
      mouseX > box.x &&
      mouseX < box.x + box.w &&
      mouseY > box.y &&
      mouseY < box.y + box.h
    ) {
      if (box.isWork) {
        result = "You Win!";
        gameActive = false;
        let bonus = Math.ceil(timeLeft / 30) * 10;
        points += bonus;

        // Badge logic
        if (points >= 300 && !badge) badge = "Work Wizard";
        else if (points >= 150 && !badge) badge = "Productivity Pro";
        else if (points >= 75 && !badge) badge = "Office Rookie";

        setTimeout(() => {
          level++;
          startLevel();
        }, 1000);
      } else {
        result = "❌ Try Again!";
      }
      break;
    }
  }
}
