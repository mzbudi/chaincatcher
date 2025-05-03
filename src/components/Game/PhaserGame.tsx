// src/components/PhaserGame.ts
import Phaser from "phaser";

export default class PhaserGame extends Phaser.Scene {
  private basket!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // private coins: Phaser.Physics.Arcade.Sprite[] = [];
  private coins!: Phaser.Physics.Arcade.Group;
  private chains!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timeLeft: number = 10;
  private timerText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "chain-catcher" });
  }

  preload() {
    // load background
    // this.load.image("background", "/assets/myartthatdoesntwin.jpg"); 
    this.load.image("background", "/assets/lab.jpg"); 
    this.load.image("coin", "/assets/coin.png"); 
    this.load.image("basket", "/assets/basket.png"); 
    this.load.image("chain", "/assets/chain.png"); 
  }

  create() {
    // Tambahkan background
    this.add.image(400, 300, "background").setOrigin(0.5, 0.5).scale = 2;
    // Set ukuran background
    this.cameras.main.setSize(800, 600);
    this.cameras.main.setBounds(0, 0, 800, 600);

    this.physics.world.setBounds(0, 0, 800, 600);

    // Tambahkan keranjang
    this.basket = this.physics.add.sprite(400, 600, "basket");
    this.basket.setDisplaySize(200, 100); // width, height
    this.basket.setCollideWorldBounds(true); // Biar tidak keluar layar
    this.basket.setImmovable(true);

    this.coins = this.physics.add.group();
    this.chains = this.physics.add.group();

    // Keyboard control
    const cursors = this.input.keyboard?.createCursorKeys();
    if (!cursors) {
      throw new Error("Keyboard input not available");
    }
    this.cursors = cursors;

    // Buat coin jatuh secara acak terus-menerus
    this.time.addEvent({
      delay: 1000, // setiap 1 detik
      callback: () => {
        this.createCoin();
      },
      callbackScope: this,
      loop: true,
    });

    // Buat chain jatuh secara acak terus-menerus
    this.time.addEvent({
      delay: 2000, // setiap 2 detik
      callback: () => {
        this.createChain();
      },
      callbackScope: this,
      loop: true,
    });

    // Menambahkan collider untuk mendeteksi tabrakan antara keranjang dan coin
    this.physics.add.overlap(
      this.basket,
      this.coins,
      (basket, coin) =>
        this.catchCoin(
          basket as Phaser.Physics.Arcade.Sprite,
          coin as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.physics.add.overlap(
      this.basket,
      this.chains,
      (basket, chain) =>
        this.catchChain(
          basket as Phaser.Physics.Arcade.Sprite,
          chain as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
    });

    this.timerText = this.add.text(600, 16, "Time: 60", {
      fontSize: "32px",
      color: "#fff",
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          this.gameOver();
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.game.events.emit("ready");
  }

  update() {
    const speed = 300;

    if (this.cursors.left?.isDown) {
      this.basket.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown) {
      this.basket.setVelocityX(speed);
    } else {
      this.basket.setVelocityX(0);
    }

    this.coins.getChildren().forEach((coin) => {
      const c = coin as Phaser.Physics.Arcade.Sprite;
      if (c.y > 600) {
        c.destroy();
      }
    });

    this.chains.getChildren().forEach((chain) => {
      const c = chain as Phaser.Physics.Arcade.Sprite;
      if (c.y > 600) {
        c.destroy();
      }
    });
  }

  createChain() {
    const chain = this.chains.create(
      Phaser.Math.Between(100, 700),
      0,
      "chain"
    ) as Phaser.Physics.Arcade.Sprite;
    chain.setScale(0.1);
    chain.setVelocityY(100);
  }

  createCoin() {
    const coin = this.coins.create(
      Phaser.Math.Between(100, 700),
      0,
      "coin"
    ) as Phaser.Physics.Arcade.Sprite;

    coin.setScale(0.1);
    coin.setVelocityY(100);
  }

  catchCoin(
    basket: Phaser.Physics.Arcade.Sprite,
    coin: Phaser.Physics.Arcade.Sprite
  ) {
    coin.destroy();
    this.score += 5;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Coin caught!");
  }

  catchChain(
    basket: Phaser.Physics.Arcade.Sprite,
    chain: Phaser.Physics.Arcade.Sprite
  ) {
    chain.destroy();
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Chain caught!");
  }

  private gameOver() {
    this.physics.pause();
    this.coins.clear(true, true);
    this.chains.clear(true, true);

    this.add.text(300, 250, "Game Over", {
      fontSize: "48px",
      color: "#ff0000",
    });
    this.add.text(280, 320, `Final Score: ${this.score}`, {
      fontSize: "32px",
      color: "#ffffff",
    });

    // 👇 Emit event agar React tahu game over
    this.events.emit("gameover", { score: this.score });
  }
}
