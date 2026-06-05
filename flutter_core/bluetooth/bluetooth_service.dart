import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:async';

class BluetoothService {
  final List<String> _knownDeviceIds = []; // Can be loaded from shared_prefs or DB
  StreamSubscription<List<ScanResult>>? _scanSubscription;

  Future<void> startScanningAndAutoConnect() async {
    // Check if Bluetooth is supported
    if (await FlutterBluePlus.isSupported == false) {
      print("Bluetooth not supported by this device");
      return;
    }

    // Wait for Bluetooth to be turned on
    var state = await FlutterBluePlus.adapterState.firstWhere((s) => s == BluetoothAdapterState.on);
    if (state != BluetoothAdapterState.on) {
      print("Bluetooth is not turned on");
      return;
    }

    print("Initiating automatic discovery for smart devices...");

    // Start scanning
    await FlutterBluePlus.startScan(timeout: const Duration(seconds: 15));

    _scanSubscription = FlutterBluePlus.scanResults.listen((results) {
      for (ScanResult r in results) {
        // Simple logic: if device name matches target hardware (e.g. Saphira Neural Link)
        if (r.device.platformName.toLowerCase().contains('saphira') || 
            _knownDeviceIds.contains(r.device.remoteId.str)) {
          print("Found target neural-sync device: ${r.device.platformName}. Attempting uplink...");
          _autoConnectToDevice(r.device);
        }
      }
    });
  }

  void _autoConnectToDevice(BluetoothDevice device) async {
    try {
      await device.connect(autoConnect: true);
      print("Hardware uplink established with ${device.platformName}.");
      FlutterBluePlus.stopScan();
      // Handle the connection, discover services, characteristics here
    } catch (e) {
      print("Uplink failed: $e");
    }
  }

  void dispose() {
    _scanSubscription?.cancel();
    FlutterBluePlus.stopScan();
  }
}
