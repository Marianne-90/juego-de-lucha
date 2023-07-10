const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.isAttacking;
    this.atackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      with: 100,
      height: 50,
      offset,
    };
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      //** atack box */
      c.fillStyle = "green";
      c.fillRect(
        this.atackBox.position.x,
        this.atackBox.position.y,
        this.atackBox.with,
        this.atackBox.height
      );
    }
  }

  update() {
    this.draw();

    // dibujar draw box para que siga a los personajes porque si no se queda congelado
    this.atackBox.position.x = this.position.x - this.atackBox.offset.x;
    this.atackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

let player = new Sprite({
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

let enemy = new Sprite({
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

const rectangularColition = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.atackBox.position.x + rectangle1.atackBox.with >=
      rectangle2.position.x &&
    rectangle1.atackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.atackBox.position.y >=
      rectangle2.position.y - rectangle2.height &&
    rectangle1.atackBox.position.y - rectangle1.atackBox.height <=
      rectangle2.position.y
  );
};

let timer = 60;
let timerId;

const determineWinner = ({player, enemy, timerId}) => {

    clearTimeout(timerId)

    let d = document.querySelector("#displayText");
    d.style.display = "flex";

    if (player.health === enemy.health) {
        d.innerHTML = "TIE";
    }
    if (player.health > enemy.health) {
        d.innerHTML = "PLAYER 1 WINS";
    }
    if (player.health < enemy.health) {
        d.innerHTML = "PLAYER 2 WINS";
    }

};

const decreseTimer = () => {
  if (timer > 0) {
    timerId = setTimeout(decreseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({player, enemy, timerId})
  }
};

decreseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
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
