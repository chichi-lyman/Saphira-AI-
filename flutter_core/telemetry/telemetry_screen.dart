import 'package:flutter/material.dart';

class TelemetryScreen extends StatelessWidget {
  final List<Map<String, dynamic>> _nodes = [
    {"region": "US-West-2", "status": "Active", "latency": "14ms", "sync": 99.8},
    {"region": "US-East-1", "status": "Active", "latency": "22ms", "sync": 98.5},
    {"region": "EU-Central-1", "status": "Degraded", "latency": "140ms", "sync": 82.1},
    {"region": "AP-South-1", "status": "Active", "latency": "89ms", "sync": 95.0},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('GLOBAL TELEMETRY', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2.0)),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [isDark ? Colors.indigo.shade900 : Colors.indigo.shade200, Colors.transparent],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.indigoAccent.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("SYSTEM HEURISTICS", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 10, letterSpacing: 2.0, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        const Text("OPTIMAL", style: TextStyle(color: Colors.greenAccent, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                      ],
                    ),
                    const Icon(Icons.public, color: Colors.indigoAccent, size: 48),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text("NODE MANIFEST", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 12, letterSpacing: 2.0, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ..._nodes.map((node) => _buildNodeCard(node, isDark)).toList(),
            ],
          ),
        ),
      )
    );
  }

  Widget _buildNodeCard(Map<String, dynamic> node, bool isDark) {
    final bool isOptimal = node['status'] == 'Active';
    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.02) : Colors.white,
        border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
        borderRadius: BorderRadius.circular(12),
        boxShadow: isDark ? [] : [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 12, height: 12,
                decoration: BoxDecoration(
                  color: isOptimal ? Colors.greenAccent : Colors.amberAccent,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: isOptimal ? Colors.greenAccent.withOpacity(0.5) : Colors.amberAccent.withOpacity(0.5), blurRadius: 8)
                  ]
                ),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(node['region'], style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text("Latency: ${node['latency']} | Sync: ${node['sync']}%", style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 10)),
                ],
              )
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: (isOptimal ? Colors.greenAccent : Colors.amberAccent).withOpacity(0.1),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: (isOptimal ? Colors.greenAccent : Colors.amberAccent).withOpacity(0.3))
            ),
            child: Text(node['status'].toUpperCase(), style: TextStyle(color: isOptimal ? Colors.greenAccent : Colors.amberAccent, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
          )
        ],
      ),
    );
  }
}
