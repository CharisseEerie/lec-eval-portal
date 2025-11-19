import 'package:ku_eval_mobile/screens/academic_calendar_screen.dart';
import 'package:ku_eval_mobile/screens/exam_results_screen.dart';
import 'package:ku_eval_mobile/screens/fee_balance_screen.dart' show FeeBalanceScreen;
import 'package:ku_eval_mobile/screens/login_screen.dart';
import 'package:ku_eval_mobile/screens/profile_screen.dart' show ProfileScreen;
import 'package:ku_eval_mobile/screens/registered_units_screen.dart';

import 'evaluation_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HomeScreen extends StatelessWidget {
  final String studentName;
  final String regNo;

  const HomeScreen({
    super.key,
    required this.studentName,
    required this.regNo,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar:AppBar(
  backgroundColor: const Color(0xFF0033A0),
  title: Text(
    'Welcome, $studentName',
    style: GoogleFonts.roboto(fontWeight: FontWeight.bold, color: Colors.white),
  ),
  actions: [
    IconButton(
      icon: const Icon(Icons.logout, color: Colors.white),
      onPressed: () {
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(builder: (_) => const LoginScreen()), // ← Remove 'const' here
    (route) => false,
  );
},
      tooltip: 'Logout',
    ),
  ],
),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0033A0),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Icon(
                        Icons.person,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome,',
                            style: GoogleFonts.roboto(
                              color: Colors.grey[600],
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            studentName,
                            style: GoogleFonts.roboto(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: const Color(0xFF0033A0),
                            ),
                          ),
                          Text(
                            regNo,
                            style: GoogleFonts.roboto(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Quick Actions Grid
            Text(
              'Quick Actions',
              style: GoogleFonts.roboto(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: const Color(0xFF0033A0),
              ),
            ),
            const SizedBox(height: 16),
GridView.count(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  crossAxisCount: 2,
  crossAxisSpacing: 16,
  mainAxisSpacing: 16,
  children: [
    _buildGridItem(
      icon: Icons.school,
      title: 'Academics',
      color: Colors.blue,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AcademicCalendarScreen()),
        );
      },
    ),
    _buildGridItem(
      icon: Icons.library_books,
      title: 'Courses',
      color: Colors.green,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const RegisteredUnitsScreen()),
        );
      },
    ),
    _buildGridItem(
      icon: Icons.rate_review,
      title: 'Lecturer Evaluation',
      color: Colors.orange,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => EvaluationScreen(
              studentName: studentName,
              regNo: regNo,
            ),
          ),
        );
      },
    ),
    _buildGridItem(
      icon: Icons.assignment,
      title: 'Exam Cards',
      color: Colors.purple,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ExamResultsScreen()),
        );
      },
    ),
    _buildGridItem(
      icon: Icons.payment,
      title: 'Fee Statement',
      color: Colors.red,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const FeeBalanceScreen()),
        );
      },
    ),
    _buildGridItem(
      icon: Icons.person,
      title: 'Profile',
      color: Colors.teal,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ProfileScreen()),
        );
      },
    ),
  ],
),

            const SizedBox(height: 24),

            // Notifications Section
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Notifications',
                      style: GoogleFonts.roboto(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: const Color(0xFF0033A0),
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildNotificationItem('Lecturer evaluations are open', Icons.info, Colors.blue),
                    _buildNotificationItem('Exam timetable available', Icons.event, Colors.green),
                    _buildNotificationItem('Fee payment deadline', Icons.payment, Colors.orange),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridItem({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: GoogleFonts.roboto(
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationItem(String text, IconData icon, Color color) {
    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(
        text,
        style: GoogleFonts.roboto(fontSize: 14),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: () {
        // Notification tap (future feature)
      },
    );
  }
}