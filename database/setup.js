const { sequelize } = require('../models');

async function setup(){
  try{
    await sequelize.sync({ force: true });
    console.log('Database synced (force: true).');
    process.exit(0);
  }catch(err){
    console.error('Setup failed', err);
    process.exit(1);
  }
}

setup();
