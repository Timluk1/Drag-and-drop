class WordOrganizer {
    constructor() {
        this.button = document.querySelector(".button");
        this.input = document.querySelector(".input");
        this.block3 = document.getElementById("block3");
        this.block2 = document.getElementById("block2");
        this.selectedText = document.querySelector(".selected-text");

        this.button.addEventListener("click", () => this.organizeWords());
    }

    organizeWords() {
        const words = this.input.value.split("-");
        const categories = { a: [], b: [], n: [] };

        words.forEach((word) => {
            if (!isNaN(word)) {
                categories.n.push(word);
            } else if (word[0] === word[0].toUpperCase()) {
                categories.b.push(word);
            } else {
                categories.a.push(word);
            }
        });

        categories.a.sort();
        categories.b.sort();
        categories.n.sort((a, b) => a - b);

        this.renderWords(categories);
    }

    renderWords(categories) {
        this.block3.innerHTML = "";

        let keyCounter = { a: 1, b: 1, n: 1 };

        Object.keys(categories).forEach((category) => {
            categories[category].forEach((word) => {
                const wordElement = document.createElement("div");
                wordElement.classList.add("word", "initial-word");
                wordElement.draggable = true;

                const key = `${category}${keyCounter[category]++}`;
                wordElement.setAttribute("data-key", key);
                wordElement.setAttribute("data-category", category);
                wordElement.textContent = `${key}: ${word}`;

                wordElement.addEventListener(
                    "dragstart",
                    this.dragStart.bind(this)
                );

                this.block3.appendChild(wordElement);
            });
        });
    }

    dragStart(event) {
        event.dataTransfer.setData(
            "text",
            event.target.getAttribute("data-key")
        );
    }

    sortAndRenderBlock3() {
        const words = Array.from(this.block3.children);
        words.sort((a, b) => {
            const [aCategory, aIndex] = a
                .getAttribute("data-key")
                .match(/([a-z]+)(\d+)/)
                .slice(1);
            const [bCategory, bIndex] = b
                .getAttribute("data-key")
                .match(/([a-z]+)(\d+)/)
                .slice(1);

            if (aCategory === bCategory)
                return parseInt(aIndex) - parseInt(bIndex);
            return aCategory.localeCompare(bCategory);
        });

        this.block3.innerHTML = "";
        words.forEach((word) => this.block3.appendChild(word));
    }
}

class DragAndDrop {
    constructor(wordOrganizer) {
        this.block2 = document.getElementById("block2");
        this.block3 = document.getElementById("block3");

        this.colorMap = new Map(); // Map для хранения цветов элементов
        this.wordOrganizer = wordOrganizer; // Передаем объект WordOrganizer

        [this.block2, this.block3].forEach((block) => {
            block.addEventListener("dragover", this.allowDrop.bind(this));
            block.addEventListener("drop", this.drop.bind(this));
        });
    }

    allowDrop(event) {
        event.preventDefault();
    }

    drop(event) {
        event.preventDefault();
        const key = event.dataTransfer.getData("text");
        const wordElement = document.querySelector(`[data-key="${key}"]`);

        if (wordElement && event.target.id === "block2") {
            wordElement.classList.remove("initial-word");
            this.block2.appendChild(wordElement);

            this.makeDraggableWithinBlock(this.block2);
            this.function = this.changeColorOnDoubleClick.bind(this, wordElement)
            wordElement.addEventListener(
                "dblclick",
                this.function
            );
        } else if (wordElement && event.target.id === "block3") {
            this.colorMap = new Map();
            wordElement.style.backgroundColor = "";
            wordElement.removeEventListener(
                "dblclick",
                this.function
            );
            wordElement.removeEventListener(
                "dblclick",
                this.function
            );
            wordElement.classList.add("initial-word");
            this.block3.appendChild(wordElement);
            
            // Используем существующий экземпляр WordOrganizer
            this.wordOrganizer.sortAndRenderBlock3();
        }
    }

    makeDraggableWithinBlock(block) {
        const items = Array.from(block.children);
        items.forEach((item) => {
            item.setAttribute("draggable", true);
            item.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData(
                    "text/plain",
                    e.target.getAttribute("data-key")
                );
            });

            item.addEventListener("dragover", (e) => e.preventDefault());
            item.addEventListener("drop", (e) => {
                e.preventDefault();
                const draggedKey = e.dataTransfer.getData("text/plain");
                const draggedItem = document.querySelector(
                    `[data-key="${draggedKey}"]`
                );
                if (draggedItem && draggedItem !== e.target) {
                    block.insertBefore(draggedItem, e.target.nextSibling);
                }
            });
        });
    }

    changeColorOnDoubleClick(wordElement) {
        const key = wordElement.getAttribute("data-key");

        // Проверяем, был ли уже выбран цвет для этого элемента
        let color = this.colorMap.get(key);

        if (!color) {
            // Если цвет еще не был сохранен, генерируем новый
            color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            this.colorMap.set(key, color); // Сохраняем цвет
        }

        // Применяем сохраненный или новый цвет
        wordElement.style.backgroundColor = color;

        const paragraph = document.createElement("p");
        paragraph.textContent = wordElement.textContent;
        paragraph.style.color = color;
        paragraph.classList.add("selected-text");

        block1.appendChild(paragraph);

        wordElement.classList.add("color-changed");
    }
}

function main() {
    const wordOrganizer = new WordOrganizer(); // Создаем один экземпляр
    new DragAndDrop(wordOrganizer); // Передаем экземпляр в DragAndDrop
}

main();
