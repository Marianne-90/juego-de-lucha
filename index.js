const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
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
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit.png",
      framesMax: 4,
    },
    dead: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  atackBox: {
    offset: {
      x: -50,
      y: 50,
    },
    width: 160,
    height: 50,
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

  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/TakeHit.png",
      framesMax: 3,
    },
    dead: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  atackBox: {
    offset: {
      x: 160,
      y: 50,
    },
    width: 160,
    height: 50,
  },
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
  c.fillStyle = "rgba(255, 255, 255, .15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //PLAYER MOVEMENT

  //*! movimiento a la derecha o izquierda en el loop esto se cambia en vez de los event listener porque si precionaba a y d al mismo tiempo y levantaba uno se cancelaba el movimiento

  player.velocity.x = 0; //*? esto es para limpiar la velociad en caso por ejemplo levantemos la tecla y queremos que pare

  if (keys.a.pressed && player.lastKey === "a") {
    player.switchSpride("run");
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.switchSpride("run");
    player.velocity.x = 5;
  } else {
    player.switchSpride("idle"); //*? esto es para limpiar la imagen
  }

  //Jump

  if (player.velocity.y < 0) {
    player.switchSpride("jump");
  } else if (player.velocity.y > 0) {
    player.switchSpride("fall");
  }

  //ENEMY MOVEMENT

  enemy.velocity.x = 0;

  if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.switchSpride("run");
    enemy.velocity.x = 5;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.switchSpride("run");
    enemy.velocity.x = -5;
  } else {
    enemy.switchSpride("idle"); //*? esto es para limpiar la imagen
  }

  //Jump

  if (enemy.velocity.y < 0) {
    enemy.switchSpride("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSpride("fall");
  }

  //DETECT COLITON PLAYER AND ENEMY GETS HIT
  if (
    rectangularColition({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4 //*! esto es para que ataque justo en el frame 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();

    // document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    //*! esto le añade una animación cuando deciende la salud

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  //MISS HIT PLAYER

  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //DETECT COLITON ENEMY AND PLAYER GETS HIT

  if (
    rectangularColition({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    player.frameCurrent === 2 //*! esto es para que ataque justo en el frame 2
  ) {
    enemy.isAttacking = false;
    player.takeHit();

    // document.querySelector("#playerHealth").style.width = player.health + "%";
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  //MISS HIT ENEMY

  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //END GAME BASED ON HEALD

  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
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
    }
  }

  //   ENEMY KEYS
  if (!enemy.dead) {
    switch (event.key) {
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


