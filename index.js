class WordOrganizer {
    constructor() {
        this.button = document.querySelector(".button");
        this.input = document.querySelector(".input");
        this.block3 = document.getElementById("block3");
        this.block2 = document.getElementById("block2");
        this.selectedText = document.querySelector(".selected-text");
        // Сохраняем привязанную функцию
        this.boundOrganizeWords = this.organizeWords.bind(this);
        // Добавляем листенер
        this.button.addEventListener("click", this.boundOrganizeWords );
    }

    organizeWords() {
        // Получаем слова, сортируем и разделяем по категориям
        const words = this.input.value.split("-");
        const categories = { a: [], b: [], n: [] };

        words.forEach(word => {
            if (!isNaN(word)) {
                categories.n.push(word);
            } else if (word[0] === word[0].toUpperCase()) {
                categories.b.push(word);
            } else {
                categories.a.push(word);
            }
        });

        // Сортировка
        categories.a.sort();
        categories.b.sort();
        categories.n.sort((a, b) => a - b);

        // Отображаем слова в Block 3
        this.renderWords(categories);

        // убераем листенер 
        this.button.removeEventListener("click", this.boundOrganizeWords);

        // очищаем инпут
        this.input.value = "";
    }

    renderWords(categories) {
        this.block3.innerHTML = ""; // Очистка блока перед вставкой

        let keyCounter = { a: 1, b: 1, n: 1 };

        Object.keys(categories).forEach(category => {
            categories[category].forEach(word => {
                const wordElement = document.createElement("div");
                wordElement.classList.add("word", "initial-word");
                wordElement.draggable = true;

                // Добавляем ключ и слово
                const key = `${category}${keyCounter[category]++}`;
                wordElement.setAttribute("data-key", key);
                wordElement.setAttribute("data-category", category);
                wordElement.textContent = `${key}: ${word}`;

                // События для перетаскивания и выбора
                wordElement.addEventListener("dragstart", this.dragStart.bind(this));
                wordElement.addEventListener("dragend", this.dragEnd.bind(this));

                this.block3.appendChild(wordElement);
            });
        });
    }

    dragStart(event) {
        event.dataTransfer.setData("text", event.target.getAttribute("data-key"));
        this.selectedText.textContent = event.target.textContent;
    }

    dragEnd() {
        this.selectedText.textContent = "";
    }

    sortAndRenderBlock3() {
        const words = Array.from(this.block3.children);
        words.sort((a, b) => {
            const [aCategory, aIndex] = a.getAttribute("data-key").match(/([a-z]+)(\d+)/).slice(1);
            const [bCategory, bIndex] = b.getAttribute("data-key").match(/([a-z]+)(\d+)/).slice(1);
            
            if (aCategory === bCategory) return parseInt(aIndex) - parseInt(bIndex);
            return aCategory.localeCompare(bCategory);
        });

        // Очищаем block3 и добавляем отсортированные элементы
        this.block3.innerHTML = "";
        words.forEach(word => this.block3.appendChild(word));
    }
}

class DragAndDrop {
    constructor() {
        this.block2 = document.getElementById("block2");
        this.block3 = document.getElementById("block3");

        // Настройка событий для блоков
        [this.block2, this.block3].forEach(block => {
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

            // Позволяем менять порядок элементов в block2
            this.makeDraggableWithinBlock(this.block2);
        } else if (wordElement && event.target.id === "block3") {
            // Возвращаем элемент в block3 и сортируем
            wordElement.style.backgroundColor = "";
            wordElement.classList.add("initial-word");
            this.block3.appendChild(wordElement);

            // Сортируем элементы в block3
            const wordOrganizer = new WordOrganizer();
            wordOrganizer.sortAndRenderBlock3();
        }
    }

    makeDraggableWithinBlock(block) {
        // Установка событий для перетаскивания элементов внутри блока
        const items = Array.from(block.children);
        items.forEach(item => {
            item.setAttribute("draggable", true);
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.getAttribute("data-key"));
            });
            item.addEventListener("dragover", e => e.preventDefault());
            item.addEventListener("drop", e => {
                e.preventDefault();
                console.log(e)
                const draggedKey = e.dataTransfer.getData("text/plain");
                const draggedItem = document.querySelector(`[data-key="${draggedKey}"]`);
                if (draggedItem && draggedItem !== e.target) {
                    target.insertBefore(draggedItem, e.target.nextSibling);
                }
            });
        });
    }
}

function main() {
    new WordOrganizer();
    new DragAndDrop();
}

main();
