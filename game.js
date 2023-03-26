let rate = 20;
let fruitTypeIndex = 0;
let fruitVariantIndex = 0;
let snakeColorIndex = 0;
let frameCount = 0;
let animationFrame = 0;

const fruitsToInclude = [5, 7, 9, 11, 16, 27];
const snakeColors = [
  '#D8D8D8',
  '#66347F',
  '#9E4784',
  '#D27685',
  '#408E91',
  '#37306B',
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bitsize = 16;
const scale = 1.6;

const defaultSize = bitsize * scale;

let dx = 16;
let dy = 16;

const fruits = new Image();
fruits.src = './assets/fruit.png';

const Directions = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

const directionMap = {
  [Directions.ArrowDown]: [0, 1],
  [Directions.ArrowUp]: [0, -1],
  [Directions.ArrowLeft]: [-1, 0],
  [Directions.ArrowRight]: [1, 0],
};

const restrictedMovements = {
  [Directions.ArrowDown]: Directions.ArrowUp,
  [Directions.ArrowUp]: Directions.ArrowDown,
  [Directions.ArrowLeft]: Directions.ArrowRight,
  [Directions.ArrowRight]: Directions.ArrowLeft,
};

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

onload = () => {
  animate();
};

function animate() {
  setInterval(loop, 1000 / rate);
}

function loop() {
  update();
  draw();
}

function createRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  eat();
  checkBoundaries();
}

function draw() {
  createRect(0, 0, canvas.width, canvas.height, 'black');

  for (let i = 0; i < snake.tail.length; i++) {
    createRect(
      snake.tail[i].x,
      snake.tail[i].y,
      snake.size,
      snake.size,
      snakeColors[snakeColorIndex]
    );
  }

  drawFrame(fruitsToInclude[fruitTypeIndex], fruitVariantIndex);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#D8D8D8';
  ctx.fillText('Score: ' + (snake.tail.length - 1), 18, 18);

  frameCount = frameCount === 100 ? 0 : frameCount + 1;
}

function drawFrame(fruitType, fruitVariant) {
  ctx.drawImage(
    fruits,
    dx * fruitType,
    dy * fruitVariant,
    bitsize,
    bitsize,
    food.x,
    food.y,
    defaultSize,
    defaultSize
  );
}

function checkBoundaries() {
  const tail = snake.tail[snake.tail.length - 1];

  if (tail.x === -snake.size) {
    tail.x = canvas.width - snake.size;
  } else if (tail.x === canvas.width) {
    tail.x = 0;
  } else if (tail.y === -snake.size) {
    tail.y = canvas.height - snake.size;
  } else if (tail.y === canvas.height) {
    tail.y = 0;
  }
}

function eat() {
  for (let i = 0; i < snake.tail.length; i++) {
    const tail = snake.tail[i];
    if (tail.x === food.x && tail.y === food.y) {
      let newSnakeColorIndex = randomNumberBetween(0, 5);
      while (snakeColorIndex === newSnakeColorIndex) {
        newSnakeColorIndex = randomNumberBetween(0, 5);
      }
      snakeColorIndex = newSnakeColorIndex;
      snake.tail.push({ x: food.x, y: food.y });
      food = new Food();
    }
  }
}

class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: this.x, y: this.y }];
    this.direction = Directions.ArrowUp;
    this.speed = 5;
  }

  move() {
    const piece = {
      x:
        this.tail[this.tail.length - 1].x +
        this.size * directionMap[this.direction][0],
      y:
        this.tail[this.tail.length - 1].y +
        this.size * directionMap[this.direction][1],
    };

    this.tail.shift();
    this.tail.push(piece);
  }
}

class Food {
  constructor() {
    this.x =
      Math.floor((Math.random() * canvas.width) / snake.size) * snake.size;
    this.y =
      Math.floor((Math.random() * canvas.height) / snake.size) * snake.size;
    this.size = snake.size;
    this.color = 'red';
    fruitTypeIndex = randomNumberBetween(0, 5);
    fruitVariantIndex = randomNumberBetween(0, 5);
  }
}

addEventListener('keydown', (e) =>
  setTimeout(() => {
    const shouldUpdateDirection =
      restrictedMovements[snake.direction] !== e.key && Directions[e.key];

    snake.direction = shouldUpdateDirection
      ? Directions[e.key]
      : snake.direction;
  }, 1)
);

const snake = new Snake(20, 20, 20);
let food = new Food();
