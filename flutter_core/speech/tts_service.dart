import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter/foundation.dart';

class TTSService {
  static final TTSService _instance = TTSService._internal();
  factory TTSService() => _instance;
  TTSService._internal();

  final FlutterTts _flutterTts = FlutterTts();
  
  List<dynamic> _voices = [];
  List<dynamic> _languages = [];
  
  String? _selectedLanguage;
  Map<String, String>? _selectedVoice; // flutter_tts gives voices as maps {name, locale} usually
  double _speechRate = 0.5;

  Future<void> initialize() async {
    try {
      if (kIsWeb) {
        // web may not support all getVoices immediately or at all perfectly
      }
      
      _languages = await _flutterTts.getLanguages;
      var voicesData = await _flutterTts.getVoices;
      if (voicesData is List) {
        _voices = voicesData;
      }
      
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setSpeechRate(_speechRate);
      await _flutterTts.setPitch(1.0);
      
      // Attempt to find English as default
      if (_languages.contains("en-US")) {
        _selectedLanguage = "en-US";
        await _flutterTts.setLanguage("en-US");
      }
    } catch (e) {
      print("TTS Error: $e");
    }
  }

  Future<void> speak(String text) async {
    if (text.isNotEmpty) {
      await _flutterTts.speak(text);
    }
  }

  Future<void> stop() async {
    await _flutterTts.stop();
  }
  
  List<dynamic> getLanguages() => _languages;
  List<dynamic> getVoices() => _voices;
  
  List<dynamic> getVoicesForLanguage(String? lang) {
    if (lang == null) return _voices;
    return _voices.where((v) {
      if (v is Map) {
        return v['locale'] == lang;
      }
      return false;
    }).toList();
  }
  
  String? get currentLanguage => _selectedLanguage;
  String? get currentVoiceName => _selectedVoice?['name'];
  double get currentSpeechRate => _speechRate;
  
  Future<void> setSpeechRate(double rate) async {
    _speechRate = rate;
    await _flutterTts.setSpeechRate(rate);
  }
  
  Future<void> setLanguage(String lang) async {
    _selectedLanguage = lang;
    await _flutterTts.setLanguage(lang);
    
    // Automatically select the first available voice for this language
    var availableVoices = getVoicesForLanguage(lang);
    if (availableVoices.isNotEmpty) {
      var voice = availableVoices.first;
      if (voice is Map) {
        await setVoice({"name": voice["name"].toString(), "locale": voice["locale"].toString()});
      }
    }
  }
  
  Future<void> setVoice(Map<String, String> voice) async {
    _selectedVoice = voice;
    await _flutterTts.setVoice(voice);
  }
}
