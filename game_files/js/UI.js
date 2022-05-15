// UI functions //

class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30; // fontSize for score //
        this.fontFamily = 'Roboto, cursive' ; // fontFamily for score //
    }
    draw(context) {
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // score //
        context.fillText('Score: ' + this.game.score, 20, 50);
    }
}