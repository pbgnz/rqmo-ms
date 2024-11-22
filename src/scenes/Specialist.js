import { ChatBox, ChatDropdownInput } from '../gameobjects/Chat';
import background from '../assets/images/background.png';
import dude from '../assets/images/dude.png';
import doctor from '../assets/images/doctor.png';
import BaseScene from './BaseScene';

export default class SpecialistScene extends BaseScene {
    constructor() {
        super({ key: 'SpecialistScene' });
    }

    preload() {
        super.preload()
        this.load.image('SpecialistBackground', background);
        this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('doctor', doctor, { frameWidth: 32, frameHeight: 48 });
    }

    create(data) {
        // Make sure to all super create to set up required objects
        super.create(data)

        // Set the scene
        this.scoreDisplay.setScene(this);

        this.add.image(this.width / 2, this.height / 2, 'SpecialistBackground').setDisplaySize(this.width, this.height);

        // Create the chatbox
        this.createChatBox();
 
        // Set the data
        this.udpateChatBox();
    }

    createChatBox() {
        let rectHeight = this.height / 4;
        let rectMargin = 0.1 * this.width;

        // Create the chat box at the bottom of the screen
        this.chatBox = new ChatBox(this, rectMargin, this.height - rectHeight, this.width - 2 * rectMargin, rectHeight, ChatDropdownInput);

        // Listen for player input using an arrow function to maintain the `this` context
        this.chatBox.chatController.addListener(this);
    }

    udpateSpecialistMessage() {
        // Add the specialist's message to the chat without triggering input event handling
        this.chatBox.chatController.addMessage({ sender: 'Specialist', message: this.getMessage() });
    }

    updatePlayerOptions() {
        this.chatBox.chatInput.setOptions(this.getActionMessages());
    }

    udpateChatBox() {
        this.udpateSpecialistMessage();
        this.updatePlayerOptions();
    }

    onNewMessage(message) {
        this.udpateChatBox();
    }

    update() {
        // Ensure the game state stays updated
        super.update()
    }
}
