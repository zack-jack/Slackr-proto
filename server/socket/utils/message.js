const generateMessage = (from, body) => {
  return {
    from,
    body,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessage };
