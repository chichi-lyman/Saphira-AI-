import 'package:flutter/material.dart';
import 'dart:math';

class Task {
  final String id;
  String title;
  String description;
  String status; 
  String priority; 
  List<String> tags;
  List<String> dependencies;
  List<String> attachments;
  DateTime? reminder;
  String? targetNode;

  Task({
    required this.id, 
    required this.title, 
    this.description = '', 
    this.status = 'pending', 
    this.priority = 'medium',
    this.tags = const [],
    this.dependencies = const [],
    this.attachments = const [],
    this.reminder,
    this.targetNode,
  });
}

class TaskScreen extends StatefulWidget {
  @override
  _TaskScreenState createState() => _TaskScreenState();
}

class _TaskScreenState extends State<TaskScreen> {
  final List<Task> _tasks = [
    Task(id: '1', title: 'Initialize Global Protocols', description: 'Deploy secondary sync protocols via neural mesh.', priority: 'critical', status: 'in-progress', tags: ['ops', 'neural']),
    Task(id: '2', title: 'Calibrate Causal Engine', description: 'Ensure causal links validate against heuristic bounds.', priority: 'high', status: 'pending', tags: ['neural'], dependencies: ['1']),
    Task(id: '3', title: 'User Data Consolidation', description: 'Aggregate scattered telemetry from regional nodes.', priority: 'medium', status: 'completed', tags: ['data']),
    Task(id: '4', title: 'Optimize UI Matrix', description: 'Enhance visual responsiveness of node components.', priority: 'low', status: 'pending', tags: ['interface'], dependencies: ['3']),
  ];

  String _selectedTag = 'all';
  String _sortBy = 'priority';
  String _searchQuery = '';
  bool _showNetworkView = false;

  void _addTask() {
    _showAddTaskDialog();
  }

