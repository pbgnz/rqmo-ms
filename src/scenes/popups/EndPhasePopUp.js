import Phaser from 'phaser';
import trophyImage from '../../assets/images/trophy.png';
import continueButton from '../../assets/images/continue.png';

export default class EndPhasePopUp extends Phaser.Scene {
    constructor(){super({key:'EndPhasePopUp'})}

    preload() {
         // Load assets for the popup elements
         this.load.image('trophyImage', trophyImage);  // Image to show in popup
         this.load.image('continueButton', continueButton);  // Continue button
    }

    create(data) {       
        if (!this.textures.exists('trophyImage') || !this.textures.exists('continueButton')) {
            console.error('Could not find files');
            return;
        }

        // Set the position for the center of the screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Create a full-screen pink overlay with some transparency
        this.overlay = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0xffc0cb, 0.5);  // Pink color, 50% opacity
        this.overlay.setOrigin(0.5);
        this.overlay.setVisible(false);  // Start with overlay hidden

        // Create a container for the popup components
        this.popup = this.add.container(centerX, centerY).setVisible(false);

          // Background for the popup (transparent)
          const popupBackground = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.8); // Alpha (last parameter) set to 0 is for full transparency
          popupBackground.setOrigin(0.5);

        // Transparent background with border outline
        const border = this.add.graphics();
        border.lineStyle(4, 0xffffff, 1);  // White border with thickness of 4
        border.strokeRect(-200, -150, 400, 300);  // Draw rectangle with a border only, centered on the popup

        // Congratulatory message text with wrapping
        const congratulationsText = this.add.text(0, -100, data.message, {
            fontSize: '18px',           // Smaller font size to fit the frame
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',            // Center-align text
            wordWrap: { width: 350 }    // Wrap text to fit within the frame width
        });
        congratulationsText.setOrigin(0.5);

        // Trophy image with adjusted position and scale
        const trophyImage = this.add.image(0, 0, 'trophyImage');
        trophyImage.setScale(0.2);  // Adjust scale to fit better
        trophyImage.setOrigin(0.5);

        // "Continue" button positioned below the trophy image
        const continueButton = this.add.image(0, 100, 'continueButton').setInteractive();
        continueButton.setScale(0.5);  // Adjust size
        continueButton.setOrigin(0.5);

        // Change cursor to pointer on hover
        continueButton.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });
        continueButton.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });
        continueButton.on('pointerdown', () => {
            this.hidePopup(data.nextScene);
        });

        // Add all elements to the popup container
        this.popup.add([popupBackground, border, congratulationsText, trophyImage, continueButton]);

        // Show the popup initially
        this.showPopup();
    }
    

    showPopup() {
        // Display the popup
        this.overlay.setVisible(true); 
        this.popup.setVisible(true);
    }


    hidePopup(nextScene) {
     this.overlay.setVisible(false);  // Hide the pink overlay
     this.popup.setVisible(false);
     this.scene.stop();
     this.scene.start(nextScene) // callback function to switch scenes
    }
      
  }
