const boxs = document.querySelectorAll(".box");
const container = document.querySelector(".home-container");
const mainContainer = document.querySelector(".main-container");
let selected = null;

for (let box of boxs) {
    box.addEventListener("dragstart", (e) => {
        
        selected = e.target;
        e.target.classList.add("selected");
    });

    box.addEventListener("dragend", () => {
        selected.classList.remove("selected");
        selected = null;
    });

    box.addEventListener("dragenter", (e) => {
        if (selected && e.target !== selected) {
            e.target.classList.add("drag-over");
        }
    });

    box.addEventListener("dragleave", (e) => {
        e.target.classList.remove("drag-over");
    });
}

container.addEventListener("dragover", (e) => {
    e.preventDefault();
});

container.addEventListener("drop", (e) => {
    e.preventDefault();
    const box = e.target.closest(".box");
    if (box && box !== selected) {
        container.insertBefore(selected, box);
    } else if (selected) {
        container.appendChild(selected);
    }
    clearDragOver();
});

mainContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
});

mainContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    if (selected) {
        mainContainer.appendChild(selected);
    }
    clearDragOver();
});

// Убираем все временные стили "drag-over"
function clearDragOver() {
    document.querySelectorAll(".drag-over").forEach(el => {
        el.classList.remove("drag-over");
    });
}
