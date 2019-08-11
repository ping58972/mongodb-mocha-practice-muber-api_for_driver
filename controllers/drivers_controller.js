const Driver = require('../models/driver');
module.exports = {
  greeting(req, res) {
    res.send({ hi: 'there' });
  },
  index(req, res, next) {
    const { lng, lat } = req.query;
    // 'Ex: http://google.com?lng=80&lat=20' ( '?' is query, after '?' lng = 80, lat = 20)
    // Driver.geoNear(
    //   { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
    //   { spherical: true, maxDistance: 200000 }
    // )
    //   .then(drivers => res.send(drivers))
    //   .catch(next);
    const point = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    Driver.aggregate([
      {
        $geoNear: {
          near: point,
          spherical: true,
          maxDistance: 200000,
          distanceField: 'dist.calculated'
        }
      }
    ])
      .then(drivers => {
        res.send(drivers);
      })
      .catch(next);
  },
  create(req, res, next) {
    // const driverProps = req.body;
    // const driver = new Driver(driverProps);
    // driver.save().then(driver => res.send(driver));
    Driver.create(req.body)
      .then(driver => res.send(driver))
      .catch(next);
  },
  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
      .then(() => Driver.findById({ _id: driverId }))
      .then(driver => res.send(driver))
      .catch(next);
  },
  delete(req, res, next) {
    const driverId = req.params.id;
    Driver.findByIdAndRemove({ _id: driverId })
      .then(driver => res.status(204).send(driver))
      .catch(next);
  }
};
