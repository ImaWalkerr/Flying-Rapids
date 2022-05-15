// player states functions //

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

// Sitting state settings //
class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }
    handleInput(input) {
        if (input.includes('a') ||
            input.includes('d')) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

// using js subclassing //
// Running state settings //
class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }
    enter () {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input) {
        this.game.particles.unshift(new Dust(
            this.game,
            this.game.player.x + this.game.player.width * 0.6,
            this.game.player.y + this.game.player.height
        ));
        if (input.includes('s')) {
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('w')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

// Jumping state settings //
class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter () {
        if (this.game.player.onGround()) this.game.player.vy -= 15; // player jumping height //
        this.game.player.speed = -this.game.player.maxSpeed * 0.5; // player jumping speed //
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
            // dive attack while rolling //
        } else if (input.includes('s') && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

// Falling state settings //
class Falling extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter () {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
            // dive attack while rolling //
        } else if (input.includes('s') && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

// Rolling state settings //
class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
    }
    enter () {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }
    handleInput(input) {
        // player fire effect when rolling //
        this.game.particles.unshift(new Fire(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height * 0.5
        ));
        // rolling while enter pressed - player stay on ground//
        if (!input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        // rolling while enter pressed - player falling//
        } else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (
            input.includes('Enter') &&
            input.includes('w') &&
            this.game.player.onGround()
        ) {
            this.game.player.vy -= 15; // allow to rolling in jump //
            this.game.player.speed = -this.game.player.maxSpeed * 0.5; // player jumping speed //
            // dive attack while rolling //
        } else if (input.includes('s') && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

// 'Diving' rolling down attack state settings //
class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }
    enter () {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15;
    }
    handleInput(input) {
        // player fire effect when rolling //
        this.game.particles.unshift(new Fire(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height * 0.5
        ));
        // rolling while enter pressed - player stay on ground//
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            // splash effect when player used diving attack //
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(
                    this.game,
                    this.game.player.x + this.game.player.width * 0.5,
                    this.game.player.y + this.game.player.height
                ));
            }
        // rolling while enter pressed - player falling//
        } else if (input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

// when player get hit state settings //
class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }
    enter () {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }
    handleInput(input) {
        // when getting hit - player switch to running state//
        if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        // when getting hit - player switch to falling state//
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}