const backgroundImage = document.getElementById('background-image');
const gridItems = document.querySelectorAll('.grid-item');
const codeInputContainer = document.getElementById('code-input-container');
const codeInput = document.getElementById('code-input');
const submitCodeButton = document.getElementById('submit-code');
const closeCodeInputButton = document.getElementById('close-code-input');
const messageContainer = document.getElementById('message-container');
const messageElement = document.getElementById('message');

const images = ['images/resim1.jpg', 'images/resim2.jpg', 'images/resim3.jpg', 'images/resim4.jpg']; // Resim yollarını güncelledik
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

function updateGridItems() {
    gridItems.forEach((item, index) => {
        if (index < availableIndex) {
            item.classList.add('available');
            item.style.backgroundColor = 'blue';
            item.style.pointerEvents = 'auto';
        } else if (index === availableIndex) {
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

updateGridItems();

gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === availableIndex) {
            codeInputContainer.style.display = 'block';
            submitCodeButton.onclick = () => {
                if (codeInput.value.toUpperCase() === codes[index]) {
                    enteredCodes.push(codes[index]);
                    codeInputContainer.style.display = 'none';
                    availableIndex++;
                    if (availableIndex < gridItems.length) {
                        setTimeout(() => {
                            updateGridItems();
                        }, 5000);
                    }
                    if (enteredCodes.length === 21) {
                        messageElement.textContent = 'Özel mesajınız!';
                        messageContainer.style.display = 'block';
                    }
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