const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const speakBtn = document.getElementById('speak-quote');
const loader = document.getElementById('loader');

let apiQuotes = [];


function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}


function complete() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}


function newQuote() {
  const selectedQuote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  quoteText.classList.add('fade-out');
  authorText.classList.add('fade-out');

  setTimeout(() => {
    authorText.textContent = selectedQuote.author ? selectedQuote.author : 'Unknown';

    if (selectedQuote.text.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }

    quoteText.textContent = selectedQuote.text;

    quoteText.classList.remove('fade-out');
    quoteText.classList.add('fade-in');

    authorText.classList.remove('fade-out');
    authorText.classList.add('fade-in');

    setTimeout(() => {
      quoteText.classList.remove('fade-in');
      authorText.classList.remove('fade-in');
    }, 500);

    complete();
  }, 300);
}


async function getQuotes() {
  loading();
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}


function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${authorText.innerText}`;
  window.open(twitterUrl, '_blank');
}


function speakQuote() {
  const quoteContent = quoteText.textContent;
  const authorContent = authorText.textContent;

  if (!quoteContent.trim()) {
    alert('Please wait for the quote to load.');
    return;
  }

  const message = `${quoteContent} — by ${authorContent}`;
  const utterance = new SpeechSynthesisUtterance(message);

  utterance.rate = 1;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice =>
    voice.lang === 'en-US' &&
    /female|zira|samantha|google/i.test(voice.name)
  );

  utterance.voice = preferredVoice || voices.find(v => v.lang === 'en-US') || voices[0];

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}


newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);
speakBtn.addEventListener('click', speakQuote);


getQuotes();


window.speechSynthesis.onvoiceschanged = () => {};
