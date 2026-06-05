class ChatRequest {
  final String message;
  ChatRequest({required this.message});

  Map<String, dynamic> toJson() => {'message': message};
}

class ChatResponse {
  final String response;
  ChatResponse({required this.response});

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(response: json['response']);
  }
}
