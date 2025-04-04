const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");
const rainSound = document.getElementById("rain-sound");
const motorSound = document.getElementById("motor-sound");

// Data cerita
const story = [
    { text: "Hujan deras mengguyur kota. Aku berteduh di halte, udara dingin menusuk kulit.", side: "left", next: 1 },
    { text: "Di ujung halte, seorang gadis berdiri sendirian. Dia menunduk, seolah menunggu seseorang.", side: "left", next: 2 },
    { text: "Haruskah aku menyapanya?", side: "right", choices: [
        { text: "Tanya apakah dia menunggu seseorang", next: 3 },
        { text: "Diam saja dan tunggu", next: 6 }
    ] },
    { text: '"Hei, kamu lagi nunggu seseorang?"', side: "right", next: 4 },
    { text: '"Ah...? Eh, iya... tapi dia belum datang."', side: "left", next: 5 },
    { text: "Suara hujan semakin deras, aku bisa melihat dia sedikit menggigil.", side: "left", next: 7 },
    { text: "Aku memilih diam, hanya mendengar suara hujan. Tapi aku melihatnya menggigil kedinginan.", side: "left", next: 7 },
    { text: "Haruskah aku menawarkan jaket?", side: "right", choices: [
        { text: "Berikan jaket", next: 8 },
        { text: "Tawarkan untuk mengantarnya pulang", next: 9 }
    ] },
    { text: 'Aku melepas jaketku dan menyerahkannya. "Pakai ini, kamu kedinginan."', side: "right", next: 10 },
    { text: '"Ah... terima kasih..."', side: "left", next: 10 },
    { text: "Aku menghidupkan motor dan menawarkannya tumpangan.", side: "right", action: "playMotor", next: 11 },
    { text: "Dia sedikit ragu, tapi akhirnya naik di belakangku.", side: "left", next: 12 },
    { text: "Saat berkendara di bawah hujan, aku bertanya...", side: "right", choices: [
        { text: '"Kenapa sendirian di halte?"', next: 13 },
        { text: '"Aku sering lewat sini, tapi baru pertama kali lihat kamu."', next: 14 }
    ] },
    { text: '"Aku menunggu teman... tapi dia tidak datang."', side: "left", next: 15 },
    { text: '"Aku juga baru pertama kali ke sini... mungkin ini kebetulan."', side: "left", next: 15 },
    { text: "Aku tersenyum tipis. Malam ini terasa berbeda dari biasanya.", side: "right", next: "chapter2" }
];

let currentIndex = 0;

// Fungsi untuk menampilkan teks dengan animasi mengetik
function typeText(text, side, next) {
    typingIndicator.style.display = "block";

    setTimeout(() => {
        typingIndicator.style.display = "none";

        let bubble = document.createElement("div");
        bubble.classList.add("chat-bubble", side);
        chatBox.appendChild(bubble);

        let i = 0;
        function type() {
            if (i < text.length) {
                bubble.textContent += text[i];
                i++;
                setTimeout(type, 30);
            } else if (next !== undefined) {
                setTimeout(() => showDialog(next), 1000);
            }
        }
        type();
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

// Fungsi untuk menampilkan dialog
function showDialog(index) {
    const scene = story[index];

    if (scene.choices) {
        typingIndicator.style.display = "none";
        chatBox.innerHTML += `<div class="chat-bubble right">${scene.text}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        scene.choices.forEach(choice => {
            let button = document.createElement("button");
            button.textContent = choice.text;
            button.onclick = () => showDialog(choice.next);
            chatBox.appendChild(button);
        });
    } else {
        typeText(scene.text, scene.side, scene.next);
    }

    if (scene.action === "playMotor") {
        motorSound.play();
    }

    if (scene.next === "chapter2") {
        alert("Chapter 1 selesai! Lanjut ke Chapter 2...");
    }
}

// Mulai permainan
rainSound.play();
showDialog(currentIndex);
