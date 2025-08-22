// Online Exam System - Main JavaScript File
// Best Practices Implementation with Error Handling and Time Management

class OnlineExamSystem {
    constructor() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.examStartTime = null;
        this.questionTimer = null;
        this.totalTimer = null;
        this.isExamActive = false;
        
        // Configuration
        this.config = {
            timePerQuestion: 60, // seconds per question
            totalQuestions: 10,
            warningTime: 10 // seconds before auto-submit warning
        };
        
        // Sample questions database
        this.questions = [
            {
                id: 1,
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2
            },
            {
                id: 2,
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            },
            {
                id: 3,
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                correctAnswer: 3
            },
            {
                id: 4,
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "What is the chemical symbol for gold?",
                options: ["Ag", "Au", "Fe", "Cu"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "Which year did World War II end?",
                options: ["1943", "1944", "1945", "1946"],
                correctAnswer: 2
            },
            {
                id: 7,
                question: "What is the square root of 144?",
                options: ["10", "11", "12", "13"],
                correctAnswer: 2
            },
            {
                id: 8,
                question: "Which country is home to the kangaroo?",
                options: ["New Zealand", "South Africa", "Australia", "India"],
                correctAnswer: 2
            },
            {
                id: 9,
                question: "What is the main component of the sun?",
                options: ["Liquid lava", "Molten iron", "Hydrogen gas", "Solid rock"],
                correctAnswer: 2
            },
            {
                id: 10,
                question: "How many sides does a hexagon have?",
                options: ["5", "6", "7", "8"],
                correctAnswer: 1
            }
        ];
        
        this.initializeEventListeners();
        this.updateDisplayInfo();
    }
    
    /**
     * Initialize all event listeners with error handling
     */
    initializeEventListeners() {
        try {
            // Start exam button
            const startExamBtn = document.getElementById('start-exam-btn');
            if (startExamBtn) {
                startExamBtn.addEventListener('click', () => this.handleStartExam());
            }
            
            // Next question button
            const nextQuestionBtn = document.getElementById('next-question-btn');
            if (nextQuestionBtn) {
                nextQuestionBtn.addEventListener('click', () => this.handleNextQuestion());
            }
            
            // Submit exam button
            const submitExamBtn = document.getElementById('submit-exam-btn');
            if (submitExamBtn) {
                submitExamBtn.addEventListener('click', () => this.handleSubmitExam());
            }
            
            // Restart exam button
            const restartExamBtn = document.getElementById('restart-exam-btn');
            if (restartExamBtn) {
                restartExamBtn.addEventListener('click', () => this.handleRestartExam());
            }
            
            // Form validation
            const studentNameInput = document.getElementById('student-name');
            const studentIdInput = document.getElementById('student-id');
            
            if (studentNameInput && studentIdInput) {
                [studentNameInput, studentIdInput].forEach(input => {
                    input.addEventListener('input', () => this.validateForm());
                });
            }
            
        } catch (error) {
            this.showToast('Error initializing exam system', 'error');
            console.error('Error initializing event listeners:', error);
        }
    }
    
    /**
     * Update display information on welcome screen
     */
    updateDisplayInfo() {
        try {
            const totalQuestionsElement = document.getElementById('total-questions');
            const timePerQuestionElement = document.getElementById('time-per-question');
            const totalTimeElement = document.getElementById('total-time');
            
            if (totalQuestionsElement) {
                totalQuestionsElement.textContent = this.config.totalQuestions;
            }
            
            if (timePerQuestionElement) {
                timePerQuestionElement.textContent = `${this.config.timePerQuestion}s`;
            }
            
            if (totalTimeElement) {
                const totalTimeInMinutes = Math.floor((this.config.timePerQuestion * this.config.totalQuestions) / 60);
                const totalTimeInSeconds = (this.config.timePerQuestion * this.config.totalQuestions) % 60;
                totalTimeElement.textContent = `${totalTimeInMinutes}:${totalTimeInSeconds.toString().padStart(2, '0')}`;
            }
            
        } catch (error) {
            console.error('Error updating display info:', error);
        }
    }
    
    /**
     * Validate form inputs
     */
    validateForm() {
        try {
            const studentName = document.getElementById('student-name')?.value.trim();
            const studentId = document.getElementById('student-id')?.value.trim();
            const startExamBtn = document.getElementById('start-exam-btn');
            
            if (startExamBtn) {
                startExamBtn.disabled = !(studentName && studentId);
            }
            
        } catch (error) {
            console.error('Error validating form:', error);
        }
    }
    
