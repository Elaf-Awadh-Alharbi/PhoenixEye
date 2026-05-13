import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Shows the current citizen's submitted reports and their latest statuses.
class MyReportsScreen extends StatefulWidget {
  final String userId;

  const MyReportsScreen({
    super.key,
    required this.userId,
  });

  @override
  State<MyReportsScreen> createState() => _MyReportsScreenState();
}

class _MyReportsScreenState extends State<MyReportsScreen> {
  static const String baseUrl = 'http://10.0.2.2:5001';

  bool _isLoading = true;
  List reports = [];

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  // Loads reports for the current user id from the backend.
  Future<void> _loadReports() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/my-reports/${widget.userId}'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        setState(() {
          reports = data['reports'] ?? [];
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Maps report status values to colors for the mobile status label.
  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'VERIFIED':
        return Colors.green;
      case 'PENDING':
        return Colors.orange;
      case 'REJECTED':
        return Colors.red;
      default:
        return Colors.blueGrey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Reports'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : reports.isEmpty
          ? const Center(
        child: Text('No reports submitted yet'),
      )
          : ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: reports.length,
        itemBuilder: (context, index) {
          final report = reports[index];
          final status = (report['status'] ?? 'PENDING').toString();

          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (report['image_url'] != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        report['image_url'],
                        height: 180,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                  const SizedBox(height: 12),
                  Text(
                    'Status: $status',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: _statusColor(status),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Latitude: ${report['latitude']}'),
                  Text('Longitude: ${report['longitude']}'),
                  const SizedBox(height: 8),
                  Text(
                    'Created at: ${report['created_at'] ?? 'N/A'}',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
