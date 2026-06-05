import 'package:speech_to_text/speech_to_text.dart' as stt;

class SpeechService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  final Function(String) onWakeWordDetected;
  final Function(String) onCommandRecognized;

  SpeechService({
    required this.onWakeWordDetected, 
    required this.onCommandRecognized
  });

  Future<void> initialize() async {
    bool available = await _speech.initialize(
      onStatus: (val) => print('Neural Audio status: $val'),
      onError: (val) => print('Neural Audio error: $val'),
    );
    if (available) {
      _startContinuousListening();
    } else {
      print("Speech recognition not available.");
    }
  }

  void _startContinuousListening() {
    if (!_isListening) {
      _speech.listen(
        onResult: (val) {
          String text = val.recognizedWords.toLowerCase();
          
          if (text.contains("okay saphira")) {
            onWakeWordDetected("Wake word acknowledged. I am present.");
            
            // Extract the command following the wake word
            List<String> parts = text.split("okay saphira");
            if (parts.length > 1) {
              String command = parts.last.trim();
              if (command.isNotEmpty) {
                onCommandRecognized(command);
                // Restart listening to clear cache after command execution
                _restartListening();
              }
            }
          }
        },
        cancelOnError: false,
        partialResults: true,
        listenMode: stt.ListenMode.dictation,
      );
      _isListening = true;
    }
  }

  void _restartListening() async {
    _speech.stop();
    _isListening = false;
    await Future.delayed(const Duration(milliseconds: 500));
    _startContinuousListening();
  }

  void stopListening() {
    _speech.stop();
    _isListening = false;
  }
}
