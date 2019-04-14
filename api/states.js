const express = require('express');
const router = express.Router();


module.exports = (mongooseModel) => {

  router.get('/getAllStates', (req, res) => {

    mongooseModel
      .find()
      .then(callBackForGetAllStates.bind(null, res));
  });

  router.post('/update', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const state = JSON.parse(req.body.state);

    mongooseModel.updateOne({ stateName: state.stateName }, { stateValue: state.stateValue }, { upsert: true }).then(() => {
      return res.send({
        success: true,
        message: "Document updated!"
      });
    });

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