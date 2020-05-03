window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const INTRO_BUTTON=document.getElementById('intro__button');
const IMG=document.getElementById('img');
let cards=document.getElementById('cards');
const ERROR=document.getElementById('error');
const SUCCES=document.getElementById('succes');
const SUCCES__NUM=document.getElementById('succes__num');
const ERROR__NUM=document.getElementById('error__num');

const cardResultError = document.querySelectorAll('.card__result');
const cardResultSucces = SUCCES.querySelectorAll('.card__result');

let wordInCards = cards.querySelectorAll('.word');

let cardInCards = document.querySelectorAll('.card');
const card = document.querySelectorAll('.card');
let transcriptionInCards = cards.querySelectorAll('.transcription');
let translation=document.getElementById('translation');
const LEVEL=document.getElementById('level');
const LEVEL__LI = document.querySelectorAll('.level__li');
const START=document.getElementById('start');
const SPEAK=document.getElementById('speak');
const RESULT=document.getElementById('result2');
const SCORE=document.getElementById('score');
const RE=document.getElementById('ytr');
const NG=document.getElementById('ng');

const speechRecogn = new SpeechRecognition();
speechRecogn.interimResults = true;
speechRecogn.lang = 'en';

NG.addEventListener('click', ()=>{
    stars=0;
    ERROR__NUM.textContent=10-stars;
    SUCCES__NUM.textContent=stars;
    ERROR.innerHTML='';
    SUCCES.innerHTML='';
    translation.innerHTML='';
    letWordsToCards(0);
    deleteStars();
    let idIntro=document.getElementById('page1');
    idIntro.classList.remove('none');
    let re=document.getElementById('re');
    re.classList.add('none');
    for (let j=0;j<10;j++){
        card[j].classList.remove('cardActive');
        card[j].classList.remove('active');
    };
    for (let j=0;j<6;j++){
        LEVEL__LI[j].classList.remove('level__li_active');
    };
    speechRecogn.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        translation.textContent = transcript.toLowerCase();    
    });
    speechRecogn.start();
    speechRecogn.addEventListener('end', compareWord);

});

RESULT.addEventListener('click', ()=>{
    let idIntro=document.getElementById('page1');
    idIntro.classList.add('none');
    let re=document.getElementById('re');
    re.classList.remove('none');

});

RE.addEventListener('click', ()=>{
    let idIntro=document.getElementById('page1');
    idIntro.classList.remove('none');
    let re=document.getElementById('re');
    re.classList.add('none');

});

INTRO_BUTTON.addEventListener('click', ()=>{
    let idIntro=document.getElementById('intro');
    idIntro.classList.add('none');
});


function randomNum() {
    let rand = Math.random()*10;
    return Math.floor(rand);
}

const getWords = async (page, group) => {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
    const res = await fetch(url);
    const json = await res.json();
    let arrWords = JSON.stringify(json, null, 1);
    arrWords = JSON.parse(arrWords);
   return arrWords;
}; 

letWordsToCards(0);

function letWordsToCards(num) {
    getWords(randomNum(),num).then((value) => {
        for (let i = 0 ; i < 10 ; i++) {
            wordInCards[i].textContent = value[i].word.toLowerCase();
            transcriptionInCards[i].textContent = value[i].transcription;
            wordInCards[i].setAttribute('dataAudio',value[i].audio);
            wordInCards[i].setAttribute('dataImg',value[i].image);
            let rec=value[i].word.toLowerCase();

            (async ()=>{ 
            ERROR.appendChild(ceateResaltCard (value[i].word.toLowerCase(), value[i].transcription, (await getTranslationText (rec)), value[i].audio));
             })();
        }
    });
};


