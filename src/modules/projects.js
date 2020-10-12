const Asana = require('./request/asana');

const get = async (accessToken) => {
  const projects = await Asana.projects(accessToken);
  if (!projects) throw Error('no projects found');

  return projects.data.map(project => {
    return {
      id: project.gid,
      name: project.name,
      ownerId: project.owner.gid,
      members: project.members.map(member => member.gid),

      team: project.team && project.team.gid,
      workspace: project.workspace.gid,

      createdAt: project.created_at,
      modifiedAt: project.modified_at,
      startOn: project.start_on,
      dueOn: project.due_on,

      currentStatus: project.current_status,

      isPublic: project.public,
      color: project.color,
      icon: project.icon,
    };
  });
};

exports.get = get;
