import 'dart:io';
import 'package:http/http.dart' as http;

// Handles mobile API calls from the Flutter app to the PhoenixEye backend.
class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5001';

  // Submits a citizen report with user id, animal data, image file, and optional location fields.
  static Future<bool> submitReport({
    required String citizenId,
    required String animalType,
    String? otherAnimalType,
    required File imageFile,
    double? latitude,
    double? longitude,
    String? manualLocation,
    required String locationMode,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/report');
      final request = http.MultipartRequest('POST', uri);

      request.fields['citizen_id'] = citizenId;
      request.fields['animal_type'] = animalType;
      request.fields['other_animal_type'] = otherAnimalType ?? '';
      request.fields['latitude'] = latitude?.toString() ?? '';
      request.fields['longitude'] = longitude?.toString() ?? '';
      request.fields['manual_location'] = manualLocation ?? '';
      request.fields['location_mode'] = locationMode;
      request.fields['source'] = 'CITIZEN';

      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );

      final response = await request.send();
      final body = await response.stream.bytesToString();

      print('submitReport status: ${response.statusCode}');
      print('submitReport body: $body');

      return response.statusCode == 201;
    } catch (e) {
      print('submitReport error: $e');
      return false;
    }
  }
}
