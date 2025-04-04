// script.js
// Logika utama untuk game text-based Rintik Takdir

// Variabel global untuk tampilan chat
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");

// Variabel untuk menyimpan chapter yang sedang aktif dan scene saat ini
let currentChapterData = null;
let currentSceneIndex = 0;
let isTyping = false;

// Fungsi untuk menampilkan teks dengan animasi mengetik
function typeText(text, side, next) {
  isTyping = true;
  typingIndicator.style.display = "block";
  
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", side);
  chatBox.appendChild(bubble);
  
  let i = 0;
  function type() {
    if (i < text.length) {
      bubble.textContent += text[i];
      i++;
      setTimeout(type, 20);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      typingIndicator.style.display = "none";
      isTyping = false;
      if (next !== undefined && !bubble.classList.contains("has-choice")) {
        setTimeout(() => {
          nextScene(next);
        }, 1000);
      }
    }
  }
  setTimeout(type, 500);
}

// Fungsi untuk menampilkan scene saat ini dari chapter yang aktif
function showScene() {
  const scene = currentChapterData[currentSceneIndex];
  if (scene.choices) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", scene.side, "has-choice");
    bubble.textContent = scene.text;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    scene.choices.forEach(choice => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.onclick = () => {
        document.querySelectorAll("button").forEach(btn => btn.remove());
        selectChoice(choice.next);
      };
      chatBox.appendChild(button);
    });
  } else {
    typeText(scene.text, scene.side, scene.next);
  }
}

// Fungsi untuk transisi ke scene berikutnya
function nextScene(next) {
  if (typeof next === "number") {
    currentSceneIndex = next;
    showScene();
  } else if (next === null) {
    // Chapter selesai
    alert("Chapter selesai. Terima kasih sudah bermain!");
  } else if (typeof next === "string") {
    // Jika next adalah string dan menandakan pindah chapter, misalnya "chapter2"
    loadChapter(next);
  }
}

// Fungsi untuk menangani pilihan pemain
function selectChoice(next) {
  nextScene(next);
}

// Fungsi untuk memuat chapter berdasarkan nama file
async function loadChapter(chapterName) {
  chatBox.innerHTML = "";
  currentSceneIndex = 0;
  // Mengimpor module chapter (misalnya dari chapters/chapter1.js)
  try {
    const module = await import(`./chapters/${chapterName}.js`);
    currentChapterData = module.chapterData;
    showScene();
  } catch (error) {
    console.error("Gagal memuat chapter:", error);
    alert("Chapter tidak ditemukan atau terjadi error!");
  }
}

// Fungsi untuk memulai game
function startGame() {
  // Untuk memulai, kita load chapter pertama (misalnya "chapter1")
  loadChapter("chapter1");
}

// Mulai game saat halaman termuat
startGame();
