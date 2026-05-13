import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'registration_screen.dart';

// Displays the citizen account profile and logout action.
class AccountScreen extends StatefulWidget {
  final String userId;

  const AccountScreen({
    super.key,
    required this.userId,
  });

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  static const String baseUrl = 'http://10.0.2.2:5001';

  bool _isLoading = true;
  Map<String, dynamic>? citizen;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  // Loads the citizen profile for the current user id from the backend.
  Future<void> _loadProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/citizen/${widget.userId}'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          citizen = data['citizen'];
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  // Clears the navigation stack and returns the user to login mode.
  void _logout() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => const RegistrationScreen(startInLoginMode: true),
      ),
          (route) => false,
    );
  }

  Widget _infoTile(IconData icon, String title, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white12),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF93C5FD)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final fullName = citizen == null
        ? ''
        : '${citizen!['first_name'] ?? ''} ${citizen!['last_name'] ?? ''}';

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'assets/images/bg.png',
              fit: BoxFit.cover,
            ),
          ),
          Positioned.fill(
            child: Container(color: Colors.black.withOpacity(0.65)),
          ),
          SafeArea(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 12,
                ),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: const Color(0xFF071A2B).withOpacity(0.92),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFF1D4ED8).withOpacity(0.35),
                      ),
                    ),
                    child: citizen == null
                        ? const Center(
                      child: Text('Could not load account'),
                    )
                        : Column(
                      crossAxisAlignment:
                      CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: [
                            IconButton(
                              onPressed: () =>
                                  Navigator.pop(context),
                              icon: const Icon(Icons.arrow_back),
                            ),
                            const Expanded(
                              child: Text(
                                'Account',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            const SizedBox(width: 48),
                          ],
                        ),
                        const SizedBox(height: 18),
                        const CircleAvatar(
                          radius: 42,
                          backgroundColor: Color(0xFF1D4ED8),
                          child: Icon(
                            Icons.person,
                            size: 48,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          fullName,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          citizen!['email'] ?? '',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white70,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _infoTile(
                          Icons.badge_outlined,
                          'First Name',
                          citizen!['first_name'] ?? 'N/A',
                        ),
                        _infoTile(
                          Icons.badge,
                          'Last Name',
                          citizen!['last_name'] ?? 'N/A',
                        ),
                        _infoTile(
                          Icons.email_outlined,
                          'Email',
                          citizen!['email'] ?? 'N/A',
                        ),
                        _infoTile(
                          Icons.verified_user_outlined,
                          'Email Status',
                          citizen!['is_verified'] == true
                              ? 'Verified'
                              : 'Not Verified',
                        ),
                        const SizedBox(height: 18),
                        FilledButton.icon(
                          onPressed: _logout,
                          icon: const Icon(Icons.logout),
                          label: const Padding(
                            padding:
                            EdgeInsets.symmetric(vertical: 12),
                            child: Text('Logout'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
