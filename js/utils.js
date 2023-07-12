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

      d = document.querySelector("#button");
      d.style.display = "block";
  
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

  const handleReset = () => {
    player.position = { x: 0, y: 0 };
  
    enemy.position = { x: 400, y: 100 };
  
    player.reset();
    enemy.reset();
  
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  
    clearTimeout(timerId);
  
    timer = 60;
  
    decreseTimer();
  
    let d = document.querySelector("#displayText");
    d.style.display = "none";
  
    d = document.querySelector("#button");
    d.style.display = "none";
  
  };