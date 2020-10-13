const Asana = require('./request/asana');

const get = async (accessToken, projects) => {
  const allTasks = {};
  for (const project of projects) {
    const tasks = await Asana.tasks(accessToken, project);
    if (tasks) {
      allTasks[project] = tasks.data.map(task => {
        return {
          id: task.gid,
          name: task.name,
          completed: task.completed,
          completedAt: task.completed_at,
          completedBy: task.completed_by && task.completed_by.gid,

          createdAt: task.created_at,
          dueAt: task.due_at,
          dueOn: task.due_on,
          modifiedAt: task.modified_at,
          startOn: task.start_on,

          numLikes: task.num_likes,

          assignee: task.assignee && task.assignee.gid,
          parent: task.parent && task.parent.gid,
        };
      });
    }
  }
  return Object.keys(allTasks).length > 0 ? allTasks : null;
};

exports.get = get;