  void _showAddTaskDialog() {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    String priority = 'medium';
    List<String> selectedDependencies = [];
    DateTime? selectedReminder;
    String attachmentStr = '';
    String? selectedTargetNode;

    final telemetryNodes = ["US-West-2", "US-East-1", "EU-Central-1", "AP-South-1"];

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final availableDependencies = _tasks.where((t) => !selectedDependencies.contains(t.id)).toList();

            return AlertDialog(
              backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
              title: const Text('Forge New Directive', style: TextStyle(fontWeight: FontWeight.w900)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: titleCtrl,
                      decoration: const InputDecoration(labelText: 'Title'),
                    ),
                    TextField(
                      controller: descCtrl,
                      decoration: const InputDecoration(labelText: 'Description'),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: priority,
                      dropdownColor: Theme.of(context).scaffoldBackgroundColor,
                      items: ['low', 'medium', 'high', 'critical'].map((p) => DropdownMenuItem(value: p, child: Text(p.toUpperCase()))).toList(),
                      onChanged: (val) => setDialogState(() => priority = val!),
                      decoration: const InputDecoration(labelText: 'Priority'),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String?>(
                      value: selectedTargetNode,
                      dropdownColor: Theme.of(context).scaffoldBackgroundColor,
                      items: [
                        const DropdownMenuItem<String?>(value: null, child: Text('No Target Node')),
                        ...telemetryNodes.map((n) => DropdownMenuItem(value: n, child: Text(n)))
                      ],
                      onChanged: (val) => setDialogState(() => selectedTargetNode = val),
                      decoration: const InputDecoration(labelText: 'Target Node'),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      onChanged: (v) => attachmentStr = v,
                      decoration: const InputDecoration(labelText: 'Attachment (URL or Name)'),
                    ),
                    const SizedBox(height: 16),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(selectedReminder == null ? 'No Reminder' : 'Reminder: \${selectedReminder!.toLocal().toString().split(' ')[0]}'),
                      trailing: const Icon(Icons.calendar_today, color: Colors.indigoAccent),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null) {
                          setDialogState(() => selectedReminder = picked);
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('Dependencies:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                    Wrap(
                      spacing: 8.0,
                      children: selectedDependencies.map((depId) {
                        final t = _tasks.firstWhere((task) => task.id == depId);
                        return Chip(
                          label: Text(t.title, style: const TextStyle(fontSize: 10)),
                          onDeleted: () => setDialogState(() => selectedDependencies.remove(depId)),
                        );
                      }).toList(),
                    ),
                    if (availableDependencies.isNotEmpty)
                      DropdownButton<String>(
                        hint: const Text('Add Dependency'),
                        dropdownColor: Theme.of(context).scaffoldBackgroundColor,
                        items: availableDependencies.map((t) => DropdownMenuItem(value: t.id, child: Text(t.title, style: const TextStyle(fontSize: 12)))).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setDialogState(() => selectedDependencies.add(val));
                          }
                        },
                      )
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('CANCEL', style: TextStyle(color: Colors.white54)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent),
                  onPressed: () {
                    final title = titleCtrl.text.trim();
                    final desc = descCtrl.text.trim();
                    if (title.isNotEmpty) {
                      _processAndAddTask(title, desc, priority, selectedDependencies, selectedReminder, attachmentStr, selectedTargetNode);
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('INITIALIZE', style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          }
        );
      }
    );
  }

  void _processAndAddTask(String title, String description, String priority, List<String> explicitDeps, DateTime? reminder, String attachmentStr, String? targetNode) {
    // AI-Driven Auto-Categorization (Simulated)
    final text = "\${title.toLowerCase()} \${description.toLowerCase()}";
    List<String> autoTags = [];
    if (text.contains('sync') || text.contains('neural')) autoTags.add('neural');
    if (text.contains('data') || text.contains('telemetry')) autoTags.add('data');
    if (text.contains('ui') || text.contains('view') || text.contains('matrix')) autoTags.add('interface');
    if (text.contains('deploy') || text.contains('protocol')) autoTags.add('ops');
    if (autoTags.isEmpty) autoTags.add('general');

    // AI-Driven Dependencies (Simulated logic: if it mentions a word from another task, it depends on it)
    List<String> combinedDependencies = List.from(explicitDeps);
    for (var task in _tasks) {
      final keyWords = task.title.toLowerCase().split(' ').where((w) => w.length > 4);
      for (var word in keyWords) {
        if (text.contains(word)) {
          if (!combinedDependencies.contains(task.id)) {
            combinedDependencies.add(task.id);
          }
        }
      }
    }

    List<String> attachments = [];
    if (attachmentStr.isNotEmpty) attachments.add(attachmentStr);

    setState(() {
      _tasks.add(Task(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title,
        description: description,
        priority: priority,
        tags: autoTags,
        dependencies: combinedDependencies,
        attachments: attachments,
        reminder: reminder,
        targetNode: targetNode,
      ));
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Task registered. Tags: \${autoTags.join(', ')}. Dependencies: \${combinedDependencies.length} detected.'),
        backgroundColor: Colors.indigoAccent,
      )
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'critical': return Colors.redAccent;
      case 'high': return Colors.amberAccent;
      case 'medium': return Colors.indigoAccent;
      default: return Colors.blueGrey;
    }
  }

  int _getPriorityValue(String p) {
    switch (p) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      default: return 1;
    }
  }

  List<String> get _allTags {
    final tags = <String>{};
    for (var t in _tasks) {
      tags.addAll(t.tags);
    }
    return ['all', ...tags.toList()..sort()];
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    List<Task> filteredTasks = _tasks.where((t) {
      if (_selectedTag != 'all' && !t.tags.contains(_selectedTag)) return false;
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        if (!t.title.toLowerCase().contains(query) && !t.description.toLowerCase().contains(query)) {
          return false;
        }
      }
      return true;
    }).toList();

    // Improved Task Prioritization and Sorting
    filteredTasks.sort((a, b) {
      if (a.status == 'completed' && b.status != 'completed') return 1;
      if (a.status != 'completed' && b.status == 'completed') return -1;
      
      if (_sortBy == 'priority') {
        return _getPriorityValue(b.priority).compareTo(_getPriorityValue(a.priority));
      } else if (_sortBy == 'alphabetical') {
        return a.title.compareTo(b.title);
      } else {
        return 0;
      }
    });

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('TASK MATRIX', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2.0)),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        elevation: 0,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.sort, color: Colors.indigoAccent),
            tooltip: 'Sort By',
            onSelected: (val) => setState(() => _sortBy = val),
            color: Theme.of(context).scaffoldBackgroundColor,
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'priority', child: Text('Sort by Priority')),
              const PopupMenuItem(value: 'alphabetical', child: Text('Sort Alphabetically')),
            ],
          ),
          IconButton(
            icon: Icon(_showNetworkView ? Icons.list : Icons.account_tree, color: Colors.pinkAccent),
            tooltip: _showNetworkView ? 'Matrix View' : 'Neural Network View',
            onPressed: () {
              setState(() {
                _showNetworkView = !_showNetworkView;
              });
            },
          )
        ],
      ),
      body: Column(
        children: [
          // Filter Bar
          Container(
            height: 50,
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.white10)),
            ),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              itemCount: _allTags.length,
              itemBuilder: (context, index) {
                final tag = _allTags[index];
                final isSelected = _selectedTag == tag;
                return GestureDetector(
                  onTap: () => setState(() => _selectedTag = tag),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8.0),
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.indigoAccent : (isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isSelected ? Colors.indigoAccent : (isDark ? Colors.white10 : Colors.black12)),
                    ),
                    child: Center(
                      child: Text(
                        tag.toUpperCase(),
                        style: TextStyle(
                          color: isSelected ? Colors.white : (isDark ? Colors.white54 : Colors.black54),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search directives...',
                hintStyle: TextStyle(color: isDark ? Colors.white38 : Colors.black38),
                prefixIcon: Icon(Icons.search, color: isDark ? Colors.white38 : Colors.black38),
                filled: true,
                fillColor: isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
              style: TextStyle(color: isDark ? Colors.white : Colors.black87),
            ),
          ),
          
          Expanded(
            child: _showNetworkView 
              ? _buildNetworkView(filteredTasks)
              : _buildListView(filteredTasks),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addTask,
        backgroundColor: Colors.pinkAccent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildListView(List<Task> filteredTasks) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (filteredTasks.isEmpty) {
      return const Center(child: Text("All operational vectors clear.", style: TextStyle(color: Colors.white38)));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: filteredTasks.length,
      itemBuilder: (context, index) {
        final task = filteredTasks[index];
        return _buildTaskCard(task, isDark);
      },
    );
  }

  Widget _buildTaskCard(Task task, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.03) : Colors.white,
        border: Border.all(color: task.dependencies.isNotEmpty && task.status != 'completed' ? Colors.indigoAccent.withOpacity(0.3) : (isDark ? Colors.white10 : Colors.black12)),
        borderRadius: BorderRadius.circular(12),
        boxShadow: task.priority == 'critical' && task.status != 'completed' ? [
          BoxShadow(color: Colors.redAccent.withOpacity(0.1), blurRadius: 10, spreadRadius: -2)
        ] : (isDark ? [] : [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))]),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                task.title,
                style: TextStyle(
                  color: task.status == 'completed' ? (isDark ? Colors.white38 : Colors.black38) : (isDark ? Colors.white : Colors.black87),
                  fontWeight: FontWeight.bold,
                  decoration: task.status == 'completed' ? TextDecoration.lineThrough : null,
                ),
              ),
            ),
            PopupMenuButton<String>(
              onSelected: (val) => setState(() => task.priority = val),
              color: Theme.of(context).scaffoldBackgroundColor,
              itemBuilder: (context) => ['critical', 'high', 'medium', 'low']
                  .map((p) => PopupMenuItem(
                        value: p,
                        child: Text(p.toUpperCase(), style: TextStyle(color: _getPriorityColor(p))),
                      ))
                  .toList(),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getPriorityColor(task.priority).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _getPriorityColor(task.priority).withOpacity(0.5))
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(task.priority.toUpperCase(), style: TextStyle(fontSize: 8, color: _getPriorityColor(task.priority), fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_drop_down, size: 12, color: _getPriorityColor(task.priority))
                  ],
                ),
              ),
            )
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(task.description, style: const TextStyle(color: Colors.white54, fontSize: 12)),
              const SizedBox(height: 8),
              Row(
                children: [
                  ...task.tags.map((tag) => Container(
                    margin: const EdgeInsets.only(right: 6.0),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: isDark ? Colors.white10 : Colors.black12, borderRadius: BorderRadius.circular(4)),
                    child: Text("#$tag", style: const TextStyle(color: Colors.indigoAccent, fontSize: 9)),
                  )),
                  if (task.dependencies.isNotEmpty)
                    Container(
                      margin: const EdgeInsets.only(right: 6.0),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: Colors.amberAccent.withOpacity(0.2))),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.link, size: 10, color: Colors.amberAccent),
                          const SizedBox(width: 4),
                          Text("\${task.dependencies.length} Dep", style: const TextStyle(color: Colors.amberAccent, fontSize: 9)),
                        ],
                      ),
                    ),
                  if (task.attachments.isNotEmpty)
                    Container(
                      margin: const EdgeInsets.only(right: 6.0),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.blueAccent.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: Colors.blueAccent.withOpacity(0.2))),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.attachment, size: 10, color: Colors.blueAccent),
                          const SizedBox(width: 4),
                          Text("\${task.attachments.length} Attach", style: const TextStyle(color: Colors.blueAccent, fontSize: 9)),
                        ],
                      ),
                    ),
                  if (task.reminder != null)
                    Container(
                      margin: const EdgeInsets.only(right: 6.0),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.tealAccent.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: Colors.tealAccent.withOpacity(0.2))),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.alarm, size: 10, color: Colors.tealAccent),
                          const SizedBox(width: 4),
                          Text(task.reminder!.toLocal().toString().split(' ')[0], style: const TextStyle(color: Colors.tealAccent, fontSize: 9)),
                        ],
                      ),
                    ),
                  if (task.targetNode != null)
                    Container(
                      margin: const EdgeInsets.only(right: 6.0),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.purpleAccent.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: Colors.purpleAccent.withOpacity(0.2))),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.hub, size: 10, color: Colors.purpleAccent),
                          const SizedBox(width: 4),
                          Text(task.targetNode!, style: const TextStyle(color: Colors.purpleAccent, fontSize: 9)),
                        ],
                      ),
                    ),
                ],
              )
            ],
          ),
        ),
        trailing: Checkbox(
          value: task.status == 'completed',
          activeColor: Colors.pinkAccent,
          onChanged: (val) {
            setState(() {
              task.status = val! ? 'completed' : 'pending';
            });
          },
        ),
      ),
    );
  }

  // A simplified visualizer representing dependencies using an indented visual graph
  Widget _buildNetworkView(List<Task> filteredTasks) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (filteredTasks.isEmpty) return const Center(child: Text("Empty matrix."));

    // Find root nodes (no dependencies)
    final rootTasks = filteredTasks.where((t) => t.dependencies.isEmpty).toList();
    final otherTasks = filteredTasks.where((t) => t.dependencies.isNotEmpty).toList();

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        const Text("NEURAL LINK VISUALIZATION", style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2.0)),
        const SizedBox(height: 16),
        ...rootTasks.map((root) => _buildNetworkNode(root, otherTasks, 0, isDark)),
        // Safety net for orphaned dependencies (tasks that have a dependency that isn't root or isn't matching)
        if (otherTasks.any((t) => !rootTasks.any((r) => t.dependencies.contains(r.id))))
          const Padding(
            padding: EdgeInsets.only(top: 24.0, bottom: 8.0),
            child: Text("ORPHANED NODES", style: TextStyle(color: Colors.amberAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2.0)),
          ),
        ...otherTasks.where((t) => !rootTasks.any((r) => t.dependencies.contains(r.id)) && !otherTasks.any((o) => o != t && t.dependencies.contains(o.id))).map((orph) => _buildNetworkNode(orph, otherTasks, 0, isDark))
      ],
    );
  }

  Widget _buildNetworkNode(Task node, List<Task> allDeps, int depth, bool isDark) {
    // Find children of this node
    final children = allDeps.where((t) => t.dependencies.contains(node.id)).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(left: depth * 24.0, bottom: 8.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (depth > 0) 
                 Padding(
                   padding: const EdgeInsets.only(right: 8.0, top: 8.0),
                   child: Icon(Icons.subdirectory_arrow_right, color: Colors.indigoAccent.withOpacity(0.5), size: 16),
                 ),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: node.status == 'completed' ? (isDark ? Colors.white.withOpacity(0.01) : Colors.black.withOpacity(0.01)) : Theme.of(context).appBarTheme.backgroundColor,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: node.status == 'completed' ? (isDark ? Colors.white10 : Colors.black12) : _getPriorityColor(node.priority).withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(child: Text(node.title, style: TextStyle(color: node.status == 'completed' ? (isDark ? Colors.white38 : Colors.black38) : (isDark ? Colors.white : Colors.black87), fontSize: 12, fontWeight: FontWeight.bold))),
                          Container(
                            width: 8, height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: node.status == 'completed' ? (isDark ? Colors.white10 : Colors.black12) : _getPriorityColor(node.priority)
                            ),
                          )
                        ],
                      ),
                      if (node.tags.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Text(node.tags.join(', ').toUpperCase(), style: const TextStyle(color: Colors.indigoAccent, fontSize: 8, letterSpacing: 1.0)),
                        )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        ...children.map((child) => _buildNetworkNode(child, allDeps, depth + 1, isDark))
      ],
    );
  }
}

