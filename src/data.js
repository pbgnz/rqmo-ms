export const GAME_DATA = {
    "nodes": {
      "0": {
        "prompt": "Welcome to the doctor’s office! I’m all ears, stethoscope optional. What brings you in today?",
        "scene": "DoctorOfficeScene"
      },
      "1_1": {
        "prompt": "Shall we chat about your mysterious ailments, or skip the foreplay and dive into tests?",
        "scene": "DoctorOfficeScene"
      },
      "1_2": {
        "prompt": "Any odd patterns or suspicious triggers you’ve noticed? Anything weird counts.",
        "scene": "DoctorOfficeScene"
      },
      "2_1": {
        "prompt": "Based on what you’ve told me, I think seeing a specialist would be best. They've got bigger magnifying glasses than I do.",
        "scene": "DoctorOfficeScene" // Assuming referral happens here, next step is specialist scene
      },
      "2_2": {
        "prompt": "We could start with some basic tests—nothing too medieval—before calling in the specialist cavalry.",
        "scene": "SpecialistScene" // Scene change indicates specialist handles tests
      },
      "3_1": {
        "prompt": "We can do some blood work or schedule an MRI. Or both, if you’re feeling spicy. What’s your preference?",
        "scene": "SpecialistScene"
      },
      "3_2": {
        "prompt": "Do you notice your symptoms get worse when something weird happens—like full moons or tax season?",
        "scene": "SpecialistScene"
      },
      "3_3": {
        "prompt": "Go on, I’m ready for the deluxe edition of your symptom story.",
        "scene": "SpecialistScene"
      },
      "4_1": {
        "prompt": "Your blood work came back... confusing. Like a crossword puzzle filled out by a raccoon. Let’s discuss what’s next.",
        "scene": "SpecialistScene"
      },
      "4_2": {
        "prompt": "The MRI shows some unusual activity. Your brain might be picking up extra dimensions. Intriguing.",
        "scene": "SpecialistScene"
      },
      // Added a transition node after Doctor recommends specialist
      "2_1_Transition": {
        "prompt": "Alright, I'm referring you to our specialist. They'll be able to run more detailed diagnostics.",
        "scene": "DoctorOfficeScene" // Still in Doctor's office for referral
      },
      // Added node for specialist introduction
      "Specialist_Intro": {
          "prompt": "Hello, I'm the specialist Dr. Quantum referred you to. I understand you're experiencing some unusual symptoms. Let's figure this out. Where would you like to start?",
          "scene": "SpecialistScene"
      },
      "5_1": {
        "prompt": "We’ve identified a rare condition: Quantum Spine Drift. Don’t worry—we’ve got a treatment plan involving gravity stabilizers.",
        "scene": "SpecialistScene"
      },
      "5_2": {
        "prompt": "The diagnosis is Neurofluff Syndrome. It’s rare, mildly ridiculous, but entirely treatable with humor and a bit of science.",
        "scene": "SpecialistScene"
      },
      "5_3": {
        "prompt": "You’re showing signs of Hyperdimensional Fatigue Syndrome. It sounds intense, but we’ve seen weirder. Time for a management plan.",
        "scene": "SpecialistScene"
      }
    },
    "edges": {
      "0": [
        {
          "to": "1_1",
          "actions": [
            { "message": "I’d like to discuss my symptoms.", "stressScore": 5, "diagnosticScore": 10, "painScore": 5 },
            { "message": "I’d like to proceed with some tests.", "stressScore": 8, "diagnosticScore": 15, "painScore": 5 }
          ]
        },
        {
          "to": "1_2",
          "actions": [
            { "message": "I’ve noticed my symptoms worsen after physical activity.", "stressScore": 10, "diagnosticScore": 12, "painScore": 10 },
            { "message": "Stress seems to make my symptoms worse.", "stressScore": 8, "diagnosticScore": 10, "painScore": 8 }
          ]
        }
      ],
      "1_1": [
        {
          "to": "2_1", // Still go to specialist recommendation if player agrees
          "actions": [
            { "message": "I think seeing a specialist would be best.", "stressScore": 5, "diagnosticScore": 15, "painScore": 5 }
          ]
        },
        {
           // ***FIX 1: Changed 'to' from 2_1 to 2_2***
          "to": "2_2",
          "actions": [
            { "message": "Can we start with some tests first?", "stressScore": 8, "diagnosticScore": 10, "painScore": 5 }
          ]
        }
      ],
      "1_2": [
        {
          "to": "2_2", // Leads to basic tests
          "actions": [
            { "message": "Let’s start with some basic tests.", "stressScore": 5, "diagnosticScore": 10, "painScore": 5 }
          ]
        },
        {
          "to": "2_1", // Leads to specialist recommendation
          "actions": [
            { "message": "I’d prefer to see a specialist right away.", "stressScore": 10, "diagnosticScore": 15, "painScore": 8 }
          ]
        }
      ],
      // Added transition from Doctor recommending specialist
      "2_1": [
        {
            "to": "2_1_Transition", // Go to transition node
            "actions": [ // Only one logical action here: accept the referral
                {"message": "Okay, please refer me to the specialist.", "stressScore": 2, "diagnosticScore": 5, "painScore": 0 }
            ]
        }
      ],
      "2_1_Transition": [
        {
            "to": "Specialist_Intro", // Specialist takes over
            "actions": [
                {"message": "Understood, thank you.", "stressScore": 0, "diagnosticScore": 0, "painScore": 0}
            ]
        }
      ],
      // Path from Specialist Introduction
       "Specialist_Intro": [
            {
                "to": "3_1", // Offer specific tests
                "actions": [
                    {"message": "Let's discuss possible tests.", "stressScore": 5, "diagnosticScore": 10, "painScore": 5}
                ]
            },
            {
                "to": "3_3", // Ask for more symptom details
                "actions": [
                    {"message": "I'd like to describe my symptoms in more detail first.", "stressScore": 3, "diagnosticScore": 8, "painScore": 3}
                ]
            }
       ],
      // Path from Doctor suggesting basic tests (handled by Specialist)
      "2_2": [
        {
          "to": "3_2", // Ask about weird triggers
          "actions": [
            { "message": "I’ve noticed cold weather makes my symptoms worse.", "stressScore": 8, "diagnosticScore": 12, "painScore": 10 },
            { "message": "My symptoms seem to worsen after intense exercise.", "stressScore": 10, "diagnosticScore": 15, "painScore": 8 }
          ]
        },
        {
          "to": "3_3", // Ask for more general symptom details
          "actions": [
            { "message": "I’d like to provide more information about my symptoms.", "stressScore": 5, "diagnosticScore": 10, "painScore": 5 }
          ]
        }
      ],
      // Specialist offers specific tests
      "3_1": [
        {
          "to": "4_1", // Had blood work
          "actions": [
            // Message changed slightly to reflect *doing* the test then discussing
            { "message": "Let's proceed with blood work.", "stressScore": 10, "diagnosticScore": 15, "painScore": 5 }
          ]
        },
        {
          "to": "4_2", // Had MRI
          "actions": [
            // Message changed slightly
            { "message": "I’d prefer to schedule an MRI.", "stressScore": 15, "diagnosticScore": 20, "painScore": 10 }
          ]
        }
      ],
      // Specialist asks about weird triggers
      "3_2": [
        // ***FIX 3: Removed edge leading directly to MRI results (4_2)***
        {
          "to": "3_3", // Offer more symptom details after discussing triggers
          "actions": [
            { "message": "Let me tell you more about my symptoms generally.", "stressScore": 5, "diagnosticScore": 10, "painScore": 5 }
          ]
        },
        {
          "to": "3_1", // After discussing triggers, move to selecting tests
          "actions": [
              {"message": "Okay, what tests can we run to investigate?", "stressScore": 7, "diagnosticScore": 12, "painScore": 6 }
          ]
        }
      ],
      // Specialist asks for deluxe symptom story
      "3_3": [
         // ***FIX 4: Removed edge leading directly to blood results (4_1)***
         // Add edge leading back to test selection after giving details
         {
            "to": "3_1",
            "actions": [
                {"message": "Okay, I've explained more. What tests do you recommend now?", "stressScore": 5, "diagnosticScore": 15, "painScore": 5}
            ]
         }
      ],
      // Discuss confusing blood work
      "4_1": [
        {
          "to": "5_1", // Diagnosis 1
          "actions": [
            { "message": "What does this mean for my condition?", "stressScore": 15, "diagnosticScore": 25, "painScore": 12 }
          ]
        },
        {
          "to": "5_3", // Diagnosis 3
          "actions": [
            { "message": "Are there any other possible diagnoses?", "stressScore": 10, "diagnosticScore": 20, "painScore": 8 }
          ]
        }
      ],
      // Discuss unusual MRI
      "4_2": [
        {
          "to": "5_2", // Diagnosis 2
          "actions": [
            { "message": "That sounds serious. What’s the next step?", "stressScore": 10, "diagnosticScore": 22, "painScore": 8 }
          ]
        },
        {
          "to": "5_3", // Diagnosis 3
          "actions": [
            { "message": "Could this be related to Chronic Fatigue Syndrome?", "stressScore": 8, "diagnosticScore": 18, "painScore": 6 }
          ]
        }
      ]
      // Nodes 5_1, 5_2, 5_3 are terminal (no edges originating from them)
    }
  };