    /**
     * Handle start exam button click
     */
    handleStartExam() {
        try {
            const studentName = document.getElementById('student-name')?.value.trim();
            const studentId = document.getElementById('student-id')?.value.trim();
            
            if (!studentName || !studentId) {
                this.showToast('Please fill in all required fields', 'warning');
                return;
            }
            
            this.startExam(studentName, studentId);
            
        } catch (error) {
            this.showToast('Error starting exam', 'error');
            console.error('Error handling start exam:', error);
        }
    }
    
    /**
     * Start the exam
     */
    startExam(studentName, studentId) {
        try {
            this.isExamActive = true;
            this.examStartTime = Date.now();
            this.currentQuestionIndex = 0;
            this.answers = new Array(this.config.totalQuestions).fill(null);
            
            // Update student info display
            const currentStudentNameElement = document.getElementById('current-student-name');
            const currentStudentIdElement = document.getElementById('current-student-id');
            
            if (currentStudentNameElement) {
                currentStudentNameElement.textContent = `Student: ${studentName}`;
            }
            
            if (currentStudentIdElement) {
                currentStudentIdElement.textContent = `ID: ${studentId}`;
            }
            
            // Switch to exam screen
            this.showScreen('exam-screen');
            
            // Display first question
            this.displayQuestion();
            
            // Start timers
            this.startQuestionTimer();
            this.startTotalTimer();
            
            this.showToast('Exam started! Good luck!', 'success');
            
        } catch (error) {
            this.showToast('Error starting exam', 'error');
            console.error('Error starting exam:', error);
        }
    }
    
