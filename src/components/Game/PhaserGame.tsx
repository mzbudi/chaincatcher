// src/components/PhaserGame.ts
import Phaser from "phaser";

export default class PhaserGame extends Phaser.Scene {
  private basket!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // private coins: Phaser.Physics.Arcade.Sprite[] = [];
  private coins!: Phaser.Physics.Arcade.Group;
  private chains!: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "chain-catcher" });
  }

  preload() {
    this.load.image("coin", "/assets/coin.png"); // pastikan path benar
    this.load.image("basket", "/assets/basket.png"); // pastikan path benar
    this.load.image("chain", "/assets/chain.png"); // pastikan path benar
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffa500"); // oranye biar kelihatan
    this.physics.world.setBounds(0, 0, 800, 600);

    // Tambahkan keranjang
    this.basket = this.physics.add.sprite(400, 500, "basket");
    this.basket.setDisplaySize(200, 50); // width, height
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
    // Ketika coin tertangkap keranjang, kita hapus coin tersebut
    coin.destroy();
    console.log("Coin caught!");
  }

  catchChain(
    basket: Phaser.Physics.Arcade.Sprite,
    chain: Phaser.Physics.Arcade.Sprite
  ) {
    // Ketika coin tertangkap keranjang, kita hapus coin tersebut
    chain.destroy();
    console.log("Chain caught!");
  }
}
