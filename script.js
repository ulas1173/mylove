const backgroundImage = document.getElementById('background-image');
const gridItems = document.querySelectorAll('.grid-item');
const codeInputContainer = document.getElementById('code-input-container');
const codeInput = document.getElementById('code-input');
const submitCodeButton = document.getElementById('submit-code');
const closeCodeInputButton = document.getElementById('close-code-input');
const messageContainer = document.getElementById('message-container');
const messageElement = document.getElementById('message');

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
let activeIndex = null;

function changeBackgroundImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    backgroundImage.style.opacity = 0;
    setTimeout(() => {
        backgroundImage.src = images[currentImageIndex];
        backgroundImage.style.opacity = 1;
    }, 1000);
}

setInterval(changeBackgroundImage, 5000);

function loadCompletedCodes() {
    database.ref('completed').once('value').then(snapshot => {
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
        item.textContent = ''; // Temizle

        if (enteredCodes.includes(codes[index])) {
            item.classList.remove('available');
            item.classList.add('completed');
            item.style.backgroundColor = 'green';
            item.textContent = codes[index];
            item.style.pointerEvents = 'none';
        } else if (index === availableIndex) {
            item.classList.add('available');
            item.style.backgroundColor = 'blue';
            item.style.pointerEvents = 'auto';
        } else {
            item.classList.remove('available');
            item.style.backgroundColor = 'darkgray';
            item.style.pointerEvents = 'none';
        }
    });
}

gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === availableIndex) {
            activeIndex = index;
            codeInput.value = "";
            codeInputContainer.style.display = 'block';
        }
    });
});

submitCodeButton.addEventListener('click', () => {
    if (activeIndex === null) return;

    const enteredCode = codeInput.value.trim().toUpperCase();
    if (enteredCode === codes[activeIndex]) {
        database.ref('completed/' + activeIndex).set(true).then(() => {
            enteredCodes.push(codes[activeIndex]);
            activeIndex = null;
            codeInputContainer.style.display = 'none';
            availableIndex++;
            if (enteredCodes.length === codes.length) {
                messageElement.textContent = 'Özel mesajınız!';
                messageContainer.style.display = 'block';
            }
            updateGridItems();
        });
    } else {
        alert('❌ Yanlış kod girdiniz!');
    }
});

closeCodeInputButton.addEventListener('click', () => {
    activeIndex = null;
    codeInputContainer.style.display = 'none';
});

loadCompletedCodes();
