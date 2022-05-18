// flying_game functions //

// load event //
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas_game');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 500;

    // game init //
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 50; // bottom margin for player //
            this.speed = 0;
            this.maxSpeed = 3; // game speed settings //
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = []; // enemies array //
            this.particles = []; // particles array //
            this.collisions = []; // collisions array //
            this.maxParticles = 50;
            this.enemyTimer = 0; // enemies spawn timer //
            this.enemyInterval = 1000; // enemies interval for spawn //
            this.score = 0; // player score //
            this.fontColor = 'black'; // fontColor for score //
            this.debug = true; // turn on/off debug mode //
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime) {
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies //
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                // deleting enemies //
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });
            // handle particles //
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });
            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.splice(0, 50);
            }
            // handle collisions sprites //
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1);
            });
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            // spawn ground enemies when player is moving //
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            // spawn climbing enemies when player is moving //
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    // game functions //
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});