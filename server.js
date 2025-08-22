const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('exam_results.db');

// Create tables
db.serialize(() => {
    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        school_id TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Exam sessions table
    db.run(`CREATE TABLE IF NOT EXISTS exam_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        start_time DATETIME,
        end_time DATETIME,
        total_score INTEGER,
        correct_answers INTEGER,
        total_questions INTEGER,
        time_taken INTEGER,
        FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Question answers table
    db.run(`CREATE TABLE IF NOT EXISTS question_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_session_id INTEGER,
        question_number INTEGER,
        student_answer INTEGER,
        correct_answer INTEGER,
        is_correct BOOLEAN,
        time_spent INTEGER,
        FOREIGN KEY (exam_session_id) REFERENCES exam_sessions (id)
    )`);
});

// API Routes

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working!', 
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Store student and exam results
app.post('/api/submit-exam', (req, res) => {
    const { studentName, schoolId, answers, results, questions } = req.body;
    
    try {
        // First, insert or get student
        db.get('SELECT id FROM students WHERE school_id = ?', [schoolId], (err, student) => {
            if (err) {
                console.error('Error checking student:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            let studentId;
            if (student) {
                // Student exists, use existing ID
                studentId = student.id;
            } else {
                // Insert new student
                db.run('INSERT INTO students (name, school_id) VALUES (?, ?)', 
                    [studentName, schoolId], function(err) {
                    if (err) {
                        console.error('Error inserting student:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    studentId = this.lastID;
                    insertExamSession();
                });
                return;
            }

            // If student exists, proceed to insert exam session
            insertExamSession();

            function insertExamSession() {
                const startTime = new Date(Date.now() - (results.timeTaken * 1000)).toISOString();
                const endTime = new Date().toISOString();

                // Insert exam session
                db.run(`INSERT INTO exam_sessions 
                    (student_id, start_time, end_time, total_score, correct_answers, total_questions, time_taken) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [studentId, startTime, endTime, results.score, results.correctAnswers, results.totalQuestions, results.timeTaken],
                    function(err) {
                        if (err) {
                            console.error('Error inserting exam session:', err);
                            return res.status(500).json({ error: 'Database error' });
                        }

                        const examSessionId = this.lastID;

                        // Insert individual question answers
                        const answersToInsert = answers.map((answer, index) => {
                            const question = questions[index];
                            const isCorrect = answer === question.correctAnswer;
                            return [examSessionId, index + 1, answer, question.correctAnswer, isCorrect, 0];
                        });

                        // Insert all answers
                        const placeholders = answersToInsert.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
                        const values = answersToInsert.flat();

                        db.run(`INSERT INTO question_answers 
                            (exam_session_id, question_number, student_answer, correct_answer, is_correct, time_spent) 
                            VALUES ${placeholders}`, values, function(err) {
                            if (err) {
                                console.error('Error inserting answers:', err);
                                return res.status(500).json({ error: 'Database error' });
                            }

                            res.json({ 
                                success: true, 
                                message: 'Exam results stored successfully',
                                examSessionId: examSessionId
                            });
                        });
                    }
                );
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get exam results for a student
app.get('/api/student-results/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    
    db.all(`SELECT 
        s.name,
        s.school_id,
        es.total_score,
        es.correct_answers,
        es.total_questions,
        es.time_taken,
        es.start_time,
        es.end_time
        FROM students s
        JOIN exam_sessions es ON s.id = es.student_id
        WHERE s.school_id = ?
        ORDER BY es.start_time DESC`, [schoolId], (err, results) => {
        if (err) {
            console.error('Error fetching results:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all exam results (admin view)
app.get('/api/all-results', (req, res) => {
    console.log('Admin requested all results');
    
    // First, let's check what's in the database
    db.all('SELECT COUNT(*) as count FROM students', (err, studentCount) => {
        if (err) {
            console.error('Error counting students:', err);
            return res.status(500).json({ error: 'Database error counting students' });
        }
        
        db.all('SELECT COUNT(*) as count FROM exam_sessions', (err, examCount) => {
            if (err) {
                console.error('Error counting exam sessions:', err);
                return res.status(500).json({ error: 'Database error counting exams' });
            }
            
            console.log(`Database has ${studentCount[0].count} students and ${examCount[0].count} exam sessions`);
            
            // Now get the actual results
            db.all(`SELECT 
                s.name,
                s.school_id,
                es.total_score,
                es.correct_answers,
                es.total_questions,
                es.time_taken,
                es.start_time,
                es.end_time
                FROM students s
                JOIN exam_sessions es ON s.id = es.student_id
                ORDER BY es.start_time DESC`, (err, results) => {
                if (err) {
                    console.error('Error fetching all results:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                
                console.log(`Returning ${results.length} results`);
                res.json(results);
            });
        });
    });
});

// Get detailed results for a specific exam session
app.get('/api/exam-details/:examSessionId', (req, res) => {
    const { examSessionId } = req.params;
    
    db.all(`SELECT 
        qa.question_number,
        qa.student_answer,
        qa.correct_answer,
        qa.is_correct,
        qa.time_spent
        FROM question_answers qa
        WHERE qa.exam_session_id = ?
        ORDER BY qa.question_number`, [examSessionId], (err, results) => {
        if (err) {
            console.error('Error fetching exam details:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database file: exam_results.db');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
