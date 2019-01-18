const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        channel: 'Slackr'
      },
      {
        id: '2',
        name: 'Joe',
        channel: 'Party'
      },
      {
        id: '3',
        name: 'Ted',
        channel: 'Slackr'
      }
    ];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'User',
      channel: 'Test Channel'
    };
    const resUser = users.addUser(user.id, user.name, user.channel);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    const userId = '1';
    const user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const userId = '991';
    const user = users.removeUser(userId);

    expect(user).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const userId = '3';
    const user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    const userId = '993';
    const user = users.getUser(userId);

    expect(user).toBeUndefined();
  });

  it('should return names for Slackr channel', () => {
    const userList = users.getUserList('Slackr');

    expect(userList).toEqual(['Mike', 'Ted']);
  });

  it('should return names for Party channel', () => {
    const userList = users.getUserList('Party');

    expect(userList).toEqual(['Joe']);
  });
});
