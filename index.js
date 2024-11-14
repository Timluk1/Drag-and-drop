class DragAndDrop {
    constructor() {

    }
}

class Block {
    constructor() {
        this.state = {
            text: ""
        }
    }

}

class BuisnesLogic {
    constructor() {
        const button = document.querySelector(".button");
        const input = document.querySelector(".input");

        this.state = {
            button: button,
            input: input,
            text: "",
        }
        this.bindEvents();
    }

    onClickButton(event) {

    }

    onChangeInput(event) {
        this.state.text = event.target.value;
    }

    bindEvents() {
        this.state.button.addEventListener("click", this.onClickButton.bind(this));
        this.state.input.addEventListener("input", this.onChangeInput.bind(this));
    }
}

function main() {

}

main();