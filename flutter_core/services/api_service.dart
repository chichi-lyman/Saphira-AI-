import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio;

  ApiService()
      : _dio = Dio(
          BaseOptions(
            baseUrl: 'https://ais-dev-ch4sesfr2ctyvgj3rn5am4-82941590205.us-west2.run.app',
            connectTimeout: const Duration(seconds: 10),
            receiveTimeout: const Duration(seconds: 10),
          ),
        );

  Future<Response> sendPrompt(String token, String message) async {
    return await _dio.post(
      '/v1/chat',
      data: {'message': message},
      options: Options(
        headers: {'Authorization': 'Bearer $token'},
      ),
    );
  }
}
