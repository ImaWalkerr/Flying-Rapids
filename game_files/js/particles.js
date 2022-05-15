// particles functions //

class Particle {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
    }
    update() {
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) this.markedForDeletion = true;
    }
}

// player attack settings //
// dust from player while running //
class Dust extends Particle {
    constructor(game, x, y) {
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgb(255, 255, 255, 0.5)'; // color dust //
    };
    draw(context) {
        // draw dust attacks as circle //
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}

// splash attack //
class Splash extends Particle {
    constructor(game, x, y) {
        super(game);
        this.image = document.getElementById('playerFireball');
        this.size = Math.random() * 100 + 100; // size of fire effect //
        this.x = x - this.size * 0.4; // width of the splash //
        this.y = y - this.size * 0.5;
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;
    }
    update() {
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

// fire effect for rolling //
class Fire extends Particle {
    constructor(game, x, y) {
        super(game);
        this.image = document.getElementById('playerFireball');
        this.size = Math.random() * 100 + 100; // size of fire effect //
        this.x = x;
        this.y = y;
        this.speedX = 1; // need for fire effect //
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.4 - 0.2; // size of fire effect //
    }
    update() {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);  // left - right movement for particles //
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}