// script.js

let timers = document.querySelectorAll('.timer');
let cutButtons = document.querySelectorAll('.cut-button');
let startButton = document.getElementById('startButton');
let questionBank = [
    "Mencione un programa nuevo o aplicación que ayude con el manejo y la optimización del tiempo",
    "Mencione programas nuevos que permitan el trabajo conjunto de un equipo",
    "Mencione una herramienta/técnica que ayuda a trabajar y descansar por tiempos específicos",
    "Mencione una aplicación que permite mostrar tableros de proyectos y tareas",
    "¿Cuál es el segundo apellido de Jhonatan?",
    "¿Qué está estudiando Nico actualmente?",
    "Mencione una aplicación que ha venido usando Elder recientemente y que permite integrar diseño y programación",
    "¿Cómo se llama el deporte que practica Yuli?",
    "Mencione una aplicación de reuniones que permite trabajar con un tablero para la construcción de todos",
    "¿Cuántos gaticos tiene Elder?",
    "¿En qué mes ingresó Jhonatan al equipo?",
    "¿Nico tiene segundo nombre?",
    "Mencione un país al que haya viajado Yuli",
    "¿De qué institución educativa viene Jhonatan?",
    "¿Cuál es el pregrado que tiene Elder?",
    "¿Nico tiene hermanos?",
    "¿Cómo se llama el equipo deportivo en el que está Yuli?"
];

let correctKeywords = [
    "google calendar", "trello", "miro", "jira", "delegar", "buscar apoyo", "priorizar", "recordatorios", "agenda", 
    "cuaderno", "cronograma", "pomodoro", "onetab", "rescuetime", "google keep", "figma", "activecollab", "teamwork", 
    "google meet", "zoom", "planificar", "organizar", "evaluación", "ia", "chatgpt", "pedir ayuda", "comunicar", 
    "notas", "alarmas", "hacer preguntas", "matriz", "apoyo", "planner", "proyectos", "controlar", "enfocar", 
    "lista de tareas", "scoro", "proofhub", "bitrix24", "toggl", "Sentire", "3", "4", "2", "1", "no", "sabaneta"
];

// Convert all keywords to lowercase for easy comparison
correctKeywords = correctKeywords.map(keyword => keyword.toLowerCase());

let timersActive = false;
let mainTimer;
let individualTimers = [];

// Function to start all timers
function startTimers() {
    timersActive = true;
    timers.forEach((timer, index) => {
        const initialTime = parseInt(timer.dataset.time);
        let remainingTime = initialTime;
        
        individualTimers[index] = setInterval(() => {
            updateTimer(timer, index, remainingTime);
            remainingTime--;
        }, 1000);
    });
    mainTimer = setInterval(() => updateMainTimer(), 1000);
}

// Function to update individual timer
function updateTimer(timer, index, remainingTime) {
    timer.textContent = `${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`;
    if (remainingTime <= 0) {
        clearInterval(individualTimers[index]);
        individualTimers[index] = null;
        gameOver(false);
    }
}

// Function to handle cut button click
cutButtons.forEach((button, index) => {
    button.addEventListener('click', () => askQuestion(index));
});

// Function to ask question and validate response
function askQuestion(index) {
    let randomQuestion = questionBank[Math.floor(Math.random() * questionBank.length)];
    let answer = prompt(randomQuestion);

    if (isCorrectAnswer(answer)) {
        clearInterval(individualTimers[index]);
        individualTimers[index] = null;
        cutButtons[index].disabled = true;
        checkWinCondition();
    } else {
        // If the answer is incorrect, reset the first inactive timer found
        resetInactiveTimers();
    }
}

// Function to check if the answer is correct
function isCorrectAnswer(answer) {
    if (!answer) return false; // Return false if no answer was provided
    return correctKeywords.some(keyword => answer.toLowerCase().includes(keyword));
}

// Function to reset the first inactive timer found
function resetInactiveTimers() {
    for (let i = 0; i < timers.length; i++) {
        if (!individualTimers[i] && cutButtons[i].disabled === true) { // Timer is inactive and button is also inactive
            const initialTime = parseInt(timers[i].dataset.time);
            timers[i].textContent = `${Math.floor(initialTime / 60)}:${initialTime % 60 < 10 ? '0' : ''}${initialTime % 60}`;
            let remainingTime = initialTime;

            // Reactivate the timer and button
            cutButtons[i].disabled = false;
            individualTimers[i] = setInterval(() => {
                updateTimer(timers[i], i, remainingTime);
                remainingTime--;
            }, 1000);

            break; // Stop after reactivating the first found inactive timer
        }
    }
}

// Function to check win condition
function checkWinCondition() {
    if ([...cutButtons].every(button => button.disabled)) {
        clearInterval(mainTimer);
        alert("🎉🎉🎉 ¡Felicitaciones! 🎉🎉🎉 Has logrado desactivar la bomba a tiempo ⏰");
        resetGame();
    }
}

// Function to end game if main timer or any timer reaches zero
function gameOver(hasWon) {
    alert(hasWon ? "🎉🎉🎉 ¡Felicitaciones! 🎉🎉🎉 Has logrado desactivar la bomba a tiempo ⏰" : "💣 Lo sentimos, la bomba ha explotado 💣");
    resetGame();
}

// Function to reset game
function resetGame() {
    timers.forEach((timer, index) => {
        const initialTime = parseInt(timer.dataset.time);
        timer.textContent = `${Math.floor(initialTime / 60)}:${initialTime % 60 < 10 ? '0' : ''}${initialTime % 60}`;
    });
    cutButtons.forEach(button => button.disabled = false);
    clearInterval(mainTimer);
    individualTimers.forEach((timer, index) => {
        clearInterval(timer);
        individualTimers[index] = null;
    });
    timersActive = false;
}

// Attach start function to start button
startButton.addEventListener('click', startTimers);