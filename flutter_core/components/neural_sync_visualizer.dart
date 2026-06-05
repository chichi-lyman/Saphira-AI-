import 'package:flutter/material.dart';
import 'dart:math';

class NeuralSyncVisualizer extends StatefulWidget {
  const NeuralSyncVisualizer({super.key});

  @override
  _NeuralSyncVisualizerState createState() => _NeuralSyncVisualizerState();
}

class _NeuralSyncVisualizerState extends State<NeuralSyncVisualizer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: Size.infinite,
          painter: _NeuralPainter(_controller.value),
        );
      },
    );
  }
}

class _NeuralPainter extends CustomPainter {
  final double progress;
  _NeuralPainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.indigoAccent.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    final center = Offset(size.width / 2, size.height / 2);
    final maxRadius = min(size.width, size.height) / 2;

    for (int i = 0; i < 5; i++) {
      final radius = maxRadius * ((progress + i / 5.0) % 1.0);
      final opacity = 1.0 - (radius / maxRadius);
      paint.color = Colors.indigoAccent.withOpacity(opacity * 0.8);
      canvas.drawCircle(center, radius, paint);
    }
    
    final nodePaint = Paint()
      ..color = Colors.pinkAccent
      ..style = PaintingStyle.fill;
      
    final random = Random(42);
    for (int i = 0; i < 12; i++) {
      final angle = random.nextDouble() * 2 * pi;
      final distance = random.nextDouble() * maxRadius * progress;
      final x = center.dx + cos(angle) * distance;
      final y = center.dy + sin(angle) * distance;
      canvas.drawCircle(Offset(x, y), 3.0, nodePaint);
      
      if (i > 0) {
        final prevAngle = random.nextDouble() * 2 * pi;
        final prevDist = random.nextDouble() * maxRadius * progress;
        final px = center.dx + cos(prevAngle) * prevDist;
        final py = center.dy + sin(prevAngle) * prevDist;
        
        final linkPaint = Paint()
          ..color = Colors.pinkAccent.withOpacity(0.2)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0;
        canvas.drawLine(Offset(x,y), Offset(px,py), linkPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _NeuralPainter oldDelegate) => true;
}
