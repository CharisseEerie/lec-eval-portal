// 4. registered_units_screen.dart
import 'package:flutter/material.dart';

class RegisteredUnitsScreen extends StatelessWidget {
  const RegisteredUnitsScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registered Units'), backgroundColor: const Color(0xFF0033A0), foregroundColor: Colors.white, leading: const BackButton()),
      body: const Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.book, size: 80, color: Color(0xFF0033A0)),
          SizedBox(height: 20),
          Text('8 Units Registered', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text('All lecturer evaluations required'),
        ]),
      ),
    );
  }
}