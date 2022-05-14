// enemies functions //

class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20; // fps for enemies assets //
        this.frameInterval = 1000/this.fps; // need to control enemies fps //
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update (deltaTime) {
        // movement //
        this.x -= this.speedX; // this.x -= this.speedX + this.game.speed; //
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // check if off screen //
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw (context) {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

// using js subclassing - enemy superclass, flying and etc - subclasses//
// flying enemies settings //
class FlyingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60; // params for enemy flying asset //
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5; // enemies starting in right windows part //
        this.y = Math.random() * this.game.height * 0.5; // position for flying enemy //
        this.speedX = Math.random() + 1; // enemies random speed //
        this.speedY = 0
        this.maxFrame = 5;
        this.image = document.getElementById('enemyFlying');
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime) {
        super.update(deltaTime);
        // up - down enemies movement //
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

// ground enemies settings //
class GroundEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60; // params for enemy on ground asset //
        this.height = 87;
        this.x = this.game.width + Math.random(); // enemies starting in right windows part //
        this.y = this.game.height - this.height - this.game.groundMargin; // position for ground enemy //
        this.image = document.getElementById('enemyGround');
        this.speedX = Math.random() + 0.5;
        this.speedY = 0;
        this.maxFrame = 1;
    }
}

// climbing enemies settings //
class ClimbingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width; // enemies starting in right windows part //
        this.y = Math.random() * this.game.height * 0.5; // position for ground enemy //
        this.image = document.getElementById('enemyClimbing');
        this.speedX = Math.random() + 0.5;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltaTime) {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true;
    }
    draw(context) {
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0);
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.stroke();
    }
}