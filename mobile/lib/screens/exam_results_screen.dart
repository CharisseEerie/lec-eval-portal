// 3. exam_results_screen.dart
import 'package:flutter/material.dart';

class ExamResultsScreen extends StatelessWidget {
  const ExamResultsScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Exam Results'), backgroundColor: const Color(0xFF0033A0), foregroundColor: Colors.white, leading: const BackButton()),
      body: const Center(child: Text('Results will be released after exams', style: TextStyle(fontSize: 20))),
    );
  }
}