import myJson from './quizes.json' assert {type: 'json'};
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const yourScore = document.getElementById("your-score")
const scoreToShow =document.getElementById("score-to-show")
const testInfo = document.getElementById("test-info")
const finish = document.getElementById("finish")
const mainContainer= document.getElementById("main-container")
const counter = document.getElementById('counter')
const menu = document.getElementById('menu')
const results = document.getElementById('results')
const menuToChoose = document.getElementById('menu-to-choose')
const footer = document.getElementById("footer")
var numberOfTestToPlay
let shuffledQuestions, currentQuestionIndex
let score, isAnswered
const minutesDisplayed = document.getElementById('time_minutes');
const secondsDisplayed = document.getElementById('time_seconds');
var questions 
let time = 20
let timeToCountdown
let timer
var resultInfo

createQuizIcons()

//event listeners
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++ // podnoszone dopiero po nacisnieciu next
    setNextQuestion()
    
}
)
menu.addEventListener('click', goToMenu)
finish.addEventListener('click', showResult)

// funkcja tworząca ikony quizów
function createQuizIcons(){
    myJson.quizes.forEach(obj => {
        const div = document.createElement('div')
        div.classList.add('quiz')
        div.setAttribute("id", obj.topic) //dodać id żeby można było zrobić append
        var numberOfTest = myJson.quizes.indexOf(obj) //numer testu
        
        //niepoprawny event listener
        div.addEventListener('click', function() {
            selectQuiz(numberOfTest)
            startButton.classList.remove('hide')
        })

        var picture = document.createElement("img")
        picture.setAttribute("src", obj.img)

        var p = document.createElement('p')
        p.innerText = obj.topic

        document.getElementById("quizes").appendChild(div);
        document.getElementById(obj.topic).appendChild(picture);
        document.getElementById(obj.topic).appendChild(p);
    }

    )
}
//funkcja przekazująca  przekazująca numer quizu i wyznaczające właściwe pytania do wyświetlenia
function selectQuiz(number){
    numberOfTestToPlay = number
    questions = myJson.quizes[numberOfTestToPlay].questions
    showSecondFase()
}


function startGame() {
    startButton.classList.add('hide')
    timeToCountdown = time
    currentQuestionIndex = 0
    score= 0
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
    isAnswered= false
    startNewInterval()
    questionContainerElement.style.display= "block"
    showTimer()
}



// funkcja odpowiedzialna za wyświetlanie nowych pytań po naciśnięciu next
function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
    isAnswered= false
}

//funkcja budująca div quizes z pytaniami i odpowiedziami
function showQuestion(question) {
    
    yourScore.innerText = score
    //tekst pytania
    questionElement.innerText = question.question
    //tworzenie przycisków
    question.answers = question.answers.sort(() => Math.random() - .5)
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        //jeśli odpowiedź correct true to przycisku correct tez true
        if (answer.correct){
            button.dataset.correct = answer.correct
        }
        //evenlistener do przycisku
        button.addEventListener('click', selectAnswer)
        //dodanie przycisku do zbioru przycisków
        answerButtonsElement.appendChild(button)
    })
}

// funkcja przywracająca kolor tła i przycisków oraz ukrywająca next
function resetState(){
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild){
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)

    }
}

//funkcja podnosząca wynik po poprawnej odpowiedzi (jako argument przyjmuje boolean)
function increaseScore(correctAnswer){
    if (correctAnswer){
        score += 1
        yourScore.innerText= score
    }
}

// funkcja odpowiedzialna za wyświetlanie UI po wyborze quizu
function showSecondFase(){
    footer.style.display= "flex";
    mainContainer.style.display= "block";
    menuToChoose.style.display= "none"
    counter.style.display= "flex"
    questionContainerElement.style.display= "none"
    
}
// funkcja przyjmująca eventListenera wyboru odpowiedzi
function selectAnswer(e) {
    // przypisanie wybranego buttonu
    const selectedButton = e.target
    // przypisanie poprawnej odpowiedzi, która pózniej zostanie przekazana jako argument
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    // wywołanie funkcji podnoszącej z if z wartością boolowską z przycisku, który był targetem eventu
    if(isAnswered === false){
        increaseScore(correct)
        isAnswered= true
    }
    Array.from(answerButtonsElement.children).forEach(button => {setStatusClass(button, button.dataset.correct)
        if (shuffledQuestions.length > currentQuestionIndex +1){
            nextButton.classList.remove('hide')
        } 
        // należy wykasować lub zmodyfikować przy konfiguracji tabeli z wynikiem
        else{
            // startButton.innerText = "Restart"
            // startButton.classList.remove('hide')
            showResult()
        }
    })
}
// funkcja powrotu do menu
function goToMenu(){
    menuToChoose.style.display = 'block'
    footer.style.display = 'none'
    results.style.display = 'none'
    menu.style.display = 'none'
    finish.style.display = 'flex'

}


//przypisanie klasy correct lub wrong dla body jeżeli correct selected buttonu jest true
function setStatusClass (element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')  
    }else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element){
    element.classList.remove('correct')
    element.classList.remove('correct')
}

// kod dla timera 
function startTimerLogic(){
    if (timeToCountdown === 0){
        showTimer();
        showResult();
        stopTimer();
    } else if(timeToCountdown > 0){
        showTimer()
    }
}
// zatrzymanie timera
function stopTimer(){
    clearInterval(timer)
    // interval = null
    console.log(`zatrzymano`)
}

//wyświetlanie czasu w formie minut i sekund
function showTimer() {
    let minutes = Math.floor(timeToCountdown / 60)
    let seconds = timeToCountdown % 60
    minutesDisplayed.textContent = minutes.toString().padStart(2, "0");
    secondsDisplayed.textContent = seconds.toString().padStart(2, "0");
    if (timeToCountdown != 0){
        timeToCountdown--
    }
    
}

function showResult(){
    // funkcja dobierająca komunikat po wyborze
    scoreToShow.textContent = `Twój wynik to ${score} na 10 punktów.`
    if(score> 9){
        resultInfo = "Gratulacje, świetny wynik"
        
    } else if(score >= 5 && score <=9 ){
        resultInfo = "Gratulacje, dobry wynik"
        
    } else if(score < 5){
        resultInfo = "Przykro nam, spróbuj ponownie"
    }
    testInfo.textContent = resultInfo

    //odkrywa i ukrywa elementy
    mainContainer.style.display = 'none'
    counter.style.display = 'none'
    menu.style.display = 'flex'
    finish.style.display = 'none'
    results.style.display = 'block'
    clearStatusClass(document.body)

    stopTimer(timer)

    //czyszczenie countera po zakończeniu quizu
    nextButton.classList.add('hide')
    timeToCountdown = time
    yourScore.innerText = 0
    showTimer()

}

// funkcja odliczająca czas w timerze
function startNewInterval(){
    timer = setInterval(() => {
        startTimerLogic()
        if (timeToCountdown <= 0) {
            showTimer();
            clearInterval(timer);
            stopInterval();
        }
        }, 1000);    
}

function stopInterval(){
    showResult()
    // nextButton.classList.add('hide')
    // timeToCountdown = time
    // yourScore.innerText = 0
    // showTimer()
    
}