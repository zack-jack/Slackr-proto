const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../client/public');

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
