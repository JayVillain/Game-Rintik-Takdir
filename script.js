const dialogText = document.getElementById("dialog-text");
const optionsContainer = document.getElementById("options");
const background = document.getElementById("background");
const character = document.getElementById("character");
const rainSound = document.getElementById("rain-sound");
const motorSound = document.getElementById("motor-sound");
const bellSound = document.getElementById("bell-sound");

// Data cerita
const story = [
    { text: "Hujan deras mengguyur kota. Aku bersandar di halte, merasakan dinginnya udara malam.", next: 1 },
    { text: "Seorang gadis berdiri di ujung halte, menggenggam payung yang tak terbuka.", next: 2, character: "assets/amalia.png" },
    { text: "Aku menatapnya, lalu bertanya pelan...", choices: [
        { text: "Menawarkan tumpangan", next: 3 },
        { text: "Diam saja", next: 6 }
    ] },
    { text: '"Hei, kamu kedinginan? Aku bisa antar kamu pulang."', next: 4 },
    { text: "Amalia menatapku ragu, lalu mengangguk pelan.", next: 5 },
    { text: "Aku menghidupkan motor. Amalia duduk di belakangku, tangannya sedikit gemetar.", action: "playMotor", next: 7 },
    { text: "Saat motor melaju di jalan basah, aku bertanya...", choices: [
        { text: '"Kamu sering naik motor?"', next: 8 },
        { text: '"Kenapa sendirian di halte?"', next: 9 }
    ] },
    { text: '"Aku jarang naik motor... tapi malam ini aku gak punya pilihan lain."', next: 10 },
    { text: '"Aku sedang menunggu seseorang... tapi dia tidak datang."', next: 10 },
    { text: "Aku mengangguk. Malam ini terasa lebih panjang dari biasanya.", next: "chapter2" }
];

let currentIndex = 0;

function showDialog(index) {
    const scene = story[index];
    dialogText.textContent = scene.text;
    optionsContainer.innerHTML = "";

    if (scene.character) {
        character.src = scene.character;
        character.style.display = "block";
    } else {
        character.style.display = "none";
    }

    if (scene.choices) {
        scene.choices.forEach(choice => {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.onclick = () => showDialog(choice.next);
            optionsContainer.appendChild(button);
        });
    } else {
        setTimeout(() => showDialog(scene.next), 3000);
    }

    if (scene.action === "playMotor") {
        motorSound.play();
        background.src = "assets/bg_jalan.jpg";
    }

    if (scene.next === "chapter2") {
        alert("Chapter 1 selesai! Lanjut ke Chapter 2...");
    }
}

// Mulai permainan
rainSound.play();
showDialog(currentIndex);
