function GameMetricsPanel() {

    var metricWrapper;
    var distanceWeight;
    var coinWeight;

    this.init = function() {
        
        this.metricWrapper = document.createElement("div");
        this.metricWrapper.className = "metric-wrapper";
        document.getElementsByClassName("main-wrapper")[0].appendChild(this.metricWrapper);
        this.createDistanceSlider();
        //this.createCoinSlider();
    }

    this.createDistanceSlider = function() {
        var slider = document.createElement("input");
        slider.type = "range";
        slider.innerHTML = "Distance";
        document.getElementsByClassName("metric-wrapper")[0].appendChild(slider);
    }

    
}
