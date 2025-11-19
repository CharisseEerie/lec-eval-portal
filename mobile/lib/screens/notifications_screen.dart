// 5. notifications_screen.dart
import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications'), backgroundColor: const Color(0xFF0033A0), foregroundColor: Colors.white, leading: const BackButton()),
      body: const Center(child: Text('No new notifications', style: TextStyle(fontSize: 20))),
    );
  }
}