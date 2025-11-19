// 6. profile_screen.dart
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Profile'), backgroundColor: const Color(0xFF0033A0), foregroundColor: Colors.white, leading: const BackButton()),
      body: const Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          CircleAvatar(radius: 70, backgroundColor: Color(0xFF0033A0), child: Icon(Icons.person, size: 80, color: Colors.white)),
          SizedBox(height: 20),
          Text('Charissa Sarah A.', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          Text('I21/6574/2021', style: TextStyle(fontSize: 20)),
          Text('B.Sc. Physics', style: TextStyle(fontSize: 18)),
        ]),
      ),
    );
  }
}