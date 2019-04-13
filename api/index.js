const express = require('express');
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();


module.exports = (collectionStates = null) => {

  router.post('/update', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const state = JSON.parse(req.body.state);

    for (let key in state) {
      collectionStates.update({ stateName: key }, { stateName: key, stateValue: state[key] }, { upsert: true }).then(() => {
        return res.send({
          success: true,
          message: "Document updated!"
        });
      })
    }

  });

  router.get('/getAllStates', (req, res) => {

    collectionStates
      .find()
      .toArray(callBackForGetAllStates.bind(null, res));
  });

  router.get('/getState/:state', (req, res) => {

    const stateName = req.params.state;

    collectionStates
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
      message: "Document updated!"
    });
  } catch (err) {
    console.error(err);
  }
}

function callBackForGetAllStates(res, err, states) {
  try {
    return res.send({
      data: states,
      success: true,
      message: "Document updated!"
    });
  } catch (err) {
    console.error(err);
  }
}