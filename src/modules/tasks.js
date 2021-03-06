const Asana = require('./request/asana');
const logger = require('../utils/logger');

const format = (tasks) => {
  return tasks && tasks.data && tasks.data.map(task => {
    return {
      id: task.gid,
      name: task.name,
      completed: task.completed,
      completedAt: task.completed_at,
      completedBy: task.completed_by && task.completed_by.gid,

      createdOn: task.created_at,
      dueAt: task.due_at,
      dueOn: task.due_on,
      modifiedAt: task.modified_at,
      startOn: task.start_on,

      numLikes: task.num_likes,

      assignee: task.assignee && task.assignee.gid,
      parent: task.parent && task.parent.gid,
      workspace: task.workspace.gid,
    };
  });
};

const get = async (accessToken, projects) => {
  const allTasks = {};
  for (const project of projects) {
    const tasks = await Asana.tasksByProject(accessToken, project);
    if (tasks) {
      allTasks[project] = format(tasks);
    }
  }
  return Object.keys(allTasks).length > 0 ? allTasks : null;
};

const getByUser = async (accessToken, userId, workspace, startDate) => {
  let nextPage = null;
  const tasksAsana = await Asana.tasksByUser(accessToken, userId, workspace, startDate);

  if (!tasksAsana || !tasksAsana.data) return null;
  if (!tasksAsana.next_page) return format(tasksAsana);
  const tasksFormatted = [...format(tasksAsana)];
  nextPage = tasksAsana.next_page;
  do {
    const tasksAsanaNextPage = await Asana.customResource(accessToken, nextPage.path);
    if (!tasksAsanaNextPage || !tasksAsanaNextPage.data) break;
    tasksFormatted.push(...format(tasksAsanaNextPage));
    nextPage = tasksAsanaNextPage.next_page;
  } while (nextPage);
  return tasksFormatted;
};

const getByUsers = async (accessToken, users, workspacesAllowed, startDate, res) => {
  // const allTasks = {};
  const allTasks = [];
  for (const user of users) {
    const tasks = [];
    for (const workspace of user.workspaces) {
      if (!workspacesAllowed.includes(workspace)) continue;
      const tasksAsana = await getByUser(accessToken, user.id, workspace, startDate);
      if (!tasksAsana) {
        logger.error({
          filename: __filename,
          methodName: 'getByUsers',
          message: `fail get asana tasks, userId: ${user.id}, workspace: ${workspace}`,
        });
        continue;
      }
      tasks.push(...tasksAsana);
    }
    allTasks.push(...tasks);
    if (tasks && res) {
      res.write(`data:${JSON.stringify(tasks)}\n\n`);
    }
  }
  return Object.keys(allTasks).length > 0 ? allTasks : null;
};

exports.get = get;
exports.getByUsers = getByUsers;
