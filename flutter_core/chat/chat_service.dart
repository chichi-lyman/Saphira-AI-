import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../speech/tts_service.dart';

class ChatMessage {
  final String id;
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

class ChatService {
  final List<ChatMessage> _messages = [];
  final StreamController<List<ChatMessage>> _controller = StreamController<List<ChatMessage>>.broadcast();
  
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  StreamSubscription<QuerySnapshot>? _messagesSubscription;

  ChatService() {
    _initializeChat();
  }

  String get _sessionId {
    final uid = _auth.currentUser?.uid ?? 'guest';
    final safeUid = uid.replaceAll(RegExp(r'[^a-zA-Z0-9_\-]'), '');
    return 'flutter_session_$safeUid';
  }

  Future<void> _initializeChat() async {
    final user = _auth.currentUser;
    if (user == null) {
      // Offline / guest mode fallback
      _controller.add(List.from(_messages));
      return;
    }

    final sessionId = _sessionId;
    try {
      // Create session document if it doesn't exist to abide by strict relationship security rules
      final sessionRef = _firestore.collection('sessions').doc(sessionId);
      final sessionSnapshot = await sessionRef.get();
      
      if (!sessionSnapshot.exists) {
        await sessionRef.set({
          'id': sessionId,
          'ownerId': user.uid,
          'title': 'Saphira Flutter Chat',
          'updatedAt': DateTime.now().millisecondsSinceEpoch,
        });
      }

      // Listen to messages subcollection for real-time updates
      _messagesSubscription = _firestore
          .collection('sessions')
          .doc(sessionId)
          .collection('messages')
          .orderBy('timestamp', descending: false)
          .snapshots()
          .listen((snapshot) {
            _messages.clear();
            for (var doc in snapshot.docs) {
              final data = doc.data();
              _messages.add(ChatMessage(
                id: doc.id,
                text: data['content'] ?? '',
                isUser: data['role'] == 'user',
                timestamp: DateTime.fromMillisecondsSinceEpoch(data['timestamp'] ?? DateTime.now().millisecondsSinceEpoch),
              ));
            }
            _controller.add(List.from(_messages));
          }, onError: (err) {
            print("Error streaming messages from Firestore: $err");
            // Fallback to in-memory state on error
            _controller.add(List.from(_messages));
          });
    } catch (e) {
      print("Error initializing chat with Firestore: $e");
      _controller.add(List.from(_messages));
    }
  }

  Stream<List<ChatMessage>> get messagesStream => _controller.stream;

  Future<void> sendMessage(String text) async {
    if (text.isEmpty) return;

    final user = _auth.currentUser;
    final timestamp = DateTime.now();
    final messageId = 'msg_${timestamp.millisecondsSinceEpoch}';

    if (user != null) {
      final sessionId = _sessionId;
      try {
        // Enforce parent-session relationship sync
        final sessionRef = _firestore.collection('sessions').doc(sessionId);
        await sessionRef.update({
          'updatedAt': timestamp.millisecondsSinceEpoch,
        }).catchError((_) async {
          // If update failed (e.g. somehow missing), recreate it
          await sessionRef.set({
            'id': sessionId,
            'ownerId': user.uid,
            'title': 'Saphira Flutter Chat',
            'updatedAt': timestamp.millisecondsSinceEpoch,
          });
        });

        // Save visitor's/user's prompt
        await _firestore
            .collection('sessions')
            .doc(sessionId)
            .collection('messages')
            .doc(messageId)
            .set({
              'id': messageId,
              'role': 'user',
              'content': text,
              'timestamp': timestamp.millisecondsSinceEpoch,
              'image': '',
              'audioUrl': '',
              'generatedImage': '',
            });
      } catch (e) {
        print("Error saving user message to Firestore: $e");
      }
    } else {
      // Local fallback in case user is not logged in / offline
      _messages.add(ChatMessage(
        id: messageId,
        text: text,
        isUser: true,
        timestamp: timestamp,
      ));
      _controller.add(List.from(_messages));
    }

    // Simulate Saphira AI processing lag and response
    Future.delayed(const Duration(milliseconds: 1500), () async {
      final response = "I have synthesized your directive regarding '$text'. Variables have been aligned securely.";
      final respTimestamp = DateTime.now();
      final respMessageId = 'msg_${respTimestamp.millisecondsSinceEpoch}';

      if (user != null) {
        final sessionId = _sessionId;
        try {
          await _firestore
              .collection('sessions')
              .doc(sessionId)
              .collection('messages')
              .doc(respMessageId)
              .set({
                'id': respMessageId,
                'role': 'model',
                'content': response,
                'timestamp': respTimestamp.millisecondsSinceEpoch,
                'image': '',
                'audioUrl': '',
                'generatedImage': '',
              });
        } catch (e) {
          print("Error saving AI response to Firestore: $e");
        }
      } else {
        // Local fallback
        _messages.add(ChatMessage(
          id: respMessageId,
          text: response,
          isUser: false,
          timestamp: respTimestamp,
        ));
        _controller.add(List.from(_messages));
      }
      
      // Execute text-to-speech
      TTSService().speak(response);
    });
  }

  Future<void> clearHistory() async {
    final user = _auth.currentUser;
    if (user != null) {
      final sessionId = _sessionId;
      try {
        final messagesCollection = _firestore
            .collection('sessions')
            .doc(sessionId)
            .collection('messages');
            
        final snapshot = await messagesCollection.get();
        final batch = _firestore.batch();
        for (var doc in snapshot.docs) {
          batch.delete(doc.reference);
        }
        await batch.commit();
      } catch (e) {
        print("Error purging session history from Firestore: $e");
      }
    }
    
    _messages.clear();
    _controller.add(List.from(_messages));
  }
  
  void dispose() {
    _messagesSubscription?.cancel();
    _controller.close();
  }
}
