const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'username';
    const body = 'Message body text';
    const message = generateMessage(from, body);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, body });
  });
});
