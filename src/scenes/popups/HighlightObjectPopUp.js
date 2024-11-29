import Phaser from 'phaser';
import zebraIcon from '../../assets/images/zebra.png';
import closeButton from '../../assets/images/close.png';


export default class HighlightObjectPopUp extends Phaser.Scene {
    constructor(){super({key:'HighlightObjectPopUp'})}

    preload() {
         // Load assets for the popup elements
         this.load.image('zebraIcon', zebraIcon);  
         this.load.image('closeButton', closeButton); // Add an OK button image
    }

    create(data) {
        // Set the position for the center of the screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
       
        // Create a full-screen pink overlay with some transparency
        this.overlay = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);  // Pink color, 50% opacity
        this.overlay.setOrigin(0.5);
        this.overlay.setVisible(false);  // Start with overlay hidden

        // Default position for the highlighted element if none is passed
        const targetX = data.x || 250;
        const targetY = data.y || 40;
        const message = data.message || "Check out this new element!";

        // Create a semi-transparent overlay
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5
        );
        overlay.setOrigin(0.5);

        // Add a pointing icon near the element
        const zebraIcon = this.add.image(targetX, targetY, 'zebraIcon');
        zebraIcon.setScale(0.4);
        zebraIcon.setOrigin(0.5);

        // Highlight the new element with a border or effect
        const highlight = this.add.graphics();
        highlight.lineStyle(2, 0xffffff, 1); // White border
        highlight.strokeRect(data.highlightX-150, targetY - 38, 290, 158); // Adjust the size as needed

        // Tween for pulsing the highlight
        this.tweens.add({
            targets: highlight,
            alpha: 0.3, // Fade the highlight to a lower transparency
            ease: 'Linear',
            duration: 500, // Half a second
            yoyo: true, // Reverse the tween
            repeat: -1 // Repeat forever
        });

        // Display the text message
        const messageText = this.add.text(targetX, targetY + 60, message, {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: 200 },
            align: 'center'
        });
        messageText.setOrigin(0.4);

        // Close modal interaction
        overlay.setInteractive();
        overlay.on('pointerdown', () => {
            this.scene.stop(); // Close this modal
        });

        const closeButton = this.add.image(targetX, targetY + 120, 'closeButton').setInteractive();
        closeButton.setScale(0.4);
        closeButton.setOrigin(0.4);

        // Change cursor to pointer on hover
        closeButton.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });
        closeButton.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });
        


        // Add a click event for the "OK" button to close the modal
        closeButton.on('pointerdown', () => {
            this.scene.stop(); // Close the modal
        });
    }
}
