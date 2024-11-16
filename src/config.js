import TitleScene from './scenes/TitleScene.js'
import Specialist from './scenes/Specialist.js';
import DoctorOfficeScene from './scenes/DoctorOfficeScene.js';
import Phaser from 'phaser';
import EndPhasePopUp from './scenes/popups/EndPhasePopUp.js';
import HighlightObjectPopUp from './scenes/popups/HighlightObjectPopUp.js';

const config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, otherwise Canvas
    width: 1500,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game in the window
    },
    dom: {
        createContainer: true
    },
    autoRound: false, // No rounding for physics
    parent: 'game-container', // The DOM element to contain the game
    physics: {
        default: 'arcade', // Use the arcade physics engine
        arcade: {
            gravity: { y: 0 },
            debug: true, // Set to true to enable physics debugging
        },
    },
    scene: [TitleScene, DoctorOfficeScene, HighlightObjectPopUp,EndPhasePopUp, Specialist], 
};

export default config;
