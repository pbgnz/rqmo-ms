import { GAME_DATA } from '../data'; // Ensure correct path
import { ChatBox, ChatDropdownInput } from '../gameobjects/Chat'; // Ensure correct path
import background from '../assets/images/specialist-background.png'; // Ensure correct path
// Assuming specialist character sprite is needed, adjust if not
import specialistSprite from '../assets/images/doctor.png'; // Ensure correct path for specialist sprite
import BaseScene from './BaseScene'; // Ensure correct path

export default class SpecialistScene extends BaseScene {
    constructor() {
        super({ key: 'SpecialistScene' });
        this.pendingOptions = []; // Initialize pendingOptions
        this.currentNode = null; // Initialize currentNode
    }

    preload() {
        super.preload();
        this.load.image('SpecialistBackground', background);
        // Load the specialist sprite sheet - adjust frame dimensions if needed
        this.load.spritesheet('specialist', specialistSprite, { frameWidth: 32, frameHeight: 48 });
        // Preload other assets if needed (like patient sprite if shown)
    }

    create(data) {
        super.create(data); // Calls BaseScene create

        if (this.scoreDisplay) {
            this.scoreDisplay.setScene(this);
            this.scoreDisplay.updateScores(); // Update display with current scores
        } else {
            console.error("ScoreDisplay not initialized in SpecialistScene create");
        }


        // Add background
        this.add.image(this.width / 2, this.height / 2, 'SpecialistBackground').setDisplaySize(this.width, this.height);

        // Add specialist character sprite (example position)
        // Adjust position and scale as needed
        this.add.sprite(this.width * 0.75, this.height / 2, 'specialist').setScale(4);

        // Create ChatBox
        this.createChatBox(); // ChatBox needs to be created before starting dialogue

        const startNodeId = data?.currentNode || 'Specialist_Intro';
        console.log(`SpecialistScene starting dialogue at node: ${startNodeId}`);

        // Start the dialogue using the determined node ID
        this.startDialogue(startNodeId);
    }

    createChatBox() {
        const rectHeight = this.height / 4;
        const rectMargin = 0.1 * this.width;
        // Ensure ChatBox is created and listener is added
        this.chatBox = new ChatBox(this, rectMargin, this.height - rectHeight - 20, this.width - 2 * rectMargin, rectHeight, ChatDropdownInput);
        this.chatBox.chatController.addListener(this); // Add this scene as a listener for chat events
        console.log("ChatBox created and listener added in SpecialistScene.");
    }

    startDialogue(nodeId) {
        // Ensure the node exists in GAME_DATA
        const node = GAME_DATA.nodes[nodeId];
        if (node) {
            console.log(`Starting dialogue for node ${nodeId}: "${node.prompt}"`);
            this.currentNode = nodeId; // Update the current node tracker
            this.updateChatBox(nodeId); // Update message and options
        } else {
            console.error(`Node ${nodeId} not found in GAME_DATA.`);
            // Handle error, maybe go to a default state or show an error message
        }
    }

    updateChatBox(nodeId) {
        // Update the specialist's message and the player's options
        this.updateSpecialistMessage(nodeId);
        this.updatePlayerOptions(nodeId);
    }

    updateSpecialistMessage(nodeId) {
        const node = GAME_DATA.nodes[nodeId];
        if (node && this.chatBox) {
             // Use the correct sender name
            this.chatBox.chatController.addMessage({ sender: 'Specialist', message: node.prompt });
        } else {
            if (!node) console.error(`Node ${nodeId} not found for specialist message.`);
            if (!this.chatBox) console.error("ChatBox not available for specialist message.");
        }
    }

    updatePlayerOptions(nodeId) {
        // Get edges (potential actions) for the current node
        const edges = GAME_DATA.edges[nodeId] || [];
        // Flatten the actions from all edges into a list of options
        const options = edges.flatMap(edge =>
            edge.actions.map(action => ({
                text: action.message, // The text displayed to the player
                nextNodeId: edge.to // The node ID this action leads to
                // We don't need the raw action object here anymore
            }))
        );

        // Store these options to check against player input later
        this.pendingOptions = options;

        // Update the dropdown input with the text of the options
        if (this.chatBox && this.chatBox.chatInput instanceof ChatDropdownInput) {
            this.chatBox.chatInput.setOptions(options.map(option => option.text));
             console.log(`Set options for node ${nodeId}:`, options.map(o => o.text));
        } else {
             if (!this.chatBox) console.error("ChatBox not available for setting player options.");
             else console.error("ChatInput is not of type ChatDropdownInput or not found.");
        }
    }

    handleOptionSelection(nextNodeId) {
        // Check if the next node exists
        const nextNode = GAME_DATA.nodes[nextNodeId];
        if (!nextNode) {
            console.error(`Selected next node ${nextNodeId} does not exist in GAME_DATA.`);
            return; // Stop processing if the node is invalid
        }

        console.log(`Handling selection. Next node: ${nextNodeId}`);

        if (['5_1', '5_2', '5_3'].includes(nextNodeId)) {
            const finalSceneMessage = nextNode.prompt || "Diagnosis complete. Let's review the findings.";
            console.log(`Launching EndPhasePopUp with message: ${finalSceneMessage}`);
            this.scene.launch('EndPhasePopUp', { message: finalSceneMessage, nextScene: 'TitleScene' });
        } else {
            console.log(`Continuing dialogue in SpecialistScene at node ${nextNodeId}`);
            this.startDialogue(nextNodeId);
        }
    }

    onNewMessage(message) {
        const playerMessageText = typeof message === 'string' ? message : message?.message;

        if (!playerMessageText || !this.pendingOptions || this.pendingOptions.length === 0) {
            console.warn("Received message but no pending options or message text is empty:", playerMessageText, this.pendingOptions);
            return; // Exit if there's nothing to compare
        }

        console.log(`SpecialistScene received message: "${playerMessageText}"`);
        console.log("Pending options:", this.pendingOptions.map(o => o.text));

        const selectedOption = this.pendingOptions.find(
            opt => opt.text.trim().toLowerCase() === playerMessageText.trim().toLowerCase()
        );

        if (selectedOption) {
            console.log(`Matched option: "${selectedOption.text}", leads to node: ${selectedOption.nextNodeId}`);
            super.newMessage({ sender: 'Player', message: selectedOption.text });

            const currentHead = this.gameTree.getHead();
            if (currentHead && currentHead.scene === this.scene.key) {
                 this.updateChatBox(currentHead.id);


            } else {
                 console.log("Scene changed by BaseScene.newMessage, SpecialistScene doing nothing further.");
            }


        } else {
            console.warn(`No matching option found in SpecialistScene for message: "${playerMessageText}"`);
        }
    }
}
