import { ChatBox, ChatDropdownInput } from '../gameobjects/Chat';
import background from '../assets/images/doctor-background.png';
import doctor from '../assets/images/doctor.png';
import patient from '../assets/images/patient.png';
import BaseScene from './BaseScene';
import { GAME_DATA } from '../data';

export default class DoctorOfficeScene extends BaseScene {
    constructor() {
        super({ key: 'DoctorOfficeScene' });
    }

    preload() {
        super.preload();
        this.load.image('DoctorOfficeBackground', background);
        this.load.spritesheet('doctor', doctor, { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('patient', patient, { frameWidth: 32, frameHeight: 48 });
    }

    create(data) {
        super.create(data);
        this.scoreDisplay.setScene(this);
        this.add.image(this.width / 2, this.height / 2, 'DoctorOfficeBackground').setDisplaySize(this.width, this.height);
        this.createChatBox();
        this.startDialogue(data?.currentNode || "0");
        this.scene.launch('HighlightObjectPopUp', { 
            x: 480, y: 40, highlightX: 250, highlightY: 50, 
            message: "Meet your new ally! It’s here to help you make smart decisions" 
        });
    }

    createChatBox() {
        const rectHeight = this.height / 4;
        const rectMargin = 0.1 * this.width;
        this.chatBox = new ChatBox(this, rectMargin, this.height - rectHeight, this.width - 2 * rectMargin, rectHeight, ChatDropdownInput);
        this.chatBox.chatController.addListener(this);
    }

    startDialogue(nodeId) {
        const node = GAME_DATA.nodes[nodeId];
        if (node) {
            this.currentNode = nodeId;
            this.updateChatBox(nodeId);
        }
    }

    updateChatBox(nodeId) {
        this.updateDoctorMessage(nodeId);
        this.updatePlayerOptions(nodeId);
    }

    updateDoctorMessage(nodeId) {
        const node = GAME_DATA.nodes[nodeId];
        if (node) {
            this.chatBox.chatController.addMessage({ sender: 'Doctor', message: node.prompt });
        }
    }

    updatePlayerOptions(nodeId) {
        const edges = GAME_DATA.edges[nodeId] || [];
        const options = edges.flatMap(edge =>
            edge.actions.map(action => ({
                text: action.message,
                nextNodeId: edge.to
            }))
        );
        this.pendingOptions = options;
        this.chatBox.chatInput.setOptions(options.map(option => option.text));
    }

    handleOptionSelection(nextNodeId) {
        const targetScene = GAME_DATA.nodes[nextNodeId]?.scene;
        if (targetScene && targetScene !== 'DoctorOfficeScene') {
            this.scene.start(targetScene, { currentNode: nextNodeId });
        } else {
            this.startDialogue(nextNodeId);
        }
    }

    onNewMessage(message) {
        const playerMessage = typeof message === 'string' ? message : message?.message;
        if (!playerMessage || !this.pendingOptions) return;

        const selected = this.pendingOptions.find(
            opt => opt.text.trim().toLowerCase() === playerMessage.trim().toLowerCase()
        );

        if (selected) {
            this.handleOptionSelection(selected.nextNodeId);
        } else {
            console.warn("No matching option for message:", playerMessage);
        }
    }
}
