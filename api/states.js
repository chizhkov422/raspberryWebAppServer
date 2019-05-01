const express = require('express');
const router = express.Router();


module.exports = (mongooseModel, socketConnection) => {

  router.get('/getAllStates', (req, res) => {

    mongooseModel
      .find()
      .then(callBackForGetAllStates.bind(null, res));
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
          mongooseModel.findOneAndUpdate({ stateName: 'temperature' }, { mode: 'auto' }, { new: true }).then((err, state) => {
            if (err) return console.error(err);

            return res.send({ data: state, success: true, message: "Document updated!" });
          });
        }
        case 'manual': {
          // mongooseModel.updateOne({ stateName: 'temperature' }, { mode: 'manual', manualTemp: state.manualTemp }, { upsert: true }).then(() => {
          //   return res.send({ success: true, message: "Document updated!" });
          // });
          console.log('MANUAL')
          mongooseModel.findOneAndUpdate({ stateName: 'temperature' }, { mode: 'manual' }, { new: true }).then((err, state) => {
            if (err) return console.error(err);
            console.log('BEFORE RETURN', state)
            return res.send({ data: state, success: true, message: "Document updated!" });
          });
        }
      }
    }

  });

  router.get('/getState/:state', (req, res) => {

    const stateName = req.params.state;

    mongooseModel
      .findOne({ stateName })
      .then(callBackForGetState.bind(null, res));
  });

  return router;
}

function callBackForGetState(res, state) {
  try {
    return res.send({
      data: state,
      success: true,
      message: ""
    });
  } catch (err) {
    console.error(err);
  }
}

function callBackForGetAllStates(res, states) {
  try {
    return res.send({
      data: states,
      success: true,
      message: ""
    });
  } catch (err) {
    console.error(err);
  }
}