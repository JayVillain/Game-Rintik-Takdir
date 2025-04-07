// script.js
// Logika utama untuk game text-based Rintik Takdir

// Variabel global untuk tampilan chat
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");
const choicesContainer = document.getElementById("choices-container");

// Audio elements
const rainSound = document.getElementById("rain-sound");
const motorSound = document.getElementById("motor-sound");
const messageSound = document.getElementById("message-sound");
const buttonSound = document.getElementById("button-sound");

// Variabel untuk menyimpan chapter yang sedang aktif dan scene saat ini
let currentChapterData = null;
let currentSceneIndex = 0;
let isTyping = false;
let isNightMode = false;
let nextChapter = null;

// Inisialisasi game dan efek
function initialize() {
  // Mulai efek suara hujan dengan volume rendah
  rainSound.volume = 0.3;
  motorSound.volume = 0.5;
  messageSound.volume = 0.2;
  buttonSound.volume = 0.15;
  
  // Play rain sound when user interacts with the page first time
  document.body.addEventListener('click', () => {
    if (rainSound.paused) {
      rainSound.play();
    }
  }, { once: true });
  
  // Deteksi waktu untuk night mode otomatis
  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    toggleNightMode(true);
  }
  
  // Tambahkan swipe down untuk auto scroll
  chatBox.addEventListener('touchstart', handleTouchStart, false);
  chatBox.addEventListener('touchmove', handleTouchMove, false);
}

// Fungsi untuk menampilkan teks dengan animasi mengetik
function typeText(text, side, next) {
  isTyping = true;
  typingIndicator.style.display = "block";
  
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", side);
  chatBox.appendChild(bubble);
  
  // Play message sound
  if (side === 'left') {
    messageSound.currentTime = 0;
    messageSound.play();
  }
  
  let i = 0;
  const typingSpeed = 20; // ms per karakter
  
  function type() {
    if (i < text.length) {
      bubble.textContent += text[i];
      i++;
      
      // Variasi kecepatan untuk efek yang lebih natural
      const variation = Math.random() * 15;
      setTimeout(type, typingSpeed + variation);
      
      // Auto-scroll saat mengetik
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
  
  // Delay sebelum mulai mengetik untuk efek yang lebih natural
  const startDelay = side === 'left' ? 800 : 300;
  setTimeout(type, startDelay);
}

// Fungsi untuk menampilkan scene saat ini dari chapter yang aktif
function showScene() {
  const scene = currentChapterData[currentSceneIndex];
  
  // Handle efek khusus jika ada
  if (scene.effects) {
    applySceneEffects(scene.effects);
  }
  
  // Tampilkan dialog
  if (scene.choices) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", scene.side, "has-choice");
    
    // Animasi teks untuk pilihan juga (tanpa next callback)
    isTyping = true;
    typingIndicator.style.display = "block";
    chatBox.appendChild(bubble);
    
    animateText(bubble, scene.text, () => {
      typingIndicator.style.display = "none";
      isTyping = false;
      
      // Hapus pilihan lama jika ada
      choicesContainer.innerHTML = '';
      
      // Buat tombol pilihan dengan delay bertahap
      scene.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.onclick = () => {
          buttonSound.currentTime = 0;
          buttonSound.play();
          selectChoice(choice.next, choice.text);
        };
        
        // Tambahkan tombol ke container pilihan
        choicesContainer.appendChild(button);
      });
    });
  } else {
    typeText(scene.text, scene.side, scene.next);
  }
  
  // Scroll ke bawah
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 100);
}

// Fungsi untuk menganimasikan teks per karakter
function animateText(element, text, callback) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      setTimeout(type, 20 + Math.random() * 10);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      if (callback) callback();
    }
  }
  
  setTimeout(type, 500);
}

// Fungsi untuk menerapkan efek khusus
function applySceneEffects(effects) {
  if (effects.sound) {
    if (effects.sound === 'rain_heavy') {
      rainSound.volume = 0.6;
    } else if (effects.sound === 'rain_light') {
      rainSound.volume = 0.2;
    } else if (effects.sound === 'motor') {
      motorSound.play();
    }
  }
  
  if (effects.background) {
    document.body.style.backgroundImage = `url('assets/${effects.background}')`;
    document.body.style.transition = 'background-image 1.5s ease';
  }
  
  if (effects.nightMode !== undefined) {
    toggleNightMode(effects.nightMode);
  }
  
  if (effects.shake) {
    document.body.classList.add('shake');
    setTimeout(() => {
      document.body.classList.remove('shake');
    }, 1000);
  }
}

// Fungsi untuk transisi ke scene berikutnya
function nextScene(next) {
  if (typeof next === "number") {
    currentSceneIndex = next;
    showScene();
  } else if (next === null) {
    // Chapter selesai - tampilkan pesan chapter selesai
    const chapterEndMessage = document.createElement("div");
    chapterEndMessage.classList.add("chapter-end-message");
    chapterEndMessage.textContent = "Chapter Selesai";
    chatBox.appendChild(chapterEndMessage);
    
    // Tambahkan tombol "Kembali ke Menu" jika tidak ada chapter selanjutnya
    choicesContainer.innerHTML = '';
    const menuButton = document.createElement("button");
    menuButton.textContent = "Kembali ke Menu";
    menuButton.classList.add("menu-button");
    menuButton.onclick = () => {
      buttonSound.currentTime = 0;
      buttonSound.play();
      // Reset dan kembali ke menu utama (bisa diimplementasikan sesuai kebutuhan)
      showMainMenu();
    };
    choicesContainer.appendChild(menuButton);
    
    // Scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
  } else if (typeof next === "string") {
    // Simpan chapter berikutnya
    nextChapter = next;
    
    // Tampilkan chapter end message
    const chapterEndMessage = document.createElement("div");
    chapterEndMessage.classList.add("chapter-end-message");
    chapterEndMessage.textContent = "Chapter Selesai";
    chatBox.appendChild(chapterEndMessage);
    
    // Tambahkan tombol lanjut chapter dan tombol kembali ke menu
    choicesContainer.innerHTML = '';
    
    const nextChapterButton = document.createElement("button");
    nextChapterButton.textContent = "Lanjut Chapter Berikutnya";
    nextChapterButton.classList.add("next-chapter-button");
    nextChapterButton.onclick = () => {
      buttonSound.currentTime = 0;
      buttonSound.play();
      
      // Fade out dan load chapter baru
      chatBox.style.opacity = 0;
      chatBox.style.transition = 'opacity 1s ease';
      choicesContainer.style.opacity = 0;
      choicesContainer.style.transition = 'opacity 1s ease';
      
      setTimeout(() => {
        loadChapter(nextChapter);
        setTimeout(() => {
          chatBox.style.opacity = 1;
          choicesContainer.style.opacity = 1;
        }, 500);
      }, 1000);
    };
    
    const menuButton = document.createElement("button");
    menuButton.textContent = "Kembali ke Menu";
    menuButton.classList.add("menu-button");
    menuButton.onclick = () => {
      buttonSound.currentTime = 0;
      buttonSound.play();
      // Reset dan kembali ke menu utama
      showMainMenu();
    };
    
    choicesContainer.appendChild(nextChapterButton);
    choicesContainer.appendChild(menuButton);
    
    // Scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Fungsi untuk menampilkan menu utama (bisa diimplementasikan sesuai kebutuhan)
function showMainMenu() {
  // Reset chat box
  chatBox.innerHTML = "";
  choicesContainer.innerHTML = "";
  
  // Tampilkan judul game
  const titleElement = document.createElement("div");
  titleElement.classList.add("game-title");
  titleElement.textContent = "Rintik Takdir";
  chatBox.appendChild(titleElement);
  
  // Tampilkan menu pilihan
  const startButton = document.createElement("button");
  startButton.textContent = "Mulai Baru";
  startButton.onclick = () => {
    buttonSound.currentTime = 0;
    buttonSound.play();
    loadChapter("chapter1");
  };
  
  // Tambahkan tombol lainnya sesuai kebutuhan (lanjutkan, pengaturan, dll)
  const continueButton = document.createElement("button");
  continueButton.textContent = "Lanjutkan";
  continueButton.onclick = () => {
    buttonSound.currentTime = 0;
    buttonSound.play();
    // Logika untuk melanjutkan dari save point
    // Bisa diimplementasikan dengan menyimpan progress di localStorage
    loadLastSavedChapter();
  };
  
  const settingsButton = document.createElement("button");
  settingsButton.textContent = "Pengaturan";
  settingsButton.onclick = () => {
    buttonSound.currentTime = 0;
    buttonSound.play();
    showSettings();
  };
  
  choicesContainer.appendChild(startButton);
  choicesContainer.appendChild(continueButton);
  choicesContainer.appendChild(settingsButton);
}

// Fungsi untuk menangani pilihan pemain
function selectChoice(next, choiceText) {
  // Tampilkan pilihan pemain sebagai dialog di kanan
  const playerBubble = document.createElement("div");
  playerBubble.classList.add("chat-bubble", "right");
  playerBubble.textContent = choiceText;
  chatBox.appendChild(playerBubble);
  
  // Hapus pilihan setelah dipilih
  choicesContainer.innerHTML = '';
  
  // Scroll ke bawah
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Tunggu sebentar sebelum lanjut ke scene berikutnya
  setTimeout(() => {
    nextScene(next);
  }, 800);
}

// Fungsi untuk memuat chapter berdasarkan nama file
async function loadChapter(chapterName) {
  chatBox.innerHTML = "";
  choicesContainer.innerHTML = "";
  currentSceneIndex = 0;
  nextChapter = null;
  
  // Tampilkan loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading-indicator");
  loadingIndicator.textContent = "Memuat cerita...";
  chatBox.appendChild(loadingIndicator);
  
  // Mengimpor module chapter (misalnya dari chapters/chapter1.js)
  try {
    const module = await import(`./chapters/${chapterName}.js`);
    currentChapterData = module.chapterData;
    
    // Hapus loading indicator
    chatBox.removeChild(loadingIndicator);
    
    // Apply chapter-specific settings jika ada
    if (module.chapterSettings) {
      applyChapterSettings(module.chapterSettings);
    }
    
    // Simpan progress ke localStorage
    saveProgress(chapterName, 0);
    
    showScene();
  } catch (error) {
    console.error("Gagal memuat chapter:", error);
    
    // Tampilkan pesan error yang lebih user-friendly
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Chapter tidak ditemukan atau terjadi error!";
    chatBox.innerHTML = "";
    chatBox.appendChild(errorMessage);
    
    // Tambahkan tombol untuk kembali ke menu
    const backButton = document.createElement("button");
    backButton.textContent = "Kembali ke Menu";
    backButton.onclick = () => showMainMenu();
    choicesContainer.innerHTML = "";
    choicesContainer.appendChild(backButton);
  }
}

// Fungsi untuk menyimpan progress
function saveProgress(chapterName, sceneIndex) {
  try {
    localStorage.setItem('rintikTakdir_chapter', chapterName);
    localStorage.setItem('rintikTakdir_scene', sceneIndex);
  } catch (e) {
    console.error("Gagal menyimpan progress:", e);
  }
}

// Fungsi untuk memuat chapter terakhir yang disimpan
function loadLastSavedChapter() {
  try {
    const savedChapter = localStorage.getItem('rintikTakdir_chapter');
    const savedScene = localStorage.getItem('rintikTakdir_scene');
    
    if (savedChapter) {
      loadChapter(savedChapter);
      // Scene handling akan diimplementasikan sesuai kebutuhan
    } else {
      // Tidak ada save data, mulai dari awal
      loadChapter("chapter1");
    }
  } catch (e) {
    console.error("Gagal memuat progress:", e);
    loadChapter("chapter1");
  }
}

// Fungsi untuk menampilkan pengaturan
function showSettings() {
  // Simpan konten chat saat ini
  const currentChat = chatBox.innerHTML;
  
  // Tampilkan menu pengaturan
  chatBox.innerHTML = "";
  
  const settingsTitle = document.createElement("div");
  settingsTitle.classList.add("settings-title");
  settingsTitle.textContent = "Pengaturan";
  chatBox.appendChild(settingsTitle);
  
  // Container untuk pengaturan
  const settingsContainer = document.createElement("div");
  settingsContainer.classList.add("settings-container");
  
  // Pengaturan volume
  const volumeControl = document.createElement("div");
  volumeControl.classList.add("settings-item");
  
  const volumeLabel = document.createElement("span");
  volumeLabel.textContent = "Volume Hujan:";
  
  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "1";
  volumeSlider.step = "0.1";
  volumeSlider.value = rainSound.volume;
  volumeSlider.oninput = () => {
    rainSound.volume = volumeSlider.value;
  };
  
  volumeControl.appendChild(volumeLabel);
  volumeControl.appendChild(volumeSlider);
  
  // Pengaturan night mode
  const nightModeControl = document.createElement("div");
  nightModeControl.classList.add("settings-item");
  
  const nightModeLabel = document.createElement("span");
  nightModeLabel.textContent = "Mode Malam:";
  
  const nightModeToggle = document.createElement("input");
  nightModeToggle.type = "checkbox";
  nightModeToggle.checked = isNightMode;
  nightModeToggle.onchange = () => {
    toggleNightMode(nightModeToggle.checked);
  };
  
  nightModeControl.appendChild(nightModeLabel);
  nightModeControl.appendChild(nightModeToggle);
  
  // Tambahkan kontrol ke settings container
  settingsContainer.appendChild(volumeControl);
  settingsContainer.appendChild(nightModeControl);
  
  // Tambahkan settings container ke chat box
  chatBox.appendChild(settingsContainer);
  
  // Tombol kembali
  choicesContainer.innerHTML = "";
  const backButton = document.createElement("button");
  backButton.textContent = "Kembali";
  backButton.onclick = () => {
    buttonSound.currentTime = 0;
    buttonSound.play();
    // Kembalikan chat sebelumnya
    chatBox.innerHTML = currentChat;
  };
  choicesContainer.appendChild(backButton);
}

// Fungsi untuk menerapkan pengaturan chapter
function applyChapterSettings(settings) {
  if (settings.background) {
    document.body.style.backgroundImage = `url('assets/${settings.background}')`;
  }
  
  if (settings.rainIntensity !== undefined) {
    document.getElementById("rain-overlay").style.opacity = settings.rainIntensity;
    rainSound.volume = settings.rainIntensity * 0.5;
  }
  
  if (settings.nightMode !== undefined) {
    toggleNightMode(settings.nightMode);
  }
}

// Fungsi untuk toggle night mode
function toggleNightMode(enable) {
  isNightMode = enable;
  if (enable) {
    document.body.classList.add('night-mode');
  } else {
    document.body.classList.remove('night-mode');
  }
}

// Touch events handler untuk swipe scroll
let touchStartY = 0;

function handleTouchStart(evt) {
  touchStartY = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!touchStartY) return;
  
  const touchY = evt.touches[0].clientY;
  const diff = touchStartY - touchY;
  
  // Swipe ke bawah yang kuat untuk auto-scroll ke bawah
  if (diff > 100) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  touchStartY = null;
}

// Fungsi untuk memulai game
function startGame() {
  // Inisialisasi
  initialize();
  
  // Tampilkan menu utama
  showMainMenu();
}

// Mulai game saat halaman termuat
document.addEventListener('DOMContentLoaded', startGame);