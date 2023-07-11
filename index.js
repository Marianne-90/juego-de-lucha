const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc: './img/background.png'
});

const shop = new Sprite({
  position:{
    x:600,
    y:128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax:6,
});


c.fillRect(0, 0, canvas.width, canvas.height);



let player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

let enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 50,
    y: 0,
  },
  color: "blue",
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let timer = 60;
let timerId;


decreseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();

  player.update();
  enemy.update();

  //PLAYER MOVEMENT

  //*! movimiento a la derecha o izquierda en el loop esto se cambia en vez de los event listener porque si precionaba a y d al mismo tiempo y levantaba uno se cancelaba el movimiento

  player.velocity.x = 0; //*? esto es para limpiar la velociad en caso por ejemplo levantemos la tecla y queremos que pare

  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
  }

  if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
  }

  //ENEMY MOVEMENT

  enemy.velocity.x = 0;

  if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
  }

  //DETECT COLITON PLAYER
  if (
    rectangularColition({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    // player.isAttacking = false;
    enemy.health -= 1;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //DETECT COLITON ENEMY
  if (
    rectangularColition({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    // enemy.isAttacking = false; //*! en el tutorial lo ponen pero no entiendo para qué si el set time out lo vuelve false en 100 milisegundos
    player.health -= 1;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //END GAME BASED ON HEALD

  if(enemy.health === 0 || player.health === 0){
    determineWinner({player, enemy, timerId})
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d"; //*? esto es para que por ejemplo si estás precionando a y pasas a d d se active y no se quede quiero por el condicional
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    //   ENEMY KEYS

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    default:
      break;
  }
});
