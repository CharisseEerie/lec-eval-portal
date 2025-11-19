# 🧑‍🎓📚 Lecturer Evaluation Portal

**Purpose:** This portal verifies that a student has completed all lecturer evaluations for their enrolled course units before granting access to their exam card.


##  Key Features

- **SSO Login:** Students use their corporate email and password to sign in.
- **Per-Course Evaluation Check:** Ensures each enrolled course unit has a completed evaluation record.
- **Eligibility Gate:** Students with _all_ evaluations completed can generate & print their exam card.
- **Guidance for Pending Evaluations:** Lists any course units awaiting feedback, with a link to the evaluation site and a brief rationale on why lecturer feedback matters.
- **Self-Contained Mock:** Uses a sample SQLite database and placeholder data to simulate real portal behavior.


##  How It Works

1. **Login** with corporate email (portal ID) and a standard password.
2. The server queries the database for all `enrollments` & `evaluations`.
3. If **every** course unit shows `completed = true`, the portal renders a "Print Exam Card" button.
4. Otherwise, it displays the list of pending units plus a short message:
   
   > _“You need to complete evaluations for these courses before printing your exam card.”_

5. When eligible, the portal uses Puppeteer to generate a PDF of the exam card for download/print.


## 📬 Feedback & Contributions

Feel free to open issues or pull requests to improve this portal.

<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <h1>Welcome, <%= student.name %></h1>

  <% if (status.allDone) { %>
    <p class="success">✅ You’ve completed all evaluations.</p>
    <form method="post" action="/print">
      <button type="submit">Print Exam Card</button>
    </form>
  <% } else { %>
    <p class="error">⛔ Please complete evaluations for:</p>
    <ul>
      <% status.pending.forEach(c => { %>
        <li><strong><%= c.code %></strong>: <%= c.title %> (<em>Lecturer: <%= c.lecturer %></em>)</li>
      <% }) %>
    </ul>
    <p>
      <a href="https://evaluation.school.ac.ke" target="_blank" rel="noopener noreferrer" class="btn">Go to Lecturer Evaluation Site</a>
    </p>

    <section>
      <h2>Why Evaluate?</h2>
      <p>Lecturer feedback improves teaching quality and curriculum, ensuring your voice is heard and course content is continuously enhanced.</p>
    </section>
  <% } %>
</body>
</html>