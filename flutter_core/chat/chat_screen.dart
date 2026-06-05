import 'package:flutter/material.dart';
import 'chat_service.dart';
import '../speech/speech_service.dart';
import '../bluetooth/bluetooth_service.dart';
import '../components/neural_sync_visualizer.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ChatService _chatService = ChatService();
  late SpeechService _speechService;
  final BluetoothService _bluetoothService = BluetoothService();
  
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isWakeWordActive = false;

  @override
  void initState() {
    super.initState();
    
    // Automatically trigger Bluetooth scanning for smart devices
    _bluetoothService.startScanningAndAutoConnect();

    // Initialize Always-Listening Wake Word Service
    _speechService = SpeechService(
      onWakeWordDetected: (msg) {
        setState(() => _isWakeWordActive = true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(msg, style: const TextStyle(fontWeight: FontWeight.bold)), 
            backgroundColor: Colors.pinkAccent,
            duration: const Duration(seconds: 2),
          )
        );
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) setState(() => _isWakeWordActive = false);
        });
      },
      onCommandRecognized: (command) {
        _handleSubmitted(command);
      }
    );
    _speechService.initialize();
  }

  @override
  void dispose() {
    _chatService.dispose();
    _speechService.stopListening();
    _bluetoothService.dispose();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _handleSubmitted(String text) {
    if (text.trim().isEmpty) return;
    _chatService.sendMessage(text.trim());
    _textController.clear();
    
    // Smooth scroll to bottom
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOutCubic,
        );
      }
    });
  }

  String _formatTime(DateTime time) {
    return "${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}";
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('SAPHIRA', 
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 2.0)
            ),
            Row(
              children: [
                Container(
                  width: 6, height: 6, 
                  decoration: BoxDecoration(color: _isWakeWordActive ? Colors.pinkAccent : Colors.indigoAccent, shape: BoxShape.circle),
                  margin: const EdgeInsets.only(right: 4),
                ),
                Text('Real-time Link Active', style: TextStyle(fontSize: 10, color: Colors.indigoAccent.shade200)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.memory, color: Colors.indigoAccent, size: 20),
            tooltip: 'Trigger Neural Sync',
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  content: SizedBox(
                    width: 200,
                    height: 200,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        const NeuralSyncVisualizer(),
                        const Text("SYNCHRONIZING\nNEURAL MESH", textAlign: TextAlign.center, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 2.0)),
                      ],
                    ),
                  ),
                )
              );
              Future.delayed(const Duration(seconds: 3), () {
                if (Navigator.canPop(context)) Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Neural Sync Complete.'), 
                    backgroundColor: Colors.indigoAccent,
                    duration: Duration(seconds: 2),
                  )
                );
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
            tooltip: 'Purge Neural Cache',
            onPressed: () {
              _chatService.clearHistory();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cognitive cache purged.'), backgroundColor: Colors.redAccent)
              );
            },
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<List<ChatMessage>>(
              stream: _chatService.messagesStream,
              initialData: const [],
              builder: (context, snapshot) {
                final messages = snapshot.data ?? [];
                if (messages.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.center_focus_weak, size: 48, color: Colors.indigoAccent.withOpacity(0.3)),
                        const SizedBox(height: 16),
                        Text("Awaiting strategic directive.", 
                          style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontStyle: FontStyle.italic)
                        ),
                        const SizedBox(height: 8),
                        const Text("Say 'Okay Saphira' to initiate.", 
                          style: TextStyle(color: Colors.pinkAccent, fontSize: 10, fontWeight: FontWeight.bold)
                        ),
                      ],
                    )
                  );
                }
                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16.0),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index];
                    return _buildMessageBubble(msg, isDark);
                  },
                );
              },
            ),
          ),
          _buildInputArea(isDark),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg, bool isDark) {
    return Align(
      alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: BoxDecoration(
          color: msg.isUser 
              ? const Color(0xFF4F46E5).withOpacity(0.2) 
              : (isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16.0),
            topRight: const Radius.circular(16.0),
            bottomLeft: Radius.circular(msg.isUser ? 16.0 : 4.0),
            bottomRight: Radius.circular(msg.isUser ? 4.0 : 16.0),
          ),
          border: Border.all(
            color: msg.isUser ? const Color(0xFF4F46E5).withOpacity(0.5) : (isDark ? Colors.white12 : Colors.black12),
            width: 1,
          ),
        ),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              msg.text,
              style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 14, height: 1.5),
            ),
            const SizedBox(height: 8),
            Text(
              _formatTime(msg.timestamp),
              style: TextStyle(
                color: msg.isUser ? Colors.indigo.shade400 : (isDark ? Colors.white38 : Colors.black38), 
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea(bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).appBarTheme.backgroundColor,
        border: Border(top: BorderSide(color: isDark ? Colors.white10 : Colors.black12)),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Container(
              decoration: BoxDecoration(
                color: _isWakeWordActive ? Colors.pinkAccent.withOpacity(0.2) : Colors.transparent,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: Icon(Icons.mic, color: _isWakeWordActive ? Colors.pinkAccent : Colors.indigoAccent),
                onPressed: () {},
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24.0),
                  border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                ),
                child: TextField(
                  controller: _textController,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                  decoration: InputDecoration(
                    hintText: 'Transmit directive...',
                    hintStyle: TextStyle(color: isDark ? Colors.white38 : Colors.black38, fontSize: 13),
                    border: InputBorder.none,
                  ),
                  onSubmitted: _handleSubmitted,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: const BoxDecoration(
                color: Colors.indigoAccent,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white, size: 20),
                onPressed: () => _handleSubmitted(_textController.text),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
