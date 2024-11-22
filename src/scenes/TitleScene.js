import Phaser from "phaser";
import background from "../assets/images/Title_Background.png";
import backgroundMusic from "../assets/music/cheerful_intro_nodissonance.mid";
import MusicPlayer from "../gameobjects/MusicPlayer";
import Settings from "../gameobjects/Settings";

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScene" });
    this.gameDifficulties = ["Easy", "Medium", "Hard"];
    this.selectedDifficulty = "Medium"; // Default difficulty
  }

  preload() {
    this.load.image("background", background);
  }

  create() {
    // Add background
    this.add.image(700, 350, "background").setScale(0.7);

    // Initialize and play background music
    this.musicPlayer = new MusicPlayer(this, backgroundMusic);
    this.input.once("pointerdown", () => this.startMusic());

    // Create UI elements
    this.createTitle();
    this.createNewGameButton();
    this.createDifficultySelector();
    this.createVolumeControls();
  }

  async startMusic() {
    await this.musicPlayer.initializeAudio();
    if (this.musicPlayer.audioContext.state === "suspended") {
      await this.musicPlayer.audioContext.resume();
    }
    this.musicPlayer.loadAndPlayMusic();
  }

  createTitle() {
    // Create background box for the title
    const titleBox = this.add.graphics();
    titleBox.fillStyle(0x808080, 0.9); // Gray color with 90% opacity
    titleBox.fillRect(500, 150, 500, 100); // Adjust position and size as needed

    // Create the "RQMO Game" title text
    this.add.text(750, 200, "RQMO Game", {
      fontSize: "72px",
      fill: "#ffffff",
    }).setOrigin(0.5);
  }

  createNewGameButton() {
    const newGameButton = this.add.text(750, 350, "New Game", {
      fontSize: "48px",
      fill: "#ffffff",
    }).setOrigin(0.5).setInteractive();

    newGameButton.on("pointerdown", () => {
      this.scene.start("DoctorOfficeScene", { difficulty: this.selectedDifficulty });
    });

    this.tweens.add({
      targets: newGameButton,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  createDifficultySelector() {
    const centerX = this.cameras.main.width / 2;
    const spacing = 200;
    let xPosition = centerX - ((this.gameDifficulties.length - 1) * spacing) / 2;

    this.difficultyTextObjects = this.gameDifficulties.map((level) => {
      const text = this.add.text(xPosition, 500, level, {
        fontSize: "36px",
        fill: level === this.selectedDifficulty ? "#ff0000" : "#ffffff",
      }).setInteractive().setOrigin(0.5);

      text.on("pointerdown", () => {
        this.selectedDifficulty = level;
        Settings.difficulty = level;
        this.updateDifficultyColors();
      });

      xPosition += spacing;
      return text;
    });
  }

  updateDifficultyColors() {
    this.difficultyTextObjects.forEach((text, index) => {
      const color = this.gameDifficulties[index] === this.selectedDifficulty ? "#ff0000" : "#ffffff";
      text.setStyle({ fill: color });
    });
  }

  createVolumeControls() {
    const volumeControls = [
      { label: "Volume Up", y: 100, action: () => this.musicPlayer.setVolume(0) },
      { label: "Volume Down", y: 150, action: () => this.musicPlayer.setVolume(-20) },
      { label: "Mute", y: 200, action: () => this.musicPlayer.setVolume(-60) },
    ];

    volumeControls.forEach(({ label, y, action }) => {
      this.add.text(100, y, label, { fontSize: "24px", fill: "#ffffff" })
        .setInteractive()
        .on("pointerdown", action);
    });
  }
}

export default TitleScene;
