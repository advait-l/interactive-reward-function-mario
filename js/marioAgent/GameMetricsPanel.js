function GameMetricsPanel() {

    var metricWrapper;
    var distanceWeight = 50.0;
    var coinWeight = 50.0;

    var agentStatus = false;

    this.init = function() {
        
        //this.metricWrapper = document.createElement("div");
        //this.metricWrapper.className = "metric-wrapper";
        //document.getElementsByClassName("main-wrapper")[0].appendChild(this.metricWrapper);
        this.createDistanceSlider();
        this.createCoinSlider();
        this.createPlayButton();
        this.createPauseButton();
        //this.createCoinSlider();
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
        coinOutput.innerHTML = coinSlider.value;
        
        document.getElementsByClassName("metric-wrapper")[0].appendChild(coinSlider);
        document.getElementsByClassName("coinSlider")[0].appendChild(coinOutput);
        

        // Update the slider
        coinSlider.oninput = function() {
            coinOutput.innerHTML = this.value;
            coinWeight = this.value;
        }
    }

    this.createDistanceSlider = function() {
        var slider = document.createElement("input");
        slider.type = "range";
        slider.className = "slider";
        slider.innerHTML = "Distance";
        slider.min = 0.0;
        slider.max = 1000.0;
        slider.value = 50.0;

        var output = document.createElement("p");
        output.className = "slider-value";
        output.innerHTML = slider.value;
        
        document.getElementsByClassName("metric-wrapper")[0].appendChild(slider);
        document.getElementsByClassName("slider")[0].appendChild(output);
        

        // Update the slider
        slider.oninput = function() {
            output.innerHTML = this.value;
            distanceWeight = this.value;
        }
    }

    this.getDistanceWeight = function() {
        return distanceWeight;
    }

    this.getCoinWeight = function() {
        return coinWeight;
    }

    
}
