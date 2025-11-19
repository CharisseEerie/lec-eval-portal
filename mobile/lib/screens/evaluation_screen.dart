// mobile/lib/screens/evaluation_screen.dart
import '../services/mock_database.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/global.dart';

String currentStudentId = '';

class EvaluationScreen extends StatefulWidget {
  final String studentName;
  final String regNo;

  const EvaluationScreen({
    super.key,
    required this.studentName,
    required this.regNo,
  });

  @override
  State<EvaluationScreen> createState() => _EvaluationScreenState();
}

class _EvaluationScreenState extends State<EvaluationScreen> {
  // -----------------------------------------------------------------------
  // 1. Mock Course Data (8 Units)
  // -----------------------------------------------------------------------
  final List<Map<String, dynamic>> _courses = [
    {
      'code': 'SPH 101',
      'title': 'Basic Mechanics',
      'lecturer': 'Dr. Matthew Munji',
    },
    {
      'code': 'SPH 102',
      'title': 'Electricity & Magnetism',
      'lecturer': 'Dr. Jane Maina',
    },
    {
      'code': 'MAT 101',
      'title': 'Calculus I',
      'lecturer': 'Prof. James Kamau',
    },
    {
      'code': 'CHE 101',
      'title': 'General Chemistry',
      'lecturer': 'Dr. Sarah Ochieng',
    },
    {
      'code': 'BIO 101',
      'title': 'Cell Biology',
      'lecturer': 'Prof. Peter Mwangi',
    },
    {
      'code': 'COM 101',
      'title': 'Computer Programming',
      'lecturer': 'Mr. David Njoroge',
    },
    {
      'code': 'UCU 110',
      'title': 'Communication and Collaboration Skills',
      'lecturer': 'Ms. Lucy Wanjiku',
    },
    {
      'code': 'PHY 201',
      'title': 'Thermodynamics',
      'lecturer': 'Dr. Isaac Kimani',
    },
  ];

  // Store answers: {courseCode: {questionIndex: rating}}
  final Map<String, Map<int, int>> _answers = {};

  bool _requestSent = false;

  // -----------------------------------------------------------------------
  // Helper: Is a course fully evaluated?
  // -----------------------------------------------------------------------
  bool _isCourseCompleted(String code) {
    final answers = _answers[code];
    return answers != null && answers.length == 4;
  }

  // Helper: Are ALL courses completed?
  bool get _allDone => _courses.every((c) => _isCourseCompleted(c['code']));

  // -----------------------------------------------------------------------
  // UI: Empty state
  // -----------------------------------------------------------------------
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.assignment_turned_in, size: 80, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No Pending Evaluations',
            style: GoogleFonts.roboto(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------------
  // UI: One course card (expandable)
  // -----------------------------------------------------------------------
  Widget _buildCourseCard(Map<String, dynamic> course) {
    final code = course['code'] as String;
    final isCompleted = _isCourseCompleted(code);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      elevation: 2,
      child: ExpansionTile(
        leading: Icon(
          isCompleted ? Icons.check_circle : Icons.pending,
          color: isCompleted ? Colors.green : Colors.orange,
        ),
        title: Text(
          '${course['code']} – ${course['title']}',
          style: GoogleFonts.roboto(fontWeight: FontWeight.w600),
        ),
        subtitle: Text('Lecturer: ${course['lecturer']}'),
        children: isCompleted
            ? [
                const ListTile(
                  leading: Icon(Icons.done_all, color: Colors.green),
                  title: Text('Evaluation completed!'),
                ),
              ]
            : _buildQuestions(code),
      ),
    );
  }

  // -----------------------------------------------------------------------
  // UI: 4 Star Rating Questions
  // -----------------------------------------------------------------------
  List<Widget> _buildQuestions(String code) {
    const questions = [
      "How would you rate the lecturer's presentation skills?",
      "Was the course content well organized?",
      "How available was the lecturer for consultation?",
      "Overall rating of the teaching effectiveness",
    ];

    return List.generate(4, (qIdx) {
      final currentRating = _answers[code]?[qIdx] ?? 0;

      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              questions[qIdx],
              style: GoogleFonts.roboto(fontSize: 15),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: List.generate(5, (starIndex) {
                final star = starIndex + 1;
                return IconButton(
                  icon: Icon(
                    star <= currentRating ? Icons.star : Icons.star_border,
                    color: Colors.amber,
                    size: 28,
                  ),
                  onPressed: () {
                    setState(() {
                      // Initialize map if not exists
                      _answers.putIfAbsent(code, () => {});
                      _answers[code]![qIdx] = star;
                    });
                  },
                );
              }),
            ),
          ],
        ),
      );
    });
  }

  // -----------------------------------------------------------------------
  // UI: Request Exam Card Button
  // -----------------------------------------------------------------------
  Widget _buildRequestButton() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: ElevatedButton.icon(
          icon: const Icon(Icons.send, size: 28),
          label: Text(
            _requestSent ? 'Request Sent!' : 'Request Exam Card',
            style: const TextStyle(fontSize: 18),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: _requestSent ? Colors.green : const Color(0xFF0033A0),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
         onPressed: () {
  MockDatabase.instance.completeAllEvaluations(currentLoggedInStudentId);
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(
      content: Text('All 8 evaluations completed! Exam card request sent to admin.'),
      backgroundColor: Colors.green,
    ),
  );
},
        ),
      ),
    );
  }

  // -----------------------------------------------------------------------
  // Main Build
  // -----------------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: const Color(0xFF0033A0),
        title: Text(
          'Lecturer Evaluation',
          style: GoogleFonts.roboto(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _courses.isEmpty
          ? _buildEmptyState()
          : Column(
              children: [
                // Header message
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    _allDone
                        ? 'All evaluations completed! Request your exam card below.'
                        : 'Complete all evaluations to unlock exam card request.',
                    style: GoogleFonts.roboto(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: _allDone ? Colors.green[700] : Colors.orange[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                // Course list
                Expanded(
                  child: ListView.builder(
                    itemCount: _courses.length,
                    itemBuilder: (ctx, i) => _buildCourseCard(_courses[i]),
                  ),
                ),
                // Request button
                if (_allDone) _buildRequestButton(),
              ],
            ),
    );
  }
}