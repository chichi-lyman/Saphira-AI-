import 'package:flutter/material.dart';
import '../auth/auth_service.dart';
import '../speech/tts_service.dart';
import '../../main.dart'; // For themeNotifier

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final AuthService _authService = AuthService();
  bool _heuristicSync = true;
  bool _deepThinkEngaged = false;
  bool _autoConnectSmartDevices = true;
  bool _pushNotificationsEnabled = true;
  bool _taskAlertsEnabled = true;
  bool _securityAlertsEnabled = true;

  void _handleLogout() async {
    try {
      await _authService.logout();
      // AuthGate will naturally pick up the logout stream event and redirect
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to logout: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : Colors.black87;
    final subColor = isDark ? Colors.white54 : Colors.black54;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('SYSTEM PREFERENCES', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2.0)),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            child: Text("NEURAL INTEGRATION", style: TextStyle(color: Colors.indigoAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          SwitchListTile(
            title: Text("Heuristic Sync", style: TextStyle(color: textColor)),
            subtitle: Text("Allow continuous cognitive processing in background.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _heuristicSync,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _heuristicSync = val),
          ),
          SwitchListTile(
            title: Text("Deep Think Engagement", style: TextStyle(color: textColor)),
            subtitle: Text("Recursive reasoning enabled for all high-level directives.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _deepThinkEngaged,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _deepThinkEngaged = val),
          ),
          SwitchListTile(
            title: Text("Smart Device Auto-Link", style: TextStyle(color: textColor)),
            subtitle: Text("Automatically connect to Saphira Neural peripherals via Bluetooth.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _autoConnectSmartDevices,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _autoConnectSmartDevices = val),
          ),
          
          const Divider(height: 48),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            child: Text("INTERFACE & APPEARANCE", style: TextStyle(color: Colors.indigoAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          SwitchListTile(
            title: Text("Dark Substrate Mode", style: TextStyle(color: textColor)),
            subtitle: Text("Toggle between Dark Substrate and Light Inversion.", style: TextStyle(color: subColor, fontSize: 12)),
            value: themeNotifier.value == ThemeMode.dark,
            activeColor: Colors.pinkAccent,
            onChanged: (val) {
              setState(() {
                themeNotifier.value = val ? ThemeMode.dark : ThemeMode.light;
              });
            },
          ),

          const Divider(height: 48),

          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            child: Text("NOTIFICATION PREFERENCES", style: TextStyle(color: Colors.indigoAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          SwitchListTile(
            title: Text("Active Push Uplink", style: TextStyle(color: textColor)),
            subtitle: Text("Receive real-time micro-saas swarm updates and network pings.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _pushNotificationsEnabled,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _pushNotificationsEnabled = val),
          ),
          SwitchListTile(
            title: Text("Task Coordination Alerts", style: TextStyle(color: textColor)),
            subtitle: Text("Notify on scheduled task milestones, comments, and team handoffs.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _taskAlertsEnabled,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _taskAlertsEnabled = val),
          ),
          SwitchListTile(
            title: Text("Saphira security Signals", style: TextStyle(color: textColor)),
            subtitle: Text("High-priority warnings on unauthorized access, DNS anomalies, or zero-day risks.", style: TextStyle(color: subColor, fontSize: 12)),
            value: _securityAlertsEnabled,
            activeColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => _securityAlertsEnabled = val),
          ),
          
          const Divider(height: 48),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            child: Text("VOCAL OUTPUT", style: TextStyle(color: Colors.indigoAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          ListTile(
            title: Text("Language Selection", style: TextStyle(color: textColor)),
            subtitle: Text("Ensure linguistic alignment.", style: TextStyle(color: subColor, fontSize: 12)),
            trailing: DropdownButton<String>(
              dropdownColor: Theme.of(context).scaffoldBackgroundColor,
              value: TTSService().currentLanguage,
              items: TTSService().getLanguages()
                  .map((dynamic lang) => lang.toString())
                  .toSet()
                  .map<DropdownMenuItem<String>>((String lang) {
                return DropdownMenuItem<String>(
                  value: lang,
                  child: Text(lang, style: TextStyle(color: textColor, fontSize: 14)),
                );
              }).toList(),
              onChanged: (String? val) {
                if (val != null) {
                  TTSService().setLanguage(val).then((_) => setState(() {}));
                }
              },
            ),
          ),
          ListTile(
            title: Text("Voice Profile", style: TextStyle(color: textColor)),
            subtitle: Text("Configure Saphira's vocal characteristics.", style: TextStyle(color: subColor, fontSize: 12)),
            trailing: DropdownButton<String>(
              dropdownColor: Theme.of(context).scaffoldBackgroundColor,
              value: TTSService().currentVoiceName,
              items: TTSService().getVoicesForLanguage(TTSService().currentLanguage)
                  .map((v) => v is Map ? v["name"].toString() : v.toString())
                  .toSet() // Removes duplicates which crash Dropdown
                  .map<DropdownMenuItem<String>>((String vName) {
                return DropdownMenuItem<String>(
                  value: vName,
                  child: Text(vName.length > 20 ? vName.substring(0, 20) + '...' : vName, style: TextStyle(color: textColor, fontSize: 14)),
                );
              }).toList(),
              onChanged: (String? val) {
                if (val != null) {
                  var voices = TTSService().getVoicesForLanguage(TTSService().currentLanguage);
                  var matched = voices.firstWhere((v) => (v is Map ? v["name"].toString() : v.toString()) == val, orElse: () => null);
                  if (matched != null && matched is Map) {
                    TTSService().setVoice({"name": matched["name"].toString(), "locale": matched["locale"].toString()}).then((_) => setState(() {}));
                  }
                }
              },
            ),
          ),
          ListTile(
            title: Text("Voice Output Speed", style: TextStyle(color: textColor)),
            subtitle: Text("Configure Saphira's speech cadence rate: ${TTSService().currentSpeechRate.toStringAsFixed(1)}x", style: TextStyle(color: subColor, fontSize: 12)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Text("Slow", style: TextStyle(color: subColor, fontSize: 11)),
                Expanded(
                  child: Slider(
                    value: TTSService().currentSpeechRate,
                    min: 0.1,
                    max: 1.0,
                    divisions: 9,
                    activeColor: Colors.pinkAccent,
                    inactiveColor: Colors.deepPurple.withOpacity(0.1),
                    onChanged: (double val) {
                      setState(() {
                        TTSService().setSpeechRate(val);
                      });
                    },
                  ),
                ),
                Text("Fast", style: TextStyle(color: subColor, fontSize: 11)),
              ],
            ),
          ),
          
          const Divider(height: 48),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            child: Text("ACCESS & SECURITY", style: TextStyle(color: Colors.indigoAccent, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
          ),
          ListTile(
            leading: Icon(Icons.shield_outlined, color: isDark ? Colors.white70 : Colors.black87),
            title: Text("Security Audit Log", style: TextStyle(color: textColor)),
            trailing: Icon(Icons.chevron_right, color: subColor),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.power_settings_new, color: Colors.redAccent),
            title: const Text("Disconnect Uplink", style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            onTap: _handleLogout,
          ),
        ],
      ),
    );
  }
}
