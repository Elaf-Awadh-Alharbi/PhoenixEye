import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'registration_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;

  const ResetPasswordScreen({super.key, required this.email});

  @override
  State<ResetPasswordScreen> createState() =>
      _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  static const String baseUrl = 'http://10.0.2.2:5001';

  final TextEditingController _codeCtrl = TextEditingController();
  final TextEditingController _passwordCtrl = TextEditingController();

  bool _isLoading = false;

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _resetPassword() async {
    final code = _codeCtrl.text.trim();
    final password = _passwordCtrl.text.trim();

    if (code.length != 6) {
      _showSnack('Enter valid 6-digit code');
      return;
    }

    if (password.length < 6) {
      _showSnack('Password must be at least 6 characters');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': widget.email,
          'code': code,
          'newPassword': password,
        }),
      );

      if (response.statusCode == 200) {
        _showSnack('Password reset successful');

        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (_) =>
            const RegistrationScreen(startInLoginMode: true),
          ),
              (route) => false,
        );
      } else {
        _showSnack('Invalid or expired code');
      }
    } catch (e) {
      _showSnack('Connection error');
    }

    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _codeCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text('Code sent to ${widget.email}'),
            const SizedBox(height: 20),

            TextField(
              controller: _codeCtrl,
              keyboardType: TextInputType.number,
              decoration:
              const InputDecoration(labelText: 'Verification Code'),
            ),

            const SizedBox(height: 12),

            TextField(
              controller: _passwordCtrl,
              obscureText: true,
              decoration:
              const InputDecoration(labelText: 'New Password'),
            ),

            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: _isLoading ? null : _resetPassword,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Reset Password'),
            ),
          ],
        ),
      ),
    );
  }
}