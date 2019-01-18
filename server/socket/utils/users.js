[
  {
    id: '/&jfd&a0219721',
    name: 'User',
    channel: 'Test Channel'
  }
];

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, channel) {
    const user = { id, name, channel };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(channel) {
    const users = this.users.filter(user => user.channel === channel);
    const namesArray = users.map(user => user.name);

    return namesArray;
  }
}

module.exports = { Users };
