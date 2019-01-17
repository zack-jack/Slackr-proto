const moment = require('moment');

const generateMessage = (from, body) => {
  return {
    from,
    body,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage };
