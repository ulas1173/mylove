const backgroundImage = document.getElementById('background-image');
const gridItems = document.querySelectorAll('.grid-item');
const codeInputContainer = document.getElementById('code-input-container');
const codeInput = document.getElementById('code-input');
const submitCodeButton = document.getElementById('submit-code');
const closeCodeInputButton = document.getElementById('close-code-input');
const messageContainer = document.getElementById('message-container');
const messageElement = document.getElementById('message');

// Firebase SDK bağlantısı (CDN ile initialize edilmiş hali gerekiyor!)
const firebaseConfig = {
  apiKey: "AIzaSyBNYf4xjYpazIrxdXDavHCWbc8P-V4SQCM",
  authDomain: "kutu-sitesi.firebaseapp.com",
  databaseURL: "https://kutu-sitesi-default-rtdb.firebaseio.com",
  projectId: "kutu-sitesi",
  storageBucket: "kutu-sitesi.firebasestorage.app",
  messagingSenderId: "256332952931",
  appId: "1:256332952931:web:c5846d18306cbd486d4f56",
  measurementId: "G-W06WS9Y959"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const images = ['images/resim1.jpg', 'images/resim2.jpg', 'images/resim3.jpg', 'images/resim4.jpg'];
let currentImageIndex = 0;
const codes = [
    'ASK', 'GUL', 'KALP', 'HAYAL', 'GUNES', 'AY', 'YILDIZ',
    'RUYA', 'BAHAR', 'KIS', 'MAVI', 'KIRMIZI', 'SEVGI', 'CANIM',
    'KUZUM', 'MELEK', 'BIRLIK', 'DAIMA', 'YAKIN', 'UZAK', 'SONSUZ'
];
let enteredCodes = [];
let availableIndex = 0;

function changeBackgroundImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    backgroundImage.style.opacity = 0;
    setTimeout(() => {
        backgroundImage.src = images[currentImageIndex];
        backgroundImage.style.opacity = 1;
    }, 1000);
}

setInterval(changeBackgroundImage, 5000);

// Firebase'den tamamlanan kodları al
function loadCompletedCodes() {
    firebase.database().ref('completed').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(index => {
                enteredCodes.push(codes[index]);
                if (Number(index) >= availableIndex) {
                    availableIndex = Number(index) + 1;
                }
            });
        }
        updateGridItems();
    });
}

function updateGridItems() {
    gridItems.forEach((item, index) => {
        if (index <= availableIndex) {
            item.classList.add('available');
            item.style.backgroundColor = 'blue';
            item.style.pointerEvents = 'auto';
        } else {
            item.classList.remove('available');
            item.style.backgroundColor = 'darkgray';
            item.style.pointerEvents = 'none';
        }

        if (enteredCodes.includes(codes[index])) {
            item.classList.remove('available');
            item.classList.add('completed');
            item.style.backgroundColor = 'green';
            item.textContent = codes[index];
            item.style.pointerEvents = 'none';
        }
    });
}

gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === availableIndex) {
            codeInputContainer.style.display = 'block';

            submitCodeButton.onclick = () => {
                if (codeInput.value.toUpperCase() === codes[index]) {
                    // Firebase'e kaydet
                    firebase.database().ref('completed/' + index).set(true).then(() => {
                        enteredCodes.push(codes[index]);
                        codeInput.value = "";
                        codeInputContainer.style.display = 'none';
                        availableIndex++;
                        if (enteredCodes.length === 21) {
                            messageElement.textContent = 'Özel mesajınız!';
                            messageContainer.style.display = 'block';
                        }
                        updateGridItems();
                    });
                } else {
                    alert('Yanlış kod!');
                }
            };

            closeCodeInputButton.onclick = () => {
                codeInputContainer.style.display = 'none';
            };
        }
    });
});

loadCompletedCodes();
