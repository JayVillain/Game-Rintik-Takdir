const dialogText = document.getElementById("dialog-text");
const optionsContainer = document.getElementById("options");
const background = document.getElementById("background");
const rainSound = document.getElementById("rain-sound");
const motorSound = document.getElementById("motor-sound");

// Data cerita
const story = [
    { text: "Malam itu, hujan turun deras. Aku menyalakan rokokku sambil menunggu anak-anak klub motor datang.", next: 1 },
    { text: "Aku melihat seorang gadis berdiri di ujung halte, menggenggam payung yang tak terbuka.", next: 2 },
    { text: "Hei, kamu nggak apa-apa?", choices: [
        { text: "Menawarkan tumpangan", next: 3 },
        { text: "Meninggalkannya", next: 10 }
    ] },
    { text: "Aku bisa nganterin kamu pulang. Aku ada motor di seberang sana.", next: 4 },
    { text: "Baiklah… kalau kamu tidak keberatan.", next: 5 },
    { text: "Aku menyalakan motorku. Amalia duduk di belakangku dengan ragu.", action: "playMotor", next: 6 },
    { text: "Pegangan yang kuat.", next: "chapter2" },

    // Bad Ending
    { text: "Ah, terserah dia. Bukan urusanku.", next: 11 },
    { text: "Beberapa hari kemudian, aku mendengar kabar bahwa seorang gadis ditemukan pingsan di halte yang sama.", next: 12 },
    { text: "Saat aku melihat fotonya di berita, aku terkejut. Itu Amalia.", next: "bad_ending" }
];

let currentIndex = 0;

function showDialog(index) {
    const scene = story[index];
    dialogText.textContent = scene.text;
    optionsContainer.innerHTML = "";

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

    if (scene.next === "bad_ending") {
        alert("Bad Ending! Amalia pingsan dan masuk berita...");
    }
}

// Mulai permainan
rainSound.play();
showDialog(currentIndex);
