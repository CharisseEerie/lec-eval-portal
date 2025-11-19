// 1. academic_calendar_screen.dart
import 'package:flutter/material.dart';

class AcademicCalendarScreen extends StatelessWidget {
  const AcademicCalendarScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Academic Calendar'),
        backgroundColor: const Color(0xFF0033A0),
        foregroundColor: Colors.white,
        leading: const BackButton(), // ← BACK BUTTON
      ),
      body: const Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.calendar_today, size: 90, color: Color(0xFF0033A0)),
          SizedBox(height: 20),
          Text('2025/2026 Academic Year', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text('Semester 1: Jan – Apr 2026'),
          Text('Semester 2: May – Aug 2026'),
        ]),
      ),
    );
  }
}