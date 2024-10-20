import { ChatBox, ChatDropdownInput } from '../gameobjects/Chat';
import background from '../assets/background.png';
import dude from '../assets/dude.png';
import Phaser from 'phaser';
import doctor from '../assets/doctor.png';
import { testGame } from '../gameobjects/Game';

export default class SpecialistScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SpecialistScene' });
    }

    preload() {
        this.load.image('SpecialistBackground', background);
        this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('doctor', doctor, { frameWidth: 32, frameHeight: 48 });
        this.canvas = this.sys.game.canvas;
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.chatIndex = 1
        this.game = testGame
    }

    create() {
        this.add.image(this.width / 2, this.height / 2, 'SpecialistBackground').setDisplaySize(this.width, this.height);
        this.createChatBox()
        this.nextOptions()
    }

    createChatBox() {
        let rectHeight = this.height / 4;
        let rectMargin = 0.1 * this.width;
        // Align it to bottom of screen
        this.chatBox = new ChatBox(this, rectMargin, this.height - rectHeight, this.width - 2 * rectMargin, rectHeight, ChatDropdownInput);
        // this.chatBox.chatInput.setOptions(['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']);
        this.chatBox.chatController.addMessage({ sender: 'Doctor', message: this.game.head.prompt });
        this.chatBox.chatController.addListener(this);
    }

    nextOptions() {
        const nextOptions = this.game.nextActions().map((action) => action.prompt)
        this.chatBox.chatInput.setOptions(nextOptions);
    }

    newMessage(message) {
        // this.chatIndex += 1
        if (message.sender === 'Player') {
            console.log('Got message', message, 'next: ', this.game.nextActions())
            const action = this.game.nextActions().find((ac) => ac.promp === message.nessage)
            this.game.performAction(action.actionId)
            this.chatBox.chatController.addMessage({ sender: 'Doctor', message: this.game.head.prompt });
            this.nextOptions()
            // this.chatBox.chatInput.setOptions([`Option ${this.chatIndex}.1`, `Option ${this.chatIndex}.2`, `Option ${this.chatIndex}.3`, `Option ${this.chatIndex}.4`, `Option ${this.chatIndex}.5`])
        }
    }

    createToggleSceneButton() {
        this.switchButton = this.add.text(10, 10, 'Change Scene', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            borderRadius: 5
        }).setInteractive();

        this.switchButton.on('pointerdown', () => this.scene.switch('DoctorOfficeScene'));
    }

    update() {
    }
}
