import Phaser from "phaser";

export default class PhaserGame extends Phaser.Scene {
  private basket!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // private coins: Phaser.Physics.Arcade.Sprite[] = [];
  private coins!: Phaser.Physics.Arcade.Group;
  private chains!: Phaser.Physics.Arcade.Group;
  private blueChains!: Phaser.Physics.Arcade.Group;
  private bugs!: Phaser.Physics.Arcade.Group;
  private hackers!: Phaser.Physics.Arcade.Group;
  private viruses!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timeLeft: number = 10;
  private timerText!: Phaser.GameObjects.Text;
  private timers: Phaser.Time.TimerEvent[] = [];
  // private collectSound!: Phaser.Sound.BaseSound;
  // private wrongSound!: Phaser.Sound.BaseSound;

  private coinDelay: number = 1000;
  private chainDelay: number = 2000;
  private blueChainDelay: number = 500;
  private bugDelay: number = 3000;
  private hackerDelay: number = 4000;
  private virusDelay: number = 5000;
  private hasIncreasedSpawn: boolean = false;

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
    this.load.image("blue_chain", "/assets/blue_chain.png");
    this.load.image("bug", "/assets/bug.png");
    this.load.image("hacker", "/assets/hacker.png");
    this.load.image("virus", "/assets/virus.png");
    // load sound
    this.load.audio("collect-sound", "/audio/collect.mp3");
    this.load.audio("wrong-sound", "/audio/wrong.mp3");
  }

  create() {
    // Tambahkan background
    const image = this.add.image(400, 300, "background").setOrigin(0.5, 0.5);
    // buat gambar menjadi fullscreen/ stretch
    if (this.scale.gameSize.width < 800) {
      image.setScale(
        Math.max(
          this.scale.gameSize.width / 800,
          this.scale.gameSize.height / 600
        )
      );
    } else {
      image.setScale(1);
    }
    image.setDepth(-1); // Set depth to -1 to render behind other objects
    this.hasIncreasedSpawn = false;

    this.cameras.main.setSize(
      Math.min(this.scale.gameSize.width, 800),
      this.scale.gameSize.height
    );
    this.cameras.main.setBounds(
      0,
      0,
      Math.min(this.scale.gameSize.width, 800),
      this.scale.gameSize.height
    );

    this.physics.world.setBounds(
      0,
      0,
      Math.min(this.scale.gameSize.width, 800),
      this.scale.gameSize.height
    );

    // Tambahkan keranjang
    // this.basket = this.physics.add.sprite(400, window.innerHeight, "basket");
    this.basket = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - 50,
      "basket"
    );

    this.basket.setDisplaySize(100, 100); // width, height
    this.basket.setCollideWorldBounds(true); // Biar tidak keluar layar
    this.basket.setImmovable(true);

    this.coins = this.physics.add.group();
    this.chains = this.physics.add.group();
    this.blueChains = this.physics.add.group();
    this.bugs = this.physics.add.group();
    this.hackers = this.physics.add.group();
    this.viruses = this.physics.add.group();

    // Keyboard control
    const cursors = this.input.keyboard?.createCursorKeys();
    if (!cursors) {
      throw new Error("Keyboard input not available");
    }
    this.cursors = cursors;

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const width = Number(this.game.config.width);
      if (pointer.x < width / 2) {
        // Sentuhan di sisi kiri
        this.moveLeft();
      } else {
        // Sentuhan di sisi kanan
        this.moveRight();
      }
    });

    this.timers.push(
      this.time.addEvent({
        delay: this.coinDelay,
        callback: this.createCoin,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
      this.time.addEvent({
        delay: this.chainDelay,
        callback: this.createChain,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
      this.time.addEvent({
        delay: this.blueChainDelay,
        callback: this.createBlueChain,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
      this.time.addEvent({
        delay: this.bugDelay,
        callback: this.createBug,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
      this.time.addEvent({
        delay: this.hackerDelay,
        callback: this.createHacker,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
      this.time.addEvent({
        delay: this.virusDelay,
        callback: this.createVirus,
        callbackScope: this,
        loop: true,
      })
    );

    this.timers.push(
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
      })
    );

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

    this.physics.add.overlap(
      this.basket,
      this.blueChains,
      (basket, blueChains) =>
        this.catchBlueChain(
          basket as Phaser.Physics.Arcade.Sprite,
          blueChains as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.physics.add.overlap(
      this.basket,
      this.bugs,
      (basket, bug) =>
        this.catchBug(
          basket as Phaser.Physics.Arcade.Sprite,
          bug as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.physics.add.overlap(
      this.basket,
      this.hackers,
      (basket, hacker) =>
        this.catchHacker(
          basket as Phaser.Physics.Arcade.Sprite,
          hacker as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.physics.add.overlap(
      this.basket,
      this.viruses,
      (basket, virus) =>
        this.catchVirus(
          basket as Phaser.Physics.Arcade.Sprite,
          virus as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontStyle: "bold",
      fontSize: "32px",
      color: "#000000",
    });

    if (this.scale.gameSize.width < 800) {
      this.timerText = this.add.text(16, 48, "Time: 60", {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#000000",
      });
    } else {
      this.timerText = this.add.text(600, 16, "Time: 60", {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#000000",
      });
    }

    this.game.events.emit("ready");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  moveLeft() {
    this.basket.setVelocityX(-300);
  }
  moveRight() {
    this.basket.setVelocityX(300);
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

    // membuat gerakan dengan touch
    if (this.input.activePointer.isDown) {
      const width = Number(this.game.config.width);
      if (this.input.x < width / 2) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    }

    [
      this.blueChains,
      this.bugs,
      this.hackers,
      this.viruses,
      this.coins,
      this.chains,
    ].forEach((group) => {
      group.getChildren().forEach((item) => {
        if ((item as Phaser.Physics.Arcade.Sprite).y > window.innerHeight) {
          item.destroy();
        }
      });
    });

    if (this.timeLeft === 30 && !this.hasIncreasedSpawn) {
      this.hasIncreasedSpawn = true;

      // will leave it here for now
      // this.timers.forEach((timer) => timer.remove());
      // this.timers = [];

      // Add new timers with increased spawn rates
      this.timers.push(
        this.time.addEvent({
          delay: this.coinDelay * 0.5,
          callback: this.createCoin,
          callbackScope: this,
          loop: true,
        })
      );
      this.timers.push(
        this.time.addEvent({
          delay: this.chainDelay * 0.5,
          callback: this.createChain,
          callbackScope: this,
          loop: true,
        })
      );
      this.timers.push(
        this.time.addEvent({
          delay: this.blueChainDelay * 0.5,
          callback: this.createBlueChain,
          callbackScope: this,
          loop: true,
        })
      );
      this.timers.push(
        this.time.addEvent({
          delay: this.bugDelay * 0.5,
          callback: this.createBug,
          callbackScope: this,
          loop: true,
        })
      );
      this.timers.push(
        this.time.addEvent({
          delay: this.hackerDelay * 0.5,
          callback: this.createHacker,
          callbackScope: this,
          loop: true,
        })
      );
      this.timers.push(
        this.time.addEvent({
          delay: this.virusDelay * 0.5,
          callback: this.createVirus,
          callbackScope: this,
          loop: true,
        })
      );
    }
  }

  createChain() {
    const chain = this.chains.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "chain"
    ) as Phaser.Physics.Arcade.Sprite;
    chain.setScale(0.1);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    chain.setVelocityY(speed);
  }

  createCoin() {
    const coin = this.coins.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "coin"
    ) as Phaser.Physics.Arcade.Sprite;

    coin.setScale(0.05);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    coin.setVelocityY(speed);
  }

  createBlueChain() {
    const blueChain = this.blueChains.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "blue_chain"
    ) as Phaser.Physics.Arcade.Sprite;
    blueChain.setScale(0.1);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    blueChain.setVelocityY(speed);
  }

  createBug() {
    const bug = this.bugs.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "bug"
    ) as Phaser.Physics.Arcade.Sprite;
    bug.setScale(0.1);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    bug.setVelocityY(speed);
  }

  createHacker() {
    const hacker = this.hackers.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "hacker"
    ) as Phaser.Physics.Arcade.Sprite;
    hacker.setScale(0.1);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    hacker.setVelocityY(speed);
  }

  createVirus() {
    const virus = this.viruses.create(
      Phaser.Math.Between(100, Math.min(700, this.scale.width)),
      0,
      "virus"
    ) as Phaser.Physics.Arcade.Sprite;
    virus.setScale(0.1);
    const speed = 100 + (60 - this.timeLeft) * 10; // Kecepatan meningkat seiring waktu
    virus.setVelocityY(speed);
  }

  catchCoin(
    _basket: Phaser.Physics.Arcade.Sprite,
    coin: Phaser.Physics.Arcade.Sprite
  ) {
    const collectSound = this.sound.add("collect-sound");
    collectSound.play();

    // Tampilkan teks poin di posisi coin
    const points = 5; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(coin.x, coin.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#00FF00",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: coin.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    coin.destroy();
    this.score += 5;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Coin caught!");
  }

  catchChain(
    _basket: Phaser.Physics.Arcade.Sprite,
    chain: Phaser.Physics.Arcade.Sprite
  ) {
    const collectSound = this.sound.add("collect-sound");
    collectSound.play();

    // Tampilkan teks poin di posisi coin
    const points = 10; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(chain.x, chain.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#00FF00",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: chain.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    chain.destroy();
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Chain caught!");
  }

  catchBlueChain(
    _basket: Phaser.Physics.Arcade.Sprite,
    blue_chain: Phaser.Physics.Arcade.Sprite
  ) {
    const collectSound = this.sound.add("collect-sound");
    collectSound.play();

    // Tampilkan teks poin di posisi coin
    const points = 3; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(blue_chain.x, blue_chain.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#00FF00",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: blue_chain.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    blue_chain.destroy();
    this.score += 3;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Block caught!");
  }

  catchBug(
    _basket: Phaser.Physics.Arcade.Sprite,
    bug: Phaser.Physics.Arcade.Sprite
  ) {
    const wrongSound = this.sound.add("wrong-sound");
    wrongSound.play();

    // Tampilkan teks poin di posisi coin
    const points = -3; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(bug.x, bug.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: bug.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    bug.destroy();
    this.score -= 3;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Bug caught!");
  }

  catchHacker(
    _basket: Phaser.Physics.Arcade.Sprite,
    hacker: Phaser.Physics.Arcade.Sprite
  ) {
    const wrongSound = this.sound.add("wrong-sound");
    wrongSound.play();

    // Tampilkan teks poin di posisi coin
    const points = -10; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(hacker.x, hacker.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: hacker.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    hacker.destroy();
    this.score -= 10;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Hacker caught!");
  }

  catchVirus(
    _basket: Phaser.Physics.Arcade.Sprite,
    virus: Phaser.Physics.Arcade.Sprite
  ) {
    const wrongSound = this.sound.add("wrong-sound");
    wrongSound.play();

    // Tampilkan teks poin di posisi coin
    const points = -5; // Poin yang didapatkan dari coin
    const pointText = this.add
      .text(virus.x, virus.y, `+${points}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    // Animasi teks naik dan menghilang
    this.tweens.add({
      targets: pointText,
      y: virus.y - 50, // Gerakkan ke atas
      alpha: 0, // Ubah transparansi menjadi 0
      duration: 500, // Durasi animasi
      ease: "Power1", // Jenis easing
      onComplete: () => {
        pointText.destroy(); // Hancurkan teks setelah animasi selesai
      },
    });

    virus.destroy();
    this.score -= 5;
    this.scoreText.setText(`Score: ${this.score}`);
    console.log("Virus caught!");
  }

  private gameOver() {
    this.physics.pause();

    // Hentikan semua timer
    this.timers.forEach((timer) => timer.remove());
    this.timers = [];

    this.coins.clear(true, true);
    this.chains.clear(true, true);
    this.blueChains.clear(true, true);
    this.bugs.clear(true, true);
    this.hackers.clear(true, true);
    this.viruses.clear(true, true);

    if (this.game.scale.gameSize.width < 800) {
      this.add.text(100, 250, "Game Over", {
        fontStyle: "bold",
        fontSize: "48px",
        color: "#ff0000",
      });
      this.add.text(100, 320, `Final Score: ${this.score}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#ff0000",
      });
    } else {
      this.add.text(300, 250, "Game Over", {
        fontStyle: "bold",
        fontSize: "48px",
        color: "#ff0000",
      });
      this.add.text(300, 320, `Final Score: ${this.score}`, {
        fontStyle: "bold",
        fontSize: "32px",
        color: "#ff0000",
      });
    }

    this.events.emit("gameover", { score: this.score });
  }

  shutdown() {
    // Hentikan semua timer jika belum dihentikan
    this.timers.forEach((timer) => timer.remove());
    this.timers = [];

    // Hancurkan semua grup objek
    this.coins.clear(true, true);
    this.chains.clear(true, true);
    this.blueChains.clear(true, true);
    this.bugs.clear(true, true);
    this.hackers.clear(true, true);
    this.viruses.clear(true, true);

    // Hancurkan objek teks jika masih ada
    this.scoreText?.destroy();
    this.timerText?.destroy();

    // Hancurkan keranjang jika masih ada
    this.basket?.destroy();
  }
}
