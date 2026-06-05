import 'dart:ui';
import 'package:flutter/material.dart';
import '../chat/chat_screen.dart';
import '../tasks/task_screen.dart';
import '../telemetry/telemetry_screen.dart';
import '../causal/causal_analysis_screen.dart';
import '../governance/governance_screen.dart';
import '../settings/settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    ChatScreen(),
    TaskScreen(),
    TelemetryScreen(),
    CausalAnalysisScreen(),
    GovernanceScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: ClipRRect(
        borderRadius: BorderRadius.circular(12.0),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12.0, sigmaY: 12.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.03),
              border: Border.all(
                color: const Color(0xFFFF1493).withOpacity(0.3), // Neon Hot Pink
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(12.0),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFF1493).withOpacity(0.2),
                  blurRadius: 8.0,
                ),
              ],
            ),
            child: _screens[_currentIndex],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: isDark ? Colors.white10 : Colors.black12, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
          selectedItemColor: Colors.pinkAccent,
          unselectedItemColor: isDark ? Colors.white38 : Colors.black38,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 9, letterSpacing: 0.5),
          unselectedLabelStyle: const TextStyle(fontSize: 9),
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.whatshot), label: 'LINK'),
            BottomNavigationBarItem(icon: Icon(Icons.schema), label: 'MATRIX'),
            BottomNavigationBarItem(icon: Icon(Icons.public), label: 'GLOBAL'),
            BottomNavigationBarItem(icon: Icon(Icons.account_tree), label: 'CAUSAL'),
            BottomNavigationBarItem(icon: Icon(Icons.gavel), label: 'GOVERN'),
            BottomNavigationBarItem(icon: Icon(Icons.tune), label: 'SYSTEM'),
          ],
        ),
      ),
    );
  }
}
