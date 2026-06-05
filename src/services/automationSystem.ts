export interface AutomationTask {
  id: string;
  userId: string;
  type: string;
  schedule: string; // e.g., 'daily', 'hourly'
  status: 'active' | 'paused';
  data: any;
}

const tasks: AutomationTask[] = [];

export class AutomationSystem {
  static addTask(userId: string, type: string, schedule: string, data: any) {
    const task: AutomationTask = {
      id: Math.random().toString(36).substring(7),
      userId,
      type,
      schedule,
      status: 'active',
      data
    };
    tasks.push(task);
    return task;
  }

  static getTasksByUser(userId: string) {
    return tasks.filter(t => t.userId === userId);
  }

  static removeTask(taskId: string) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
}
