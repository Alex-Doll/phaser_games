var Phaser;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var platforms;
var stars;
var scoreDisplay;
var score = 0;

function preload() {
    this.load.image("sky", "fallingStarsAssets/sky.png");
    this.load.image("platform", "fallingStarsAssets/platform.png");
    this.load.image("star", "fallingStarsAssets/star.png");
    this.load.spritesheet("playerDude", "fallingStarsAssets/dude.png", {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    this.add.image(400, 300, "sky");
    
    player = this.physics.add.sprite(100, 450, "playerDude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("playerDude", {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: "straight",
        frames: [{
            key: "playerDude",
            frame: 4
        }],
        frameRate: 20,
    });
    
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("playerDude", {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    
    
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "platform").setScale(2).refreshBody();
    
    stars = this.physics.add.group({
        key: "star",
        repeat: 5,
        setXY: {
            x: Phaser.Math.FloatBetween(0.1, 0.9) * config.width,
            y: 0
        }
    });
    stars.children.iterate(function(child) {
        child.setBounce(Phaser.Math.FloatBetween(0.75, 0.95));
        child.x = Phaser.Math.FloatBetween(0.05, 0.95) * config.width;
    });
    scoreDisplay = this.add.text(20, 20, "SCORE: 0", {
        fontSize: "24px",
        fill: "#000"
    });
    
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, pickupStar, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);
        player.anims.play("straight", true);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    }
}

function pickupStar(player, star) {
    star.disableBody(true, true);
    
    score += 10;
    scoreDisplay.setText("SCORE: " + score);
    
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            var newX = Phaser.Math.FloatBetween(0.05, 0.95) * config.width;
            child.enableBody(true, newX, 0, true, true);
        });
    }
}