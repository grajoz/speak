console.log('sigel');

const INTRO_BUTTON=document.getElementById('intro__button');
const IMG=document.getElementById('img');
let cards=document.getElementById('cards');
let wordInCards = cards.querySelectorAll('.word');
let cardInCards = document.querySelectorAll('.card');
const card = document.querySelectorAll('.card');
let transcriptionInCards = cards.querySelectorAll('.transcription');
let translation=document.getElementById('translation');


INTRO_BUTTON.addEventListener('click', (event)=>{
    let idIntro=document.getElementById('intro');
    idIntro.classList.add('none');
});


function randomNum() {
    let rand = Math.random() * 20;
    console.log(Math.floor(rand))
    return Math.floor(rand);
}

const getWords = async (page, group) => {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
    const res = await fetch(url);
    const json = await res.json();
    let arrWords = JSON.stringify(json, null, 1).replace(/files\//g, '');
    arrWords = JSON.parse(arrWords);
   return arrWords;
}; 

letWordsToCards(0);
 
function letWordsToCards(num) {
    getWords(randomNum(),num).then((value) => {
        for (let i = 0 ; i < 10 ; i++) {
            wordInCards[i].textContent = value[i].word.toLowerCase();
            transcriptionInCards[i].textContent = value[i].transcription;
            wordInCards[i].setAttribute('dataAudio',value[i].audio)
            wordInCards[i].setAttribute('dataImg',value[i].image)
        }
    });
};


    async function getTranslation (word) {
        const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200422T124843Z.080b6a504e291973.8a23faf52816f1c303da63567f732b90ec64f825&text= ${word} &lang=en-ru`;
        const res = await fetch(url);
        const data = await res.json();
        translation.textContent = String(data.text).toLowerCase();
    };

for (let i=0;i<10;i++){
    
    card[i].addEventListener('click', (event)=>{
        for (let j=0;j<10;j++){
            card[j].classList.remove('active');
        }
        let selectedCard=event.currentTarget;
        selectedCard.classList.add('active');
        selectedCard=selectedCard.querySelectorAll('.word');
        let selectedWord=selectedCard[0];
        let dataAudio=selectedWord.getAttribute('dataAudio');
        let dataImg=selectedWord.getAttribute('dataImg');
        selectedWord=selectedWord.textContent;
        getTranslation (selectedWord);
        runningCard(dataAudio, dataImg);

    });
};


async function runningCard(dataAudio, dataImg) {
    const audio = new Audio();
    audio.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/files/${dataAudio}`
    audio.play();
    IMG.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/files/${dataImg}`;
};