// mobile/lib/screens/login_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'home_screen.dart';
import 'admin_dashboard_screen.dart';

String currentLoggedInStudentId = '1'; // default to Charissa

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _regNoController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String _errorMessage = '';
  bool _isStudent = true;

  // Mock credentials
  final Map<String, String> _studentCredentials = {
  'I21/6574/2021@students.ku.ac.ke': 'password123',  // Charissa
  'K22/8901/2022@students.ku.ac.ke': 'password123',  // Kelvin
  'F21/3456/2021@students.ku.ac.ke': 'password123',  // Fatuma
};

  final String _adminId = 'admin123';
  final String _adminPass = 'admin123';

  void _login() async {
    final input = _regNoController.text.trim();
    final password = _passwordController.text;

    if (input.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Please fill in all fields');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    await Future.delayed(const Duration(seconds: 1));

    bool success = false;
    String? studentName;

    if (_isStudent) {
      if (!_studentCredentials.containsKey(input)) {
        _errorMessage = 'Invalid student email';
      } else if (_studentCredentials[input] != password) {
        _errorMessage = 'Wrong password';
      } else {
        success = true;
        studentName = _getNameFromRegNo(input);
      }
    } else {
      if (input == _adminId && password == _adminPass) {
        success = true;
      } else {
        _errorMessage = 'Invalid admin credentials';
      }
    }

    setState(() => _isLoading = false);
    if (!success) return;

 if (_isStudent && studentName != null) {
  if (!mounted) return;

  // Set student ID for mock database
  String studentId = '1';
  if (input == 'I21/6574/2021@students.ku.ac.ke') {
    studentId = '1'; // Charissa
  } else if (input == 'K22/8901/2022@students.ku.ac.ke') {
    studentId = '2'; // Kelvin
  } else if (input == 'F21/3456/2021@students.ku.ac.ke') {
    studentId = '3'; // Fatuma
  }

  currentLoggedInStudentId = studentId;

  Navigator.of(context).pushReplacement(
    MaterialPageRoute(
      builder: (_) => HomeScreen(
        studentName: studentName!, // Now safe — we checked null above
        regNo: input.split('@').first,
      ),
    ),
  );
} else {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const AdminDashboardScreen()),
      );
    }
  }

 String _getNameFromRegNo(String email) {
  final map = {
    'I21/6574/2021@students.ku.ac.ke': 'Charissa Sarah A.',
    'K22/8901/2022@students.ku.ac.ke': 'Kelvin Omondi',
    'F21/3456/2021@students.ku.ac.ke': 'Fatuma Ali',
  };
  return map[email] ?? 'Student';
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              Container(
  width: 100,
  height: 100,
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(12),
    image: const DecorationImage(
      image: AssetImage('assets/images/ku_logo.png'),
      fit: BoxFit.contain,
    ),
  ),
),
              const SizedBox(height: 16),
              Text(
                'KENYATTA UNIVERSITY',
                style: GoogleFonts.roboto(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF0033A0),
                ),
              ),
              Text(
                'Portal Login',
                style: GoogleFonts.roboto(fontSize: 16, color: Colors.grey[700]),
              ),
              const SizedBox(height: 32),
              ToggleButtons(
                isSelected: [_isStudent, !_isStudent],
                onPressed: (index) {
                  setState(() {
                    _isStudent = index == 0;
                    _regNoController.clear();
                    _passwordController.clear();
                    _errorMessage = '';
                  });
                },
                borderRadius: BorderRadius.circular(12),
                selectedColor: Colors.white,
                selectedBorderColor: const Color(0xFF0033A0),
                fillColor: const Color(0xFF0033A0),
                children: const [
                  Padding(padding: EdgeInsets.symmetric(horizontal: 32), child: Text('Student')),
                  Padding(padding: EdgeInsets.symmetric(horizontal: 32), child: Text('Admin')),
                ],
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Column(
                  children: [
                    Text(
                      _isStudent ? 'Student Sign In' : 'Admin Sign In',
                      style: GoogleFonts.roboto(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0033A0),
                      ),
                    ),
                    const SizedBox(height: 24),
                    if (_errorMessage.isNotEmpty) ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red),
                        ),
                        child: Text(_errorMessage, style: const TextStyle(color: Colors.red)),
                      ),
                      const SizedBox(height: 16),
                    ],
                    TextField(
                      controller: _regNoController,
                      decoration: InputDecoration(
                        labelText: _isStudent ? 'Student Email' : 'Admin ID',
                        prefixIcon: const Icon(Icons.person),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        hintText: _isStudent
                            ? 'e.g., I21/6574/2021@students.ku.ac.ke'
                            : 'Enter admin ID',
                      ),
                      keyboardType: _isStudent ? TextInputType.emailAddress : TextInputType.text,
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        hintText: 'Enter password',
                      ),
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        _isStudent ? 'Default: password123' : 'Default: admin123',
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0033A0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                ),
                              )
                            : Text(
                                'LOGIN',
                                style: GoogleFonts.roboto(
                                    fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                              ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Demo Credentials:',
                            style: GoogleFonts.roboto(
                                fontWeight: FontWeight.bold, color: const Color(0xFF0033A0)),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _isStudent
                                ? 'Email: I21/6574/2021@students.ku.ac.ke\nPassword: password123'
                                : 'ID: admin123\nPassword: admin123',
                            style: TextStyle(color: Colors.grey[700], fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _regNoController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}