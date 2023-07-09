const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
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
});

let lastKey;

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

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //PLAYER MOVEMENT

  //*! movimiento a la derecha o izquierda en el loop esto se cambia en vez de los event listener porque si precionaba a y d al mismo tiempo y levantaba uno se cancelaba el movimiento

  player.velocity.x = 0; //*? esto es para limpiar la velociad en caso por ejemplo levantemos la tecla y queremos que pare

  if (keys.a.pressed && lastKey == "a") {
    player.velocity.x = -1;
  }

  if (keys.d.pressed && lastKey == "d") {
    player.velocity.x = 1;
  }

  
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);

  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      lastKey = "d"; //*? esto es para que por ejemplo si estás precionando a y pasas a d d se active y no se quede quiero por el condicional
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "w":
      player.velocity.y = -10;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -10;
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
