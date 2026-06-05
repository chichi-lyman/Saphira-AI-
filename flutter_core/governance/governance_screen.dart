import 'package:flutter/material.dart';
import 'dart:async';

class GovernanceScreen extends StatefulWidget {
  @override
  _GovernanceScreenState createState() => _GovernanceScreenState();
}

class _GovernanceScreenState extends State<GovernanceScreen> {
  final List<Map<String, dynamic>> _feed = [
    {"time": DateTime.now().subtract(const Duration(minutes: 2)), "event": "Global policy shift: Carbon offset optimized.", "type": "policy"},
    {"time": DateTime.now().subtract(const Duration(minutes: 15)), "event": "Resource allocation adjusted for EU-Central.", "type": "resource"},
    {"time": DateTime.now().subtract(const Duration(hours: 1)), "event": "Security breach attempt mitigated at Node 4.", "type": "security"},
  ];

  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 15), (timer) {
      if (mounted) {
        setState(() {
          _feed.insert(0, {
            "time": DateTime.now(),
            "event": "Automated node recalibration completed via Heuristic Sync.",
            "type": "system"
          });
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('GOVERNANCE FEED', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2.0)),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _feed.length,
        itemBuilder: (context, index) {
          final item = _feed[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12.0),
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withOpacity(0.03) : Colors.white,
              border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
              borderRadius: BorderRadius.circular(12),
              boxShadow: isDark ? [] : [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))],
            ),
            child: Row(
              children: [
                Icon(
                  item['type'] == 'security' ? Icons.security :
                  item['type'] == 'policy' ? Icons.policy :
                  item['type'] == 'resource' ? Icons.memory : Icons.settings,
                  color: item['type'] == 'security' ? Colors.redAccent : Colors.indigoAccent,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['event'], style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text("${item['time'].hour}:${item['time'].minute.toString().padLeft(2, '0')}", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
