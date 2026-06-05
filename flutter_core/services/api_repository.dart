import '../models/chat_model.dart';
import 'api_service.dart';

class ApiRepository {
  final ApiService _apiService;

  ApiRepository(this._apiService);

  Future<ChatResponse> sendMessage(String token, String message) async {
    try {
      final response = await _apiService.sendPrompt(token, message);
      return ChatResponse.fromJson(response.data);
    } catch (e) {
      // Log error internally and rethrow/handle accordingly
      throw Exception('Failed to send prompt: $e');
    }
  }
}
