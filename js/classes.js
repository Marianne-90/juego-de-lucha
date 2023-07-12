class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      //   crop information
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,

      // end of crop information
      //*! el ofset es para achicar el aire a la hora de cortar por ejemplo si quieres que solo se dibuje la imagen y quitar el aire
      //*! lo que hace por así decirlo es mover los puntos de referencia a la hora de posicionar pero no corta la imagen
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,

      // tamaño de la imagen
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    //*! cada que esto se lopee se va a aladir un número si un número es dividiendo de framehold entonces se ejecuta la función y de esta manera se alenta el proceso y se ve mejor la animación

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    atackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

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
      with: atackBox.width,
      height: atackBox.height,
      offset: atackBox.offset,
    };
    this.health = 100;

    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    //*! lo que hacemos aquí es asignar una nuevo objeto de imágen con su url al objeto strpite para que los cositos canbien de posición

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();

    if (this.dead !== true) this.animateFrames();

    // dibujar draw box para que siga a los personajes porque si no se queda congelado
    this.atackBox.position.x = this.position.x - this.atackBox.offset.x;
    this.atackBox.position.y = this.position.y + this.atackBox.offset.y;

    //aquí se hace visible el atack box para cualquier modificación
    // c.fillRect(
    //   this.atackBox.position.x,
    //   this.atackBox.position.y,
    //   this.atackBox.with,
    //   this.atackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //*? esto es la pocisión cuando caen
    //*! LO DE ABAJO TIENE UN BUG QUE HASTA QUE NO LLEGA HASTA ABAJO VA A INTERAR ENTRE LA VELOCIAD Y 0 LO QUE PUEDE CAUSAR REACCIONES RARAS A LA HORA DE AÑADIR ANIMACIONES
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330; //*! esto lo arregla, básicamente es fijar la pocición final
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSpride("attack1");
    this.isAttacking = true;

    //*! esto lo quitamos porque quieren volver false esto solo cuando se acabe la animación
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 100);
  }

  switchSpride(sprite) {
    //over writing all other animations with atack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    //over writing all other animations with hit animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    //over writing all other animations with dead animation
    if (this.image === this.sprites.dead.image) {
      if (this.frameCurrent === this.sprites.dead.framesMax -1 ) {
          this.dead = true;
      }
      return;
    }

    //*! esto lo cambié porque en el tutorial lo ponían como switch case y era muy largo sin sentido

    if (this.image !== this.sprites[sprite].image) {
      this.framesMax = this.sprites[sprite].framesMax;
      this.image = this.sprites[sprite].image;
      this.frameCurrent = 0;
    }

    // switch (sprite) {
    //   case "idle":
    //     if (this.image !== this.sprites.idle.image) {
    //       this.framesMax = this.sprites.idle.framesMax;
    //       this.image = this.sprites.idle.image;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "run":
    //     if (this.image !== this.sprites.run.image) {
    //       this.framesMax = this.sprites.run.framesMax;
    //       this.image = this.sprites.run.image;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "jump":
    //     if (this.image !== this.sprites.jump.image) {
    //       this.image = this.sprites.jump.image;
    //       this.framesMax = this.sprites.jump.framesMax;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "fall":
    //     if (this.image !== this.sprites.fall.image) {
    //       this.image = this.sprites.fall.image;
    //       this.framesMax = this.sprites.fall.framesMax;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "attack1":
    //     if (this.image !== this.sprites.attack1.image) {
    //       this.image = this.sprites.attack1.image;
    //       this.framesMax = this.sprites.attack1.framesMax;
    //       this.frameCurrent = 0;
    //     }
    //     break;

    //   default:
    //     break;
    // }
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSpride("dead");
    } else {
      this.switchSpride("takeHit");
    }
  }
}
