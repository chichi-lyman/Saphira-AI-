import 'package:flutter/material.dart';

class CausalAnalysisScreen extends StatelessWidget {
  final List<Map<String, dynamic>> _chains = [
    {
      "cause": "Market Index Shift Delta > 2%",
      "effect": "Trigger Resource Allocation Protocol Omega",
      "probability": 0.94
    },
    {
      "cause": "User Engagement Subdued Level 3",
      "effect": "Initiate Predictive Empathy Routing",
      "probability": 0.88
    },
    {
      "cause": "System Node Degraded (EU-Central)",
      "effect": "Reroute Causal Processing to AP-South",
      "probability": 0.99
    }
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('CAUSAL CHAINS', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2.0)),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _chains.length,
        itemBuilder: (context, index) {
          final chain = _chains[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 24.0),
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withOpacity(0.04) : Colors.white,
              border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
              borderRadius: BorderRadius.circular(16),
              boxShadow: isDark ? [] : [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 3))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.outbound, color: Colors.indigoAccent, size: 20),
                    const SizedBox(width: 8),
                    Text("INPUT MATRIX", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(chain['cause'], style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 14, fontWeight: FontWeight.w600)),
                
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                  child: Row(
                    children: [
                      Container(width: 2, height: 24, color: Colors.pinkAccent.withOpacity(0.5), margin: const EdgeInsets.only(left: 8)),
                      const SizedBox(width: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.pinkAccent.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: Colors.pinkAccent.withOpacity(0.3))
                        ),
                        child: Text("PROBABILITY: ${(chain['probability'] * 100).toStringAsFixed(0)}%", style: const TextStyle(color: Colors.pinkAccent, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                      )
                    ],
                  ),
                ),
                
                Row(
                  children: [
                    const Icon(Icons.login, color: Colors.pinkAccent, size: 20),
                    const SizedBox(width: 8),
                    Text("PROJECTED OUTPUT", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(chain['effect'], style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          );
        },
      )
    );
  }
}
