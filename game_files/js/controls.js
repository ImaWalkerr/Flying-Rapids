// player controls functions //


class InputHandler {
    constructor() {
        // need for checking specific key is pressed //
        this.keys = [];
        window.addEventListener('keydown', event => {
            if ((   event.key === 'w' ||
                    event.key === 's' ||
                    event.key === 'a' ||
                    event.key === 'd' ||
                    event.key === 'Enter'
            ) && this.keys.indexOf(event.key) === -1) {
                this.keys.push(event.key);
            }
            console.log(event.key, this.keys);
        });


        window.addEventListener('keyup', event => {
            if (    event.key === 'w' ||
                    event.key === 's' ||
                    event.key === 'a' ||
                    event.key === 'd' ||
                    event.key === 'Enter'
            ) {
                this.keys.splice(this.keys.indexOf(event.key), 1);
            }
            console.log(event.key, this.keys);
        });
    }
}