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
      switch (state.mode) {
        case 'auto': {
          // mongooseModel.updateOne({ stateName: 'temperature' }, { mode: 'auto', minTemp: state.minTemp, maxTemp: state.maxTemp }, { upsert: true }).then(() => {
          //   return res.send({ success: true, message: "Document updated!" });
          // });
          mongooseModel.updateOne({ stateName: 'temperature' }, { mode: 'auto' }, { upsert: true })
            .then((newState) => {

              return res.send({ data: newState, success: true, message: "Document updated!" });
            })
            .catch(callBackForCatch.bind(null, res));
        }
        case 'manual': {
          // mongooseModel.updateOne({ stateName: 'temperature' }, { mode: 'manual', manualTemp: state.manualTemp }, { upsert: true }).then(() => {
          //   return res.send({ success: true, message: "Document updated!" });
          // });
          mongooseModel.updateOne({ stateName: 'temperature' }, { mode: 'manual' }, { upsert: true })
            .then((newState) => {

              return res.send({ data: newState, success: true, message: "Document updated!" });
            })
            .catch(callBackForCatch.bind(null, res));
        }
      }
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
  console.errorr(err);

  return res.send({
    success: false,
    message: err
  })
}