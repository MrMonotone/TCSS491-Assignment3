function GameManager(ctx)
{
    this.ctx = ctx;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.clockTick = 0;
	this.im = null; // InputManager
    this.am = null; // AssetManager
    this.em = null; // EntityManager
	this.gamePaused = false;
    this.timer = null;   
}

/* loads the starting map and character's starting position. */
GameManager.prototype.initialize = function ()
{
	this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
	this.timer = new Timer();
    this.im.addInput(new Input("pause", "p"));
    this.im.addInput(new Input("save", "s"));
    this.im.addInput(new Input("load", "l"))
    this.addEntities();
    this.im.start();
    console.log('game initialized');
}

GameManager.prototype.addEntities = function () 
{
    for (var i = 0; i < NUM_OF_CIRCLES; i++) 
    {
        gm.em.addEntity(new Circle({color: rainbow(NUM_OF_CIRCLES, i)}));
    }
}

GameManager.prototype.initManagers = function (params) {
    this.em = new EntityManager();
	this.im = new InputManager("Game");
	console.log("Managers Initialized");
}

GameManager.prototype.start = function()
{
	this.initManagers();
    this.initialize();
    this.loop();
}

GameManager.prototype.loop = function () {
    if(this.im.checkInput("pause"))
    {
        this.gamePaused = !this.gamePaused;
        this.im.setFalse("pause");
    }
    
    if(this.im.checkInput("save"))
    {
        this.gamePaused = true;
        socket.emit("save", { studentname: "Nicholas Mousel", statename: "state", data: gm.em.entities });
        this.gamePaused = false;
        this.im.setFalse("pause");
    }
    if(this.im.checkInput("load"))
    {
        this.gamePaused = this.gamePaused;
        socket.emit("load", { studentname: "Nicholas Mousel", statename: "state" });
        this.im.setFalse("pause");
    }
    if(!this.gamePaused)
    {
        this.clockTick = this.timer.tick();
        this.em.update();
        this.em.draw();
    }
    requestAnimationFrame(this.loop.bind(this), this.ctx.canvas);
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}