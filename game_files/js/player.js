// player functions //

class Player {
    constructor(game) {
        this.game = game;
        this.width = 100; // player 1 frame width //
        this.height = 91.3; // player 1 frame height //
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 0.3; // for gravity //
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame; // frame for each animation - set in player states //
        this.fps = 30; // fps for sprite //
        this.frameInterval = 1000/this.fps; // need for fps control update assets //
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3; // player speed //
        this.states = [ // index import must be same as index in the array //
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game)
        ];
    }
    update(input, deltaTime) {
        // collision //
        this.checkCollision();
        // for handle method //
        this.currentState.handleInput(input);

        // horizontal movement //
        this.x += this.speed;
        if (input.includes('d')) this.speed = this.maxSpeed; // move player right //
        else if (input.includes('a')) this.speed = -this.maxSpeed; // move player left //
        else this.speed = 0;

        // horizontal boundaries //
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // player cant run outside game window //
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement //
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // vertical boundaries //
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation //
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }

    }
    // draw player from assets //
    draw(context) {
        // draw 1 player frame //
        // for debug mode //
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    // player stands on a ground //
    onGround () {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    // switch player states //
    setState (state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    // collision detection between rectangles //
    checkCollision() {
        this.game.enemies.forEach(enemy => {
           if (
               enemy.x < this.x + this.width &&
               enemy.x + enemy.width > this.x &&
               enemy.y < this.y + this.height &&
               enemy.y + enemy.height > this.y
           ){
               // collision detected //
               enemy.markedForDeletion = true;
               this.game.collisions.push(new CollisionAnimation(
                   this.game,
                   enemy.x * enemy.width * 0.5,
                   enemy.y * enemy.height * 0.5
               ));
               // if player in rolling or diving states - destroy enemy + 1 score //
               if (this.currentState === [4] || this.currentState === [5]) {
                   this.game.score++;
               } else {
                    this.setState(6, 0);
               }
           }
        });
    }
}