import Phaser from 'phaser';
import { GameTree } from '../gameobjects/Game';
import { ScoreDisplay } from '../gameobjects/ScoreDisplay';

export default class BaseScene extends Phaser.Scene {
    constructor({ key }) {
        super({ key });
    }

    preload() { 
        // Game setup and preload logic for base scene can go here, if needed.
    }

    create() {
        // Set up Game graph data
        this.gameTree = GameTree.getInstance();
        this.head = this.gameTree.getHead();
        this.actions = this.gameTree.getPossibleActions();

        // Set up the scene visuals
        this.canvas = this.sys.game.canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Initialize ScoreDisplay
        this.scoreDisplay = ScoreDisplay.getInstance(this, 250, 40);
    }

    update() { }

    isCurrentScene() {
        return this.head.scene === this.scene.key;
    }

    newMessage(message) {
        if (message.sender === 'Player') {
            // Debug: Log the available actions and the player's message
            console.log('Available actions:', this.actions.map(a => a.getMessage()));
            console.log('Player message:', message.message);
    
            // Normalize and match messages
            const normalize = (str) => str.trim().toLowerCase();
            const selectedAction = this.actions.find(
                (action) => normalize(action.getMessage()) === normalize(message.message)
            );
    
            if (selectedAction) {
                // If an action is selected, apply it
                this.gameTree.applyAction(selectedAction);
                this.scoreDisplay.updateScores();
    
                // Update the available actions and head after applying the action
                this.actions = this.gameTree.getPossibleActions();
                this.head = this.gameTree.getHead();
    
                // Call the onNewMessage method to update the game state
                this.onNewMessage(message);
    
                // Check if the scene is the current one, otherwise switch scenes
                if (!this.isCurrentScene()) {
                    // Check if the scene has already been started or is active
                    if (!this.scene.isActive(this.head.scene)) {
                        console.log('Starting new scene:', this.head.scene);
                        this.scene.start(this.head.scene);
                    } else {
                        this.scene.resume(this.head.scene);
                    }
                }
            } else {
                // If no valid action is found, log a warning and do not halt the game
                console.warn('No Selection Action found for message:', message.message);
    
                // You can provide a fallback action here if needed
                // For example, you can provide a default action to continue the conversation
            }
        }
    }
    
    onNewMessage(message) { 
        // Empty method, can be overridden by child classes
    }
}
