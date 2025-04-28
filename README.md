# Mock Lecturer Evaluation Portal

## Setup

1. Extract this ZIP.
2. `cd mock-eval-portal`
3. `npm install`
4. `npm run seed`
5. `npm start`
6. Visit http://localhost:3000 in your browser.

## Usage

- Login with portal ID (e.g., stu001) and password "password123".
- Students who have completed all course evaluations will see a "Print Exam Card" button.
- Others will see a list of pending courses and a message to complete evaluations.

## GitHub

To push to GitHub:
1. `git init`
2. `git add .`
3. `git commit -m "Initial mock portal"`
4. Create a GitHub repo and add remote:
   `git remote add origin <your-repo-URL>`
5. `git push -u origin main`
