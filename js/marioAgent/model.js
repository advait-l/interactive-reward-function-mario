function MarioAgent(){

    var inputs;
    var academy;
    var teacher;
    var agent;

    var keys;
    
    var that = this;
    var i = 0

    this.init = function() {
        
        console.log("Mario agent initialised")
        const modelFitConfig = {              // Exactly the same idea here by using tfjs's model's
            epochs: 1,                        // fit config.
            stepsPerEpoch: 16
        };

        const numActions = 4;                 // The number of actions your agent can choose to do
        const inputSize = 14;                // Inputs size (10x10 image for instance)
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

        this.academy.assignTeacherToAgent(this.agent, this.teacher);

    }

    this.processInputs = function(mario, map, powerUps, goombas) {

        that.inputs = [];
        
        /* Process all the inputs */
        // Mario object
        that.inputs.push(mario.x);
        that.inputs.push(mario.y);

        // Level map
        //that.inputs.push(map);

        // Powerup locations
        for(let i = 0; i < powerUps.length; i++){
            that.inputs.push(powerUps[i].x);
            that.inputs.push(powerUps[i].y);
        }

        // Goombas locations
        for(let i = 0; i < goombas.length; i++){
            that.inputs.push(goombas[i].x);
            that.inputs.push(goombas[i].y);
        }

        //console.log("Input length: ", that.inputs.length);
        //console.log("Mario: ", mario.x, mario.y);
        //console.log("Map: ", map);
        //console.log("Number of Powerups: ", powerUps.length);
        console.log("Number of enemies: ", goombas.length);


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

    this.pressUpArrow = function() {
        this.resetKeys();
        this.keys[38] = true;
    }

    this.pressRightArrow = function() {
        this.resetKeys();
        this.keys[39] = true;
    }

    this.pressLeftArrow = function() {
        this.resetKeys();
        this.keys[37] = true;
    }
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
                this.pressRightArrow();
            }

            // Press left arrow
            if(action === 2){
                //console.log("Pressed left key");
                this.pressLeftArrow();
            }

            // Press shift
            if(action === 3){
                //console.log("Pressed shift key");
                this.pressShift();
            }

            // Press control
            if(action === 4){
                //console.log("Pressed control key");
                this.pressControl();
            }
        }
    }

    // Nice event occuring during world emulation
    function OnSpecialGoodEvent() {
        this.academy.addRewardToAgent(this.agent, 1.0)        // Give a nice reward if the agent did something nice !
    }

    // Bad event
    function OnSpecialBadEvent() {
        this.academy.addRewardToAgent(this.agent, -1.0)        // Give a bad reward to the agent if he did something wrong
    }

    var marioX, marioY;
    var coins;
    // Get the distance, coins collected etc. metrics to give reward to the agent
    this.getMetrics = function(mario, score) {
        //console.log("Mario x before ", mario.x);
        this.marioX = mario.x;
        this.marioY = mario.y;
        this.coins = score.coinScore;        
    }

    var distanceWeight = 1.0;
    var coinWeight = 5.0;
    // Compute and give the reward for the mario agent
    this.giveRewards = function(mario, score) {
        //console.log("Mario x after ", mario.x);
        var distance = mario.x - this.marioX;
        var coinsCollected = score.coinScore - this.coins;
        
        //console.log("Distance", distance);
        //console.log("Distance weight", distanceWeight);

        var distanceReward = distanceWeight * distance;
        this.academy.addRewardToAgent(this.agent, distanceReward);

        var coinReward = coinWeight * coinsCollected;
        this.academy.addRewardToAgent(this.agent, coinReward);

        console.log("Distance reward: ", distanceReward);
        console.log("Coin reward :", coinReward);
    }
}
