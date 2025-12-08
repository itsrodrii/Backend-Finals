const { sequelize, User, Project, Task } = require('../models');

async function seed(){
  try{
    await sequelize.sync({ force: true });

    const alice = await User.create({ name: 'Alice Johnson', email: 'alice@example.com' });
    const bob = await User.create({ name: 'Bob Smith', email: 'bob@example.com' });
    const carol = await User.create({ name: 'Carol Lee', email: 'carol@example.com' });

    const proj1 = await Project.create({ projectName: 'Website Redesign', description: 'Redesign landing page', createdByUserId: alice.id });
    const proj2 = await Project.create({ projectName: 'Mobile App', description: 'Initial MVP', createdByUserId: bob.id });

    await Task.create({ taskName: 'Create wireframes', description: 'Homepage and dashboard', status: 'in-progress', assignedUserId: bob.id, projectId: proj1.id });
    await Task.create({ taskName: 'Set up project repo', description: 'Initialize repo and CI', status: 'todo', assignedUserId: carol.id, projectId: proj2.id });
    await Task.create({ taskName: 'Write API docs', description: 'Document endpoints for MVP', status: 'todo', assignedUserId: alice.id, projectId: proj1.id });

    console.log('Seed complete.');
    process.exit(0);
  }catch(err){
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
