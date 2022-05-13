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
            this.player = new Player(this);
            this.input = new InputHandler();
        }
        update(deltaTime) {
            this.player.update(this.input.keys, deltaTime);
        }
        draw(context) {
            this.player.draw(context);
        }
    }

    // game functions //
    const game = new Game(canvas.width, canvas.height);
    console.log(game);
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