function ceateResaltCard (word, transcription, translation,audio) {
    let div=document.createElement('DIV');
    div.classList.add('card__result');
    let span=document.createElement('SPAN');
    span.classList.add('audio-icon');
    let img=document.createElement('IMG');
   img.classList.add('audio__icon');
    img.setAttribute('src','img/dinamic.png');
    span.appendChild(img);
   
    div.textContent=word+' '+transcription+' '+translation;
   div.setAttribute('dataAudio',audio);
     div.appendChild(span);
     div.setAttribute('id',word)

    return div;
    
};


    
    ERROR.addEventListener('click', (event)=>{

        let selectedCard=event.target;
        selectedCard=selectedCard.getAttribute('dataAudio');
        if(selectedCard===null){return};
        const audio = new Audio();
        audio.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/${selectedCard}`
        audio.play();

    });

    SUCCES.addEventListener('click', (event)=>{

        let selectedCard=event.target;
        selectedCard=selectedCard.getAttribute('dataAudio');
        if(selectedCard===null){return};
        const audio = new Audio();
        audio.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/${selectedCard}`
        audio.play();

    });

async function getTranslationText (word) {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200422T124843Z.080b6a504e291973.8a23faf52816f1c303da63567f732b90ec64f825&text= ${word} &lang=en-ru`;
    const res = await fetch(url);
    const data = await res.json();
    let rec=String(data.text).toLowerCase();
    return rec;
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
        };
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
    audio.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/${dataAudio}`
    audio.play();
    IMG.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/${dataImg}`;
};


for (let i=0;i<6;i++){
   
    LEVEL__LI[i].addEventListener('click', (event)=>{
        ERROR.innerHTML='';
        SUCCES.innerHTML='';
        for (let j=0;j<10;j++){
            card[j].classList.remove('cardActive');
            card[j].classList.remove('active');
        };
        for (let j=0;j<6;j++){
            LEVEL__LI[j].classList.remove('level__li_active');
        };
        let selectedLi=event.currentTarget;
        selectedLi.classList.add('level__li_active');
        IMG.src='img/english.jpg';
        translation.textContent ='';
        letWordsToCards(i);
    });
};

START.addEventListener('click', (event)=>{
    deleteStars();
    letWordsToCards(0);
    stars=0;
    ERROR__NUM.textContent=10-stars;
                    SUCCES__NUM.textContent=stars;
    for (let j=0;j<10;j++){
        card[j].classList.remove('cardActive');
        card[j].classList.remove('active');
    };
    for (let j=0;j<6;j++){
        LEVEL__LI[j].classList.remove('level__li_active');
    };
    translation.innerHTML='';
    ERROR.innerHTML='';
    SUCCES.innerHTML='';
    speechRecogn.stop();
});


SPEAK.addEventListener('click', (event)=>{
    speechRecogn.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        translation.textContent = transcript.toLowerCase();    
    });
    speechRecogn.start();
    speechRecogn.addEventListener('end', compareWord);
});

let stars=0
function compareWord() {
    
    wordInCards.forEach((e, i) => {
        if (e.textContent === translation.textContent) {


                if (!card[i].classList.contains('cardActive')){
                    stars = stars + 1;
                    ERROR__NUM.textContent=10-stars;
                    SUCCES__NUM.textContent=stars;
                    let wordVirez=document.getElementById(e.textContent)
                    console.log(wordVirez);
                    console.log(stars);
                    wordVirez.remove();
                    SUCCES.appendChild(wordVirez);
                   
                    addStar();
                } 
                
            card[i].classList.add('cardActive');
            let dataImg=e.getAttribute('dataImg');
            IMG.src = `https://raw.githubusercontent.com/grajoz/rslang-data/master/${dataImg}`;

            if(stars==10){
                speechRecogn.stop();
                createResult ();
                deleteStars();
                }

        }
    });
    speechRecogn.start()
}

function createResult (){
    let idIntro=document.getElementById('page1');
    idIntro.classList.add('none');
    let re=document.getElementById('re');
    re.classList.remove('none');

};

function addStar() {
    const starWin = document.createElement('img');
    starWin.setAttribute('alt', 'starWin');
    starWin.setAttribute('src', 'img/star-win.svg');
    SCORE.appendChild(starWin);
  }
  
  function deleteStars() {
    SCORE.innerHTML = '';
  }
