// lib/screens/admin_dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/mock_database.dart';
import 'login_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});
  @override State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  late final db = MockDatabase.instance;

  @override
  Widget build(BuildContext context) {
    final pendingCount = db.students.where((s) => s['hasRequested'] && !s['approved']).length;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0033A0),
        title: const Text('Admin – Exam Card Requests', style: TextStyle(color: Colors.white)),
        leading: const BackButton(color: Colors.white),
        actions: [
          Chip(label: Text('$pendingCount Pending', style: const TextStyle(color: Colors.white)), backgroundColor: pendingCount > 0 ? Colors.red : Colors.green),
          IconButton(icon: const Icon(Icons.logout, color: Colors.white), onPressed: () => Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (_) => false)),
        ],
      ),
      body: ListView.builder(
        itemCount: db.students.length,
        itemBuilder: (context, i) {
          final s = db.students[i];
          final isComplete = s['completedCount'] == 8;
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: ListTile(
              leading: CircleAvatar(backgroundColor: isComplete ? Colors.green : Colors.orange, child: Text(s['name'][0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
              title: Text(s['name'], style: GoogleFonts.roboto(fontWeight: FontWeight.w600)),
              subtitle: Text('${s['regNo']} • ${s['completedCount']}/8 evaluations'),
              trailing: isComplete
                  ? (s['approved']
                      ? const Chip(label: Text('APPROVED'), backgroundColor: Colors.green)
                      : ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                          onPressed: () {
                            db.approveRequest(s['id']);
                            setState(() {});
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Approved: ${s['name']}')));
                          },
                          child: const Text('APPROVE'),
                        ))
                  : const Text('In Progress', style: TextStyle(color: Colors.grey)),
            ),
          );
        },
      ),
    );
  }
}