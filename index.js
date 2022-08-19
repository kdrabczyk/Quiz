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
let time = 300
let timeToCountdown
let timer
var resultInfo


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
    quizes.forEach(obj => {
        const div = document.createElement('div')
        div.classList.add('quiz')
        div.setAttribute("id", obj.topic) //dodać id żeby można było zrobić append
        var numberOfTest = quizes.indexOf(obj) //numer testu
        
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
    questions = quizes[numberOfTestToPlay].questions
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

const quizes = [
        {
            "topic": "Quiz historyczny",
            "img": "./images/column.jpg",
            "questions" : [
            {
                "question": "Kiedy założono miasto Rzym?",
                "answers": [
                    {"text": "21 kwietnia 753 r. p.n.e", "correct": true},
                    {"text": "14 lutego 203 r. p.n.e", "correct": false},
                    {"text": "01 stycznia 453 r. n.e.", "correct": false},
                    {"text": "3 marca 1000 r. n.e", "correct": false}
                ]
            },
            {
                "question": "Kiedy odbyła się bitwa pomiędzy siłami krzyżackimi, a polsko-litewskimi pod Grunwaldem?",
                "answers": [
                    {"text": "15 lipca 1410", "correct": true},
                    {"text": "13 lutego 1330", "correct": false},
                    {"text": "18 marca 1200", "correct": false},
                    {"text": "19 października 1900", "correct": false}

                ]
            },
            {
                "question": "W którym roku zakończyła się I Wojna Światowa?",
                "answers": [
                    {"text": "1918", "correct": true},
                    {"text": "1823", "correct": false},
                    {"text": "1920", "correct": false},
                    {"text": "1945", "correct": false}

                ]
            },
            {
                "question": "Którego prezydenta Polski zamordowano w zamachu 16 grudnia 1922 r",
                "answers": [
                    {"text": "Gabriela Narutowicza", "correct": true},
                    {"text": "Wojciecha Jaruzelskiego", "correct": false},
                    {"text": "Ignacego Mościckiego", "correct": false},
                    {"text": "Lecha Wałęse", "correct": false}

                ]
            },
            {
                "question": "W którym roku Krzysztof Kolumb odkrył amerykę?",
                "answers": [
                    {"text": "1863", "correct": false},
                    {"text": "1452", "correct": false},
                    {"text": "1492", "correct": true},
                    {"text": "1809", "correct": false}

                ]
            },
            {
                "question": "W którym roku Polska wstąpiła do Unii Europejskiej?",
                "answers": [
                    {"text": "2004 roku", "correct": true},
                    {"text": "1989", "correct": false},
                    {"text": "1999", "correct": false},
                    {"text": "2014", "correct": false}

                ]
            },
            {
                "question": "W którym roku powstała Organizacja Narodów Zjednoczonych?",
                "answers": [
                    {"text": "1945", "correct": true},
                    {"text": "1939", "correct": false},
                    {"text": "1952", "correct": false},
                    {"text": "1928", "correct": false}

                ]
            },
            {
                "question": "W którym roku Polska wstąpiła do Unii Europejskiej?",
                "answers": [
                    {"text": "2004 roku", "correct": true},
                    {"text": "1989", "correct": false},
                    {"text": "1999", "correct": false},
                    {"text": "2014", "correct": false}

                ]
            },
            {
                "question": "W którym roku naszej ery odbył się słynny w historii polskiego średniowiecza Zjazd gnieźnieński ?",
                "answers": [
                    {"text": "1000", "correct": true},
                    {"text": "968", "correct": false},
                    {"text": "1024", "correct": false},
                    {"text": "1500", "correct": false}

                ]
            },
            {
                "question": "W którym roku wybuchła Wielka rewolucja francuska?",
                "answers": [
                    {"text": "1789", "correct": true},
                    {"text": "1793", "correct": false},
                    {"text": "1800", "correct": false},
                    {"text": "1720", "correct": false}

                ]
            }
            ]
        },
        {
            "topic": "Quiz geograficzny",
            "img": "./images/globe.jpg",
            "questions" : [
            {
                "question": "Który szczyt jest najwyższym szczytem w Europie?",
                "answers": [
                    {"text": "Mont Blanc", "correct": true},
                    {"text": "Giewont", "correct": false},
                    {"text": "Elbrus", "correct": false},
                    {"text": "Klimandżaro", "correct": false}
                ]
            },
            {
                "question": "Na jakim kontynęcie leży Gujana Francuska?",
                "answers": [
                    {"text": "w Ameryce Południowej", "correct": true},
                    {"text": "w Ameryce Północnej", "correct": false},
                    {"text": "w Azji", "correct": false},
                    {"text": "w Afryce", "correct": false}   
                ]
            },
            {
                "question": "Do jakiego kraju należy Giblartar?",
                "answers": [
                    {"text": "Wielka Brytania", "correct": true},
                    {"text": "Francja", "correct": false},
                    {"text": "Rosja", "correct": false},
                    {"text": "Włochy", "correct": false}
                ]
            },
            {
                "question": "Który kraj nie jest sąsiadem Serbii?",
                "answers": [
                    {"text": "Chorwacja", "correct": false},
                    {"text": "Macedonia", "correct": false},
                    {"text": "Bośnia i Hercegowina", "correct": false},
                    {"text": "Słowenia", "correct": true}

                ]
            },
            {
                "question": "Jakie miasto jest stolicą Rumunii?",
                "answers": [
                    {"text": "Bukareszt", "correct": true},
                    {"text": "Budapeszt", "correct": false},
                    {"text": "Skopie", "correct": false},
                    {"text": "Saloniki", "correct": false}

                ]
            },
            {
                "question": "Jak nazywa się stolica Stanów Zjednoczonych?",
                "answers": [
                    {"text": "Waszyngton", "correct": true},
                    {"text": "Nowy Jork", "correct": false},
                    {"text": "Filadeflia", "correct": false},
                    {"text": "San Francisco", "correct": false}

                ]
            },
            {
                "question": "W jakim kraju leży miasto Rejkjawik?",
                "answers": [
                    {"text": "Islandia", "correct": true},
                    {"text": "Dania", "correct": false},
                    {"text": "Szwecja", "correct": false},
                    {"text": "Wielka Brytania", "correct": false}
                ]
            },
            {
                "question": "Jakie kraje zalicza się do tzw. Beneluksu?",
                "answers": [
                    {"text": "Belgię, Luksemburg, Holandię", "correct": true},
                    {"text": "Danię, Szwecję, Finlandię", "correct": false},
                    {"text": "Arabię Saudyjską, Zjednoczone Emiraty Arabskie, Oman", "correct": false},
                    {"text": "Polskę, Słowację, Czechy", "correct": false}

                ]
            },
            {
                "question": "Która z wymienionych poniżej rzek jest najdłuższa?",
                "answers": [
                    {"text": "Nil", "correct": true},
                    {"text": "Amazonka", "correct": false},
                    {"text": "Dunaj", "correct": false},
                    {"text": "Żółta Rzeka", "correct": false}
                ]
            },
            {
                "question": "Do jakiego kraju należy Nowafunladia?",
                "answers": [
                    {"text": "Kanada", "correct": true},
                    {"text": "Stany Zjednoczone", "correct": false},
                    {"text": "Wielka Brytania", "correct": false},
                    {"text": "Australia", "correct": false}

                ]
            }
            ]
        },
        {
            "topic": "Quiz historyczno-geograficzny z 1977 r.",
            "img": "./images/cccp.jpg",
            "questions" : [
            {
                "question": "W których miejscach ZSRR oraz w jakiej porze roku obywatele tego kraju mogą- jedni obserwować wschód, drudzy zaś zachód słońca?",
                "answers": [
                    {"text": "w Kaliningradzie i na Czukotce", "correct": true},
                    {"text": "w Taszkiencie i Gruzji", "correct": false},
                    {"text": "w Leningradzie i Doniecku", "correct": false},
                    {"text": "na Czukotce i we Władywostoku", "correct": false}
                ]
            },
            {
                "question": "Które morza stanowią nautralne granice ZSRR?",
                "answers": [
                    {"text": "Bałtyk,  Morze Beringa, Morze Czarne", "correct": true},
                    {"text": "Morze Barentsa, Morze śródziemne, Morze Czerwone", "correct": false},
                    {"text": "Bałtyk, Morze południowo-chińskie", "correct": false},
                    {"text": "Morze Barentsa, Morze Beringa, Morze Północne", "correct": false}
                ]
            },
            {
                "question": "Które republiki radzieckie nazywamy zakaukaskimi?",
                "answers": [
                    {"text": "Azerbejdżańska SSR, Armeńska SRR, Gruzińska SRR", "correct": true},
                    {"text": "Uzbecka SRR, Turkmeńska SRR ", "correct": false},
                    {"text": "Tadżycka SRR, Kirgisjak SRR", "correct": false},
                    {"text": "Estońska SRR, Białoruska SRR", "correct": false}

                ]
            },
            {
                "question": "Gdzie w ZSRR rosną pomarańcze oraz krzewy herbaciane?",
                "answers": [
                    {"text": "w Gruzji", "correct": true},
                    {"text": "na Białorusi", "correct": false},
                    {"text": "na Ukrainie", "correct": false},
                    {"text": "na Czukotce", "correct": false}
                    
                ]
            },
            {
                "question": "W której krainie ZSRR panuje równocześnie lato i zimia?",
                "answers": [
                    {"text": "Pamir", "correct": true},
                    {"text": "Ukraina", "correct": false},
                    {"text": "Sybieria", "correct": false},
                    {"text": "Czukotka", "correct": false}

                ]
            },
            {
                "question": "W których górach ZSRR znajdują się szczyty Gorkiego?",
                "answers": [
                    {"text": "Tien-szan", "correct": true},
                    {"text": "Kaukaz", "correct": false},
                    {"text": "Sachalin", "correct": false},
                    {"text": "Ural", "correct": false}

                ]
            },
            {
                "question": "Gdzie znajdują się najważniejsze zagłębia węglowe ZSRR?",
                "answers": [
                    {"text": "w Zagłębiu Donieckim", "correct": true},
                    {"text": "w Zagłębiu Kuźnieckim", "correct": false},
                    {"text": "w Zagłębiu Karagandy", "correct": false},
                    {"text": "w Zagłębiu Peczorskim", "correct": false}

                ]
            },
            {
                "question": "Które z poniższych miast ma najwiecej mieszkańców?",
                "answers": [
                    {"text": "Kijów", "correct": true},
                    {"text": "Baku", "correct": false},
                    {"text": "Taszkent", "correct": false},
                    {"text": "Leningrad", "correct": false}

                ]
            },
            {
                "question": "Jak nazywa się miasto w ZSRR leżące na ok. 100 wyspach?",
                "answers": [
                    {"text": "Leningrad", "correct": true},
                    {"text": "Moskwa", "correct": false},
                    {"text": "Kijów", "correct": false},
                    {"text": "Grozny", "correct": false}
                ]
            },
            {
                "question": "Czym wyróżnia się lodołamacz Lenin?",
                "answers": [
                    {"text": "napęd atomowy", "correct": true},
                    {"text": "drewniana konstrukcja", "correct": false},
                    {"text": "zatonął podczas pierwszego rejsu", "correct": false},
                    {"text": "brał udział w rewolucji październikowej", "correct": false}

                ]
            }
            ]
        }
    ]
    createQuizIcons()
