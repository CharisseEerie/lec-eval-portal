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

---

## 📬 Feedback & Contributions

Feel free to open issues or pull requests to improve this mock portal.

