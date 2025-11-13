// mobile/test/widget_test.dart
// ignore: unused_import
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ku_eval_mobile/main.dart' show MyApp; // Adjust the import according to your project structure

void main() {
  testWidgets('App starts and shows login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('KENYATTA UNIVERSITY'), findsOneWidget);
    expect(find.text('Portal Login'), findsOneWidget);
  });
}