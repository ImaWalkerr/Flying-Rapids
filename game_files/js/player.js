// player functions //

class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1; // for gravity //
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame; // frame for each animation - set in player states //
        this.fps = 30; // fps for sprite //
        this.frameInterval = 1000/this.fps; // need for fps control update assets //
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3; // player speed //
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)]; // index import must be same as index in the array //
        this.currentState = this.states[0];
        this.currentState.enter();
    }
    update(input, deltaTime) {
        // for handle method //
        this.currentState.handleInput(input);

        // horizontal movement //
        this.x += this.speed;
        if (input.includes('d')) this.speed = this.maxSpeed; // move player right //
        else if (input.includes('a')) this.speed = -this.maxSpeed; // move player left //
        else this.speed = 0;

        // player cant run outside game window //
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement //
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

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
}