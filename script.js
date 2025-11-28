// TODO(you): Write the JavaScript necessary to complete the homework.




const answers = {}; // { 'one': 'blep', 'two': 'cart', 'three': 'nerd' }
let isQuizComplete = false;

// --- Helper Functions ---

/**
 * 
 * @param {HTMLElement} selectedChoice - T
 */
function updateQuestionChoices(selectedChoice) {
    const questionId = selectedChoice.dataset.questionId;
    const choiceId = selectedChoice.dataset.choiceId;
    const choiceGrid = selectedChoice.closest('.choice-grid');
    
    // 1. Reset all choices in the current question
    const allChoices = choiceGrid.querySelectorAll('div[data-question-id="' + questionId + '"]');
    allChoices.forEach(choice => {
        choice.style.backgroundColor = ''; // Reset background
        choice.style.opacity = ''; // Reset opacity
        const checkbox = choice.querySelector('.checkbox');
        if (checkbox) {
            checkbox.src = 'images/unchecked.png'; // Reset checkbox
        }
    });

    // 2. Apply styles to the selected choice
    selectedChoice.style.backgroundColor = '#cfe3ff';
    const selectedCheckbox = selectedChoice.querySelector('.checkbox');
    if (selectedCheckbox) {
        selectedCheckbox.src = 'images/checked.png';
    }

    // 3. Apply opacity to unchosen items
    allChoices.forEach(choice => {
        if (choice.dataset.choiceId !== choiceId) {
            choice.style.opacity = '0.6';
        }
    });
}

/**
 * Calculates the quiz result based on the current answers.
 * @returns {string} The key for the final result in RESULTS_MAP.
 */
function calculateResult() {
    // Check if all three questions have been answered
    if (Object.keys(answers).length !== 3) {
        return null;
    }

    let totalId = 0;
    for (const questionId in answers) {
        const choiceId = answers[questionId];
        // Find the corresponding id from RESULTS_MAP
        const result = RESULTS_MAP[choiceId];
        if (result) {
            totalId += result.id;
        }
    }

    // Scoring: Sum the ids and divide by 3. The result is the final id.
    const finalId = Math.floor(totalId / 3);

    // Find the result key that matches the finalId
    for (const key in RESULTS_MAP) {
        if (RESULTS_MAP[key].id === finalId) {
            return key;
        }
    }

    // Should not happen if RESULTS_MAP is well-defined
    return null;
}

/**
 * Displays the personality result section at the bottom of the page.
 * @param {string} resultKey - The key for the final result in RESULTS_MAP.
 */
function displayResult(resultKey) {
    const result = RESULTS_MAP[resultKey];
    if (!result) return;

    let resultSection = document.getElementById('quiz-result');
    if (!resultSection) {
        // Create the result section if it doesn't exist
        resultSection = document.createElement('section');
        resultSection.id = 'quiz-result';
        document.querySelector('article').appendChild(resultSection);
    }

    resultSection.innerHTML = `
        <hr>
        <div class="result-button">
            <p>Your Result:</p>
            <h1>${result.title}</h1>
        </div>
        <p>${result.contents}</p>
        <button id="restart-quiz">Restart quiz</button>
    `;

    // Add event listener for the restart button
    document.getElementById('restart-quiz').addEventListener('click', resetQuiz);
}

/**
 * Handles the click event on any answer choice.
 * @param {Event} event - The click event.
 */
function handleChoiceClick(event) {
    // Stop if the quiz is already complete
    if (isQuizComplete) {
        return;
    }

    // Find the closest parent div with data-choice-id and data-question-id
    const selectedChoice = event.currentTarget;
    const questionId = selectedChoice.dataset.questionId;
    const choiceId = selectedChoice.dataset.choiceId;

    // 1. Update the answers state
    answers[questionId] = choiceId;

    // 2. Update the visual appearance of the choices
    updateQuestionChoices(selectedChoice);

    // 3. Check if the quiz is complete
    if (Object.keys(answers).length === 3) {
        isQuizComplete = true;
        const resultKey = calculateResult();
        if (resultKey) {
            displayResult(resultKey);
        }
    }
}

/**
 * Resets the quiz to its initial state.
 */
function resetQuiz() {
    // 1. Clear state
    for (const key in answers) {
        delete answers[key];
    }
    isQuizComplete = false;

    // 2. Reset visual appearance of all choices
    const allChoices = document.querySelectorAll('.choice-grid > div');
    allChoices.forEach(choice => {
        choice.style.backgroundColor = '';
        choice.style.opacity = '';
        const checkbox = choice.querySelector('.checkbox');
        if (checkbox) {
            checkbox.src = 'images/unchecked.png';
        }
    });

    // 3. Remove the result section
    const resultSection = document.getElementById('quiz-result');
    if (resultSection) {
        resultSection.remove();
    }

    // 4. Scroll to the top of the "Pick a pup" element
    const pickAPup = document.querySelector('.question-name');
    if (pickAPup) {
        pickAPup.scrollIntoView();
    }
}

// --- Initialization ---

/**
 * Attaches event listeners to all answer choices.
 */
function initializeQuiz() {
    const choices = document.querySelectorAll('.choice-grid > div');
    choices.forEach(choice => {
        choice.addEventListener('click', handleChoiceClick);
    });
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initializeQuiz);
