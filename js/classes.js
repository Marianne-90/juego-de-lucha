class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
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
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
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
}

class Fighter {
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

    //*! esto es la pocisión cuando caen

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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
