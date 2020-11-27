function MarioAgent(){

    var inputs;
    var academy;
    var teacher;
    var agent;
    var agentStatus;
    var drawStatus;

    var keys;

    var gameMetricsPanel;
    
    var that = this;
    var i = 0

    this.init = function() {
        
        console.log("Mario agent initialised")
        const modelFitConfig = {              // Exactly the same idea here by using tfjs's model's
            epochs: 1,                        // fit config.
            stepsPerEpoch: 16
        };

        const numActions = 10;                 // The number of actions your agent can choose to do
        const inputSize = 10;                // Inputs size (10x10 image for instance)
        const temporalWindow = 1;             // The window of data which will be sent yo your agent
                                              // For instance the x previous inputs, and what actions the agent took

        const totalInputSize = inputSize * temporalWindow + numActions * temporalWindow + inputSize;

        const network = new ReImprove.NeuralNetwork();
        network.InputShape = [totalInputSize];
        network.addNeuralNetworkLayers([
            {type: 'dense', units: 32, activation: 'relu'},
            {type: 'dense', units: numActions, activation: 'softmax'}
        ]);
        // Now we initialize our model, and start adding layers
        const model = new ReImprove.Model.FromNetwork(network, modelFitConfig);

        // Finally compile the model, we also exactly use tfjs's optimizers and loss functions
        // (So feel free to choose one among tfjs's)
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'})

        // Every single field here is optionnal, and has a default value. Be careful, it may not
        // fit your needs ...

        console.log("Environment created")
        const teacherConfig = {
            lessonsQuantity: 10,                   // Number of training lessons before only testing agent
            lessonsLength: 100,                    // The length of each lesson (in quantity of updates)
            lessonsWithRandom: 2,                  // How many random lessons before updating epsilon's value
            epsilon: 1,                            // Q-Learning values and so on ...
            epsilonDecay: 0.995,                   // (Random factor epsilon, decaying over time)
            epsilonMin: 0.05,
            gamma: 0.8                             // (Gamma = 1 : agent cares really much about future rewards)
        };

        const agentConfig = {
            model: model,                          // Our model corresponding to the agent
            agentConfig: {
                memorySize: 50000,                      // The size of the agent's memory (Q-Learning)
                batchSize: 128,                        // How many tensors will be given to the network when fit
                temporalWindow: temporalWindow         // The temporal window giving previous inputs & actions
            }
        };

        this.academy = new ReImprove.Academy();    // First we need an academy to host everything
        this.teacher = this.academy.addTeacher(teacherConfig);
        this.agent = this.academy.addAgent(agentConfig);
        this.agentStatus = true;

        this.academy.assignTeacherToAgent(this.agent, this.teacher);


        // Game metrics panel
        if(!gameMetricsPanel){
            this.gameMetricsPanel = new GameMetricsPanel();
            this.gameMetricsPanel.init();
        }
    }

    this.processInputs = function(mario, map, powerUps, goombas) {

        this.inputs = [];
        
        /* Process all the inputs */
        // Mario object
        this.inputs.push(mario.x);
        this.inputs.push(mario.y);

        // Level map
        //that.inputs.push(map);

        // Powerup locations
        //for(let i = 0; i < powerUps.length; i++){
        //    this.inputs.push(powerUps[i].x);
        //    this.inputs.push(powerUps[i].y);
        //}

        // Goombas locations
        for(let i = 0; i < goombas.length; i++){
            this.inputs.push(goombas[i].x);
            this.inputs.push(goombas[i].y);
        }

        //console.log("Input length: ", that.inputs.length);
        //console.log("Mario: ", mario.x, mario.y);
        //console.log("Map: ", map);
        //console.log("Number of Powerups: ", powerUps.length);
        //console.log("Number of enemies: ", goombas.length);


    }

    this.setKeys = function(keys) {
        this.keys = keys;
    }

    this.resetKeys = function() {
        this.keys[16] = false;
        this.keys[17] = false;
        this.keys[37] = false;
        this.keys[38] = false;
        this.keys[39] = false;
    }

    // Shift-Up
    this.pressShiftUp = function() {
        this.resetKeys();
        this.keys[16] = true;
        this.keys[38] = true;
    }
    // Shift-Right
    this.pressShiftRight = function() {
        this.resetKeys();
        this.keys[16] = true;
        this.keys[39] = true;
    }
    // Shift-Left
    this.pressShiftLeft = function() {
        this.resetKeys();
        this.keys[16] = true;
        this.keys[37] = true;
        
    }
    // Shift-Up-Right
    this.pressShiftUpRight = function() {
        this.resetKeys();
        this.keys[16] = true;
        this.keys[38] = true;
        this.keys[39] = true;
    }
    // Shift-Up-Left
    this.pressShiftUpLeft = function() {
        this.resetKeys();
        this.keys[16] = true;
        this.keys[37] = true;
        this.keys[38] = true;
    }
    // Up-Right
    this.pressUpRight = function() {
        this.resetKeys();
        this.keys[38] = true;
        this.keys[39] = true;
    }
    // Up-Left
    this.pressUpLeft = function() {
        this.resetKeys();
        this.keys[37] = true;
        this.keys[38] = true;
    }
    // Up
    this.pressUpArrow = function() {
        this.resetKeys();
        this.keys[38] = true;
    }
    // Right
    this.pressRightArrow = function() {
        this.resetKeys();
        this.keys[39] = true;
    }
    // Left
    this.pressLeftArrow = function() {
        this.resetKeys();
        this.keys[37] = true;
    }
    // Shift
    this.pressShift = function() {
        this.resetKeys();
        this.keys[16] = true;
    }
    this.pressControl = function() {
        this.resetKeys();
        this.keys[17] = true;
    }


    /* Animation loop, update loop, whatever loop you want */
    this.stepLearn = async function() {
    // Need to give a number[] of your inputs for one teacher.

        // Do the pre calculation

        // Step the learning process
        let result = await this.academy.step([               // Let the magic operate ...
            {teacherName: this.teacher, agentsInput: this.inputs}
        ]);

        // Take actions
        if(result != undefined){
            
            var action = result.get(this.agent);

            // Press up arrow
            if(action === 0){
                //console.log("Pressed up key");
                this.pressUpArrow();
            }

            // Press right arrow
            if(action === 1){
                //console.log("Pressed right key");
                this.pressLeftArrow();
            }

            // Press left arrow
            if(action === 2){
                //console.log("Pressed left key");
                this.pressRightArrow();
            }

            // Press up-left
            if(action === 3){
                //console.log("Pressed shift key");
                this.pressUpLeft();
            }

            // Press up-right
            if(action === 4){
                //console.log("Pressed control key");
                this.pressUpRight();
            }

            // Press shift-up arrow
            if(action === 5){
                //console.log("Pressed up key");
                this.pressShiftUp();
            }

            // Press shift-right arrow
            if(action === 6){
                //console.log("Pressed right key");
                this.pressShiftRight();
            }

            // Press shift-left arrow
            if(action === 7){
                //console.log("Pressed left key");
                this.pressShiftLeft();
            }

            // Press shift-up-left
            if(action === 8){
                //console.log("Pressed shift key");
                //this.pressShiftUpLeft();
                this.pressShiftUpRight();
            }

            // Press shift-up-right
            if(action === 9){
                //console.log("Pressed control key");
                this.pressShiftUpRight();
            }
            
        }
    }


    var marioX, marioY;
    var coins;
    // Get the distance, coins collected etc. metrics to give reward to the agent
    this.getMetrics = function(mario, score) {
        //console.log("Mario x before ", mario.x);
        this.marioX = mario.x;
        this.marioY = mario.y;
        this.coins = score.coinScore;        
        this.agentStatus = this.gameMetricsPanel.checkAgentStatus();
        //console.log(this.agentStatus);
    }

    // Compute and give the reward for the mario agent
    this.giveRewards = function(mario, score) {
        var distanceWeight = this.gameMetricsPanel.getDistanceWeight();
        var coinWeight = this.gameMetricsPanel.getCoinWeight();
        //console.log("Mario x after ", mario.x);
        var distance = mario.x - this.marioX;
        var coinsCollected = score.coinScore - this.coins;
        
        //console.log("Distance", distance);
        console.log("Distance weight", distanceWeight);
        console.log("Coin weight", coinWeight);

        var distanceReward = distanceWeight * distance;
        this.academy.addRewardToAgent(this.agent, distanceReward);

        var coinReward = coinWeight * coinsCollected;
        this.academy.addRewardToAgent(this.agent, coinReward);

        //console.log("Distance reward: ", distanceReward);
        //console.log("Coin reward :", coinReward);
    }
}
