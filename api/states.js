const express = require('express');
const router = express.Router();


module.exports = (mongooseModel, socketConnection) => {

  router.get('/getAllStates', (req, res) => {

    mongooseModel
      .find()
      .then(callBackForGetAllStates.bind(null, res))
      .catch(callBackForCatch.bind(null, res));
  });

  router.post('/update', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const state = JSON.parse(req.body.state);

    socketConnection.emit('checkbox state', state.stateValue);


    if (state.stateName === 'temperature') {
      mongooseModel.findOne({ stateName: 'temperature' }).exec((err, result) => {
        if (err) {
          console.error(err);

          return res.send({
            success: false,
            message: err
          })
        }
        if (result) {
          switch (state.mode) {
            case 'auto': {
              result.mode = 'auto';
              result.minTemp = state.minTemp;
              result.maxTemp = state.maxTemp;

              result.save();

              return res.send({ success: true, message: "Document updated!" });
            }
            case 'manual': {
              result.mode = 'manual';
              result.manualTemp = state.manualTemp;

              result.save();

              return res.send({ success: true, message: "Document updated!" });
            }
            default: {
              return res.send({ success: false, message: "Mode not found" });
            }
          }
        } else {
          return res.send({ success: false, message: "Document not found" });
        }
      })
    }

  });

  router.get('/getState/:state', (req, res) => {

    const stateName = req.params.state;

    mongooseModel
      .findOne({ stateName })
      .then(callBackForGetState.bind(null, res))
      .catch(callBackForCatch.bind(null, res));
  });

  return router;
}

function callBackForGetState(res, state) {
  return res.send({
    data: state,
    success: true,
    message: ""
  });
}

function callBackForGetAllStates(res, states) {
  return res.send({
    data: states,
    success: true,
    message: ""
  });
}

function callBackForCatch(res, err) {
  console.error(err);

  return res.send({
    success: false,
    message: err
  })
}