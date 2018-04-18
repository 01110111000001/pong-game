var GameScene = new Phaser.Scene('GameScene');
GameScene.preload = function () {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', '/assets/skies/wtf.png');
    this.load.image('particle', 'assets/particles/cloud.png');
    this.load.image('ball', 'assets/sprites/aqua_ball.png');
}

GameScene.create = function () {
    // Initialize Scene Graphics
    this.bg = this.add.image(0, 0, 'sky').setOrigin(0,0);

    // Initialize Ball Graphics
    this.ball = this.physics.add.image(window.innerWidth/2, window.innerHeight/2, 'ball');
    this.ball.setVelocity(100, 0.5);
    this.ball.setBounce(1, 1); //Increase difficulty
    this.ball.setCollideWorldBounds(true);

    var particles = this.add.particles('particle');

    var emitter = particles.createEmitter({
        speed: 10,
        scale: { start: 0.1, end: 0 },
        blendMode: 'ADD'
    });

    emitter.startFollow(this.ball);

    // Initialize Players
    // Todo
}

var game, socket;

socket = io.connect();
socket.on("connect", function(){
    console.log("connected to server.", socket.id);
    main();
});

var config = {
    type: Phaser.AUTO,
    width: 300, //window.innerWidth * window.devicePixelRatio,
    height: 300, //window.innerHeight * window.devicePixelRatio,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    //plugins: ['Loader', 'TweenManager'],
    autoStart: true,
    scene: GameScene
};


function main() {
    var playerId = socket.emit('request_player', 'Madlaina', function(data) {
        console.log(data);
        return data
    });
    game = new Phaser.Game(config);
}








/*var game

socket.on("connect", onSocketConnected);

function main() {
    //workaround -> can't find phaser 3 internal state machine
    game = new Phaser.Game(config);
}

function preload ()
{
    console.log("hlelo preload")
}

function create ()
{
    console.log("hlelo asd")
    cursors = this.input.keyboard.createCursorKeys();

}

function resize (width, height) {
    // Handle Resizing
}

function update () {
    if (cursors.up.isDown) {
        game.scene.pause()
        console.log("up", this.scene.scene.key)
        //console.log(game.scene.isSleeping(game.getScene()))
    } else if (cursors.down.isDown) {
        console.log("down")
        game.scene.resume()
    }
}

// startGame workaround
function onSocketConnected () {
    console.log("connected to server:", socket);
    main()
}*/

window.addEventListener('resize', function (event) {

    game.resize(window.innerWidth, window.innerHeight);
    /* if (this.mobile) {
    //
        if (window.innerWidth < window.innerHeight) {
            this.leaveIncorrectOrientation();
        } else {
            this.enterIncorrectOrientation();
        }
    }*/

}, false);