// 2. fee_balance_screen.dart
import 'package:flutter/material.dart';

class FeeBalanceScreen extends StatelessWidget {
  const FeeBalanceScreen({super.key});
  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fee Balance'), backgroundColor: const Color(0xFF0033A0), foregroundColor: Colors.white, leading: const BackButton()),
      body: const Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.payment, size: 90, color: Colors.green),
          SizedBox(height: 20),
          Text('KES 0.00', style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.green)),
          Text('Fully Paid', style: TextStyle(fontSize: 24)),
        ]),
      ),
    );
  }
}