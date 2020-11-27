function GameMetricsPanel() {

    var metricWrapper;
    var distanceWeight = 300.0;
    var coinWeight = 50.0;

    var agentStatus = false;
    var drawStatus = false;

    this.init = function() {
        
        //this.metricWrapper = document.createElement("div");
        //this.metricWrapper.className = "metric-wrapper";
        //document.getElementsByClassName("main-wrapper")[0].appendChild(this.metricWrapper);
        this.createDistanceSlider();
        this.createCoinSlider();
        this.createPlayButton();
        this.createPauseButton();
        this.displayReward();
        //this.checkDrawStatus();
        //this.createCoinSlider();
    }

    this.displayReward = function() {
        var reward = document.createElement("p");
        reward.className = "reward";
        reward.innerHTML = "Reward function: Distance * Distance-weight + Coins * Coin-weight" ;
        
        document.getElementsByClassName("metric-wrapper")[0].appendChild(reward);
    }

    this.createPlayButton = function() {
        var playBtn = document.createElement("button");
        playBtn.className = "play-button";
        playBtn.innerHTML = "TRAIN";
        document.getElementsByClassName("metric-wrapper")[0].appendChild(playBtn);
    }

    this.createPauseButton = function() {
        var pauseBtn = document.createElement("button");
        pauseBtn.className = "pause-button";
        pauseBtn.innerHTML = "PAUSE TRAINING";
        document.getElementsByClassName("metric-wrapper")[0].appendChild(pauseBtn);
    }

    this.checkAgentStatus = function() {
        document.getElementsByClassName("play-button")[0].onclick = function() {
            console.log("Play button is clicked!");
            agentStatus = true;
        }
        document.getElementsByClassName("pause-button")[0].onclick = function() {
            console.log("Pause button is clicked!");
            agentStatus = false;
        }
        return agentStatus;
    }

    this.checkDrawStatus = function() {
        var plot = document.createElement("button");
        plot.className = "plot";
        plot.innerHTML = "SHOW PLOTS";
        document.getElementsByClassName("metric-wrapper")[0].appendChild(plot);

        document.getElementsByClassName("plot")[0].onclick = function() {
            console.log("Show plot button clicked!");
            drawStatus = true;
        }
    }

    this.createCoinSlider = function() {
        var coinSlider = document.createElement("input");
        coinSlider.type = "range";
        coinSlider.className = "coinSlider";
        coinSlider.innerHTML = "Coins";
        coinSlider.min = 0.0;
        coinSlider.max = 1000.0;
        coinSlider.value = 50.0;

        var coinOutput = document.createElement("p");
        coinOutput.className = "coinSlider-value";
        coinOutput.innerHTML = "Coins collected reward weight: " + coinSlider.value;
        
        document.getElementsByClassName("metric-wrapper")[0].appendChild(coinOutput);
        document.getElementsByClassName("metric-wrapper")[0].appendChild(coinSlider);
        

        // Update the slider
        coinSlider.oninput = function() {
            coinOutput.innerHTML = "Coins collected reward weight: " + this.value;
            this.coinWeight = this.value;
        }
    }

    this.createDistanceSlider = function() {
        var slider = document.createElement("input");
        slider.type = "range";
        slider.className = "slider";
        slider.innerHTML = "Distance";
        slider.min = 0.0;
        slider.max = 1000.0;
        slider.value = 300.0;

        var output = document.createElement("p");
        output.className = "slider-value";
        output.innerHTML = "Distance covered reward weight: " + slider.value;
        
        document.getElementsByClassName("metric-wrapper")[0].appendChild(output);
        document.getElementsByClassName("metric-wrapper")[0].appendChild(slider);
        

        // Update the slider
        slider.oninput = function() {
            output.innerHTML = "Distance covered reward weight: " + this.value;
            this.distanceWeight = this.value;
        }
    }

    this.getDistanceWeight = function() {
        return distanceWeight;
    }

    this.getCoinWeight = function() {
        return coinWeight;
    }

    
}
