require('dotenv').config();
const { create } = require('./create');
const { del } = require('./delete');
const { logInfo, getAllAccounts, createUsers, deleteUsers, envAssert } = require('./util.js');

const start = async () => {
  envAssert();
  console.log(`INFO: running script in ${process.env.MODE} mode.`);

  const accounts = await getAllAccounts();
  logInfo('found', 'account', accounts.length);

  if (process.env.MODE != 'GET') {
    const users = await createUsers(accounts);
    logInfo('created', 'user', users.length);

    const { action, object, count } = await takeAction(users);
    logInfo(action, object, count);

    const deletedUsers = await deleteUsers(users);
    logInfo('deleted', 'user', deletedUsers.filter(u => u).length);
  }
};

const takeAction = async (users) => {
  switch (process.env.MODE) {
    case 'CREATE':
      return create(users);
    case 'DELETE':
      return del(users);
  }
}

start();