    /**
     * Display current question
     */
    displayQuestion() {
        try {
            if (this.currentQuestionIndex >= this.config.totalQuestions) {
                this.finishExam();
                return;
            }
            
            const question = this.questions[this.currentQuestionIndex];
            const questionTextElement = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options-container');
            const questionCounterElement = document.getElementById('question-counter');
            const progressFillElement = document.getElementById('progress-fill');
            
            // Update question text
            if (questionTextElement) {
                questionTextElement.textContent = question.question;
            }
            
            // Update question counter
            if (questionCounterElement) {
                questionCounterElement.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.config.totalQuestions}`;
            }
            
            // Update progress bar
            if (progressFillElement) {
                const progress = ((this.currentQuestionIndex + 1) / this.config.totalQuestions) * 100;
                progressFillElement.style.width = `${progress}%`;
            }
            
            // Generate options
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                
                question.options.forEach((option, index) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    optionElement.dataset.optionIndex = index;
                    
                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = 'question-option';
                    radioInput.id = `option-${index}`;
                    radioInput.value = index;
                    
                    const label = document.createElement('label');
                    label.htmlFor = `option-${index}`;
                    label.textContent = option;
                    
                    optionElement.appendChild(radioInput);
                    optionElement.appendChild(label);
                    
                    // Add click event for option selection
                    optionElement.addEventListener('click', () => this.selectOption(index));
                    
                    optionsContainer.appendChild(optionElement);
                });
            }
            
            // Reset question timer
            this.resetQuestionTimer();
            
            // Show/hide buttons based on question position
            this.updateNavigationButtons();
            
        } catch (error) {
            this.showToast('Error displaying question', 'error');
            console.error('Error displaying question:', error);
        }
    }
    
    /**
     * Handle option selection
     */
    selectOption(optionIndex) {
        try {
            // Remove previous selection
            const options = document.querySelectorAll('.option');
            options.forEach(option => option.classList.remove('selected'));
            
            // Select new option
            const selectedOption = document.querySelector(`[data-option-index="${optionIndex}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
                selectedOption.querySelector('input[type="radio"]').checked = true;
            }
            
            // Store answer
            this.answers[this.currentQuestionIndex] = optionIndex;
            
            // Enable next button
            const nextQuestionBtn = document.getElementById('next-question-btn');
            if (nextQuestionBtn) {
                nextQuestionBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Error selecting option:', error);
        }
    }
    
    /**
     * Handle next question button click
     */
    handleNextQuestion() {
        try {
            if (this.currentQuestionIndex < this.config.totalQuestions - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
            } else {
                this.finishExam();
            }
            
        } catch (error) {
            this.showToast('Error moving to next question', 'error');
            console.error('Error handling next question:', error);
        }
    }
    
    /**
     * Handle submit exam button click
     */
    handleSubmitExam() {
        try {
            this.finishExam();
            
        } catch (error) {
            this.showToast('Error submitting exam', 'error');
            console.error('Error handling submit exam:', error);
        }
    }
    
    /**
     * Start question timer
     */
    startQuestionTimer() {
        try {
            this.questionTimer = setInterval(() => {
                const questionTimerElement = document.getElementById('question-timer');
                if (questionTimerElement) {
                    let timeLeft = parseInt(questionTimerElement.textContent);
                    
                    if (timeLeft <= 0) {
                        this.autoProgressQuestion();
                        return;
                    }
                    
                    if (timeLeft <= this.config.warningTime) {
                        questionTimerElement.style.color = '#f56565';
                        questionTimerElement.style.fontWeight = 'bold';
                    }
                    
                    questionTimerElement.textContent = timeLeft - 1;
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error starting question timer:', error);
        }
    }
    
    /**
     * Reset question timer
     */
    resetQuestionTimer() {
        try {
            const questionTimerElement = document.getElementById('question-timer');
            if (questionTimerElement) {
                questionTimerElement.textContent = this.config.timePerQuestion;
                questionTimerElement.style.color = 'white';
                questionTimerElement.style.fontWeight = '700';
            }
            
        } catch (error) {
            console.error('Error resetting question timer:', error);
        }
    }
    
    /**
     * Start total timer
     */
    startTotalTimer() {
        try {
            this.totalTimer = setInterval(() => {
                const totalTimerElement = document.getElementById('total-timer');
                if (totalTimerElement && this.examStartTime) {
                    const elapsed = Math.floor((Date.now() - this.examStartTime) / 1000);
                    const totalTime = this.config.timePerQuestion * this.config.totalQuestions;
                    const remaining = totalTime - elapsed;
                    
                    if (remaining <= 0) {
                        this.finishExam();
                        return;
                    }
                    
                    const minutes = Math.floor(remaining / 60);
                    const seconds = remaining % 60;
                    totalTimerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error starting total timer:', error);
        }
    }
    
    /**
     * Auto-progress to next question when time expires
     */
    autoProgressQuestion() {
        try {
            this.showToast('Time\'s up! Moving to next question...', 'warning');
            
            // If no answer selected, mark as unanswered
            if (this.answers[this.currentQuestionIndex] === null) {
                this.answers[this.currentQuestionIndex] = -1; // -1 indicates unanswered
            }
            
            // Auto-progress to next question
            setTimeout(() => {
                this.handleNextQuestion();
            }, 1500);
            
        } catch (error) {
            console.error('Error auto-progressing question:', error);
        }
    }
    
    /**
     * Update navigation buttons visibility
     */
    updateNavigationButtons() {
        try {
            const nextQuestionBtn = document.getElementById('next-question-btn');
            const submitExamBtn = document.getElementById('submit-exam-btn');
            
            if (nextQuestionBtn && submitExamBtn) {
                if (this.currentQuestionIndex === this.config.totalQuestions - 1) {
                    nextQuestionBtn.style.display = 'none';
                    submitExamBtn.style.display = 'inline-block';
                } else {
                    nextQuestionBtn.style.display = 'inline-block';
                    submitExamBtn.style.display = 'none';
                }
            }
            
        } catch (error) {
            console.error('Error updating navigation buttons:', error);
        }
    }
    
    /**
     * Finish the exam and show results
     */
    finishExam() {
        try {
            this.isExamActive = false;
            
            // Clear timers
            if (this.questionTimer) {
                clearInterval(this.questionTimer);
            }
            if (this.totalTimer) {
                clearInterval(this.totalTimer);
            }
            
            // Calculate results
            const results = this.calculateResults();
            
            // Store results in database
            this.storeExamResults(results);
            
            // Display results
            this.displayResults(results);
            
            // Switch to results screen
            this.showScreen('results-screen');
            
        } catch (error) {
            this.showToast('Error finishing exam', 'error');
            console.error('Error finishing exam:', error);
        }
    }
    
    /**
     * Calculate exam results
     */
    calculateResults() {
        try {
            let correctAnswers = 0;
            let unansweredQuestions = 0;
            
            this.answers.forEach((answer, index) => {
                if (answer === -1) {
                    unansweredQuestions++;
                } else if (answer === this.questions[index].correctAnswer) {
                    correctAnswers++;
                }
            });
            
            const score = Math.round((correctAnswers / this.config.totalQuestions) * 100);
            const timeTaken = this.examStartTime ? Math.floor((Date.now() - this.examStartTime) / 1000) : 0;
            
            return {
                score,
                correctAnswers,
                totalQuestions: this.config.totalQuestions,
                unansweredQuestions,
                timeTaken,
                answers: this.answers
            };
            
        } catch (error) {
            console.error('Error calculating results:', error);
            return {
                score: 0,
                correctAnswers: 0,
                totalQuestions: this.config.totalQuestions,
                unansweredQuestions: 0,
                timeTaken: 0,
                answers: []
            };
        }
    }
    
    /**
     * Display exam results
     */
    displayResults(results) {
        try {
            // Update summary
            const finalScoreElement = document.getElementById('final-score');
            const correctAnswersElement = document.getElementById('correct-answers');
            const timeTakenElement = document.getElementById('time-taken');
            
            if (finalScoreElement) {
                finalScoreElement.textContent = `${results.score}%`;
            }
            
            if (correctAnswersElement) {
                correctAnswersElement.textContent = `${results.correctAnswers}/${results.totalQuestions}`;
            }
            
            if (timeTakenElement) {
                const minutes = Math.floor(results.timeTaken / 60);
                const seconds = results.timeTaken % 60;
                timeTakenElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Generate answer review
            this.generateAnswerReview(results);
            
        } catch (error) {
            console.error('Error displaying results:', error);
        }
    }
    
    /**
     * Generate answer review section
     */
    generateAnswerReview(results) {
        try {
            const answersReviewElement = document.getElementById('answers-review');
            if (!answersReviewElement) return;
            
            answersReviewElement.innerHTML = '<h3>Answer Review</h3>';
            
            this.questions.forEach((question, index) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const isUnanswered = userAnswer === -1;
                
                const reviewItem = document.createElement('div');
                reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
                
                const status = isUnanswered ? 'Unanswered' : (isCorrect ? 'Correct' : 'Incorrect');
                const statusClass = isUnanswered ? 'warning' : (isCorrect ? 'correct' : 'incorrect');
                
                reviewItem.innerHTML = `
                    <h4>Question ${index + 1}</h4>
                    <p>${question.question}</p>
                    <p><strong>Your Answer:</strong> ${isUnanswered ? 'No answer' : question.options[userAnswer]}</p>
                    <p><strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}</p>
                    <span class="status ${statusClass}">${status}</span>
                `;
                
                answersReviewElement.appendChild(reviewItem);
            });
            
        } catch (error) {
            console.error('Error generating answer review:', error);
        }
    }
    
    /**
     * Handle restart exam button click
     */
    handleRestartExam() {
        try {
            // Reset all state
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.examStartTime = null;
            this.isExamActive = false;
            
            // Clear any existing timers
            if (this.questionTimer) {
                clearInterval(this.questionTimer);
            }
            if (this.totalTimer) {
                clearInterval(this.totalTimer);
            }
            
            // Reset form
            const studentNameInput = document.getElementById('student-name');
            const studentIdInput = document.getElementById('student-id');
            
            if (studentNameInput) studentNameInput.value = '';
            if (studentIdInput) studentIdInput.value = '';
            
            // Show welcome screen
            this.showScreen('welcome-screen');
            
            // Reset validation
            this.validateForm();
            
        } catch (error) {
            this.showToast('Error restarting exam', 'error');
            console.error('Error restarting exam:', error);
        }
    }
    
    /**
     * Show specific screen
     */
    showScreen(screenId) {
        try {
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => screen.classList.remove('active'));
            
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
            
        } catch (error) {
            console.error('Error showing screen:', error);
        }
    }
    
    /**
     * Store exam results in database
     */
    async storeExamResults(results) {
        try {
            const studentName = document.getElementById('current-student-name')?.textContent.replace('Student: ', '');
            const studentId = document.getElementById('current-student-id')?.textContent.replace('ID: ', '');
            
            if (!studentName || !studentId) {
                console.error('Student information not found');
                return;
            }

            const examData = {
                studentName: studentName,
                schoolId: studentId,
                answers: this.answers,
                results: results,
                questions: this.questions
            };

            const response = await fetch('/api/submit-exam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showToast('Results saved to database successfully!', 'success');
                console.log('Exam results stored:', result);
            } else {
                const error = await response.json();
                this.showToast('Failed to save results to database', 'error');
                console.error('Database error:', error);
            }

        } catch (error) {
            this.showToast('Error saving results to database', 'error');
            console.error('Error storing exam results:', error);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        try {
            const toast = document.getElementById('toast');
            if (!toast) return;
            
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
            
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }
}

// Initialize the exam system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new OnlineExamSystem();
    } catch (error) {
        console.error('Error initializing Online Exam System:', error);
        
        // Fallback error display
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="screen active">
                    <div class="welcome-content">
                        <h1>Error</h1>
                        <p>Failed to initialize the exam system. Please refresh the page.</p>
                        <button onclick="location.reload()" class="btn btn-primary">Refresh Page</button>
                    </div>
                </div>
            `;
        }
    }
});
