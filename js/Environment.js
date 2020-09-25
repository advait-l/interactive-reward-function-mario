function Environment(){
    
    // Default environment
    this.init = function(){
        
        this._actions = new Array();
        this._observations = new Array();
        this._state = new Array();
        this._episode_ended = false;
    
    }

    this.getFrame = function(){

        var gameUI = GameUI.getInstance();
        var canvas = gameUI.getCanvas();
        var ctx = canvas.getContext("2d");
        //var canvas = document.getElementsByClassName("game-screen")[0];

        console.log(canvas);

        var video = document.querySelector("video");
        console.log(video);

        var stream = canvas.captureStream(10);
        video.srcObject = stream;
        video.play();






    }

}
