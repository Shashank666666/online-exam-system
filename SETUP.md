# Database Setup Guide

This guide will help you set up the database functionality for the Online Exam System.

## 🚀 Quick Start

### 1. Install Node.js
Make sure you have Node.js installed on your system:
- Download from: https://nodejs.org/
- Recommended version: 16.x or higher

### 2. Install Dependencies
Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install the required packages:
- `express` - Web server framework
- `sqlite3` - SQLite database driver
- `cors` - Cross-origin resource sharing
- `nodemon` - Development server (auto-restart)

### 3. Start the Server
Run the following command to start the database server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Access the System
- **Main Exam System**: `http://localhost:3000/index.html`
- **Admin Panel**: `http://localhost:3000/admin.html`

## 📊 Database Structure

The system automatically creates three tables:

### Students Table
- `id` - Unique identifier
- `name` - Student's full name
- `school_id` - Unique school ID
- `created_at` - Registration timestamp

### Exam Sessions Table
- `id` - Unique session identifier
- `student_id` - Reference to student
- `start_time` - Exam start timestamp
- `end_time` - Exam end timestamp
- `total_score` - Percentage score
- `correct_answers` - Number of correct answers
- `total_questions` - Total questions in exam
- `time_taken` - Time taken in seconds

### Question Answers Table
- `id` - Unique answer identifier
- `exam_session_id` - Reference to exam session
- `question_number` - Question number (1-10)
- `student_answer` - Student's selected option
- `correct_answer` - Correct option
- `is_correct` - Boolean indicating correctness
- `time_spent` - Time spent on question

## 🔧 Configuration

### Port Configuration
To change the server port, edit `server.js`:

```javascript
const PORT = 3000; // Change this to your preferred port
```

### Database File
The SQLite database file (`exam_results.db`) is automatically created in the project root directory.

## 📱 API Endpoints

### POST `/api/submit-exam`
Stores exam results in the database.

**Request Body:**
```json
{
  "studentName": "John Doe",
  "schoolId": "STU001",
  "answers": [2, 1, 3, 1, 1, 2, 2, 2, 2, 1],
  "results": {
    "score": 80,
    "correctAnswers": 8,
    "totalQuestions": 10,
    "timeTaken": 540
  },
  "questions": [...]
}
```

### GET `/api/student-results/:schoolId`
Retrieves all exam results for a specific student.

### GET `/api/all-results`
Retrieves all exam results (admin view).

### GET `/api/exam-details/:examSessionId`
Retrieves detailed question-by-question results for a specific exam session.

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   **Solution**: Change the port number in `server.js` or kill the process using port 3000.

2. **Database Permission Error**
   ```
   Error: SQLITE_CANTOPEN: unable to open database file
   ```
   **Solution**: Ensure the application has write permissions in the project directory.

3. **Module Not Found**
   ```
   Error: Cannot find module 'express'
   ```
   **Solution**: Run `npm install` to install dependencies.

### Database Management

#### View Database Contents
You can use SQLite browser tools to view the database:
- **DB Browser for SQLite**: https://sqlitebrowser.org/
- **SQLite Studio**: https://sqlitestudio.pl/

#### Reset Database
To reset all data, simply delete the `exam_results.db` file and restart the server.

## 🔒 Security Considerations

- The system is designed for local/educational use
- No authentication is implemented by default
- Consider adding authentication for production use
- Database file should be backed up regularly

## 📈 Performance

- SQLite is suitable for small to medium-sized applications
- For high-traffic scenarios, consider migrating to PostgreSQL or MySQL
- The current setup can handle hundreds of concurrent users

## 🚀 Production Deployment

For production deployment:

1. **Use a production database** (PostgreSQL, MySQL)
2. **Add authentication and authorization**
3. **Implement HTTPS**
4. **Add rate limiting**
5. **Set up proper logging**
6. **Use environment variables for configuration**

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the server is running
4. Check database file permissions

---

**The database integration maintains the exact same user experience while adding persistent storage capabilities.**
