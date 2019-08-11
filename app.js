const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}
// Watch for icoming requests of method GET
// to the route http://localhost:3050/api
// app.get('/api', (req, res, next) => {
//   res.send({ hi: 'there' });
// });
// app.post('/api');
app.use(bodyParser.json());
routes(app);
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});
module.exports = app;
