const {Envelope, totalMoney, totalBudget, budgetPercentage, getEnvelopeById} = require('./Envelope.js');
const express = require('express');
const { env } = require('process');
const app = express();
const port = 3000
let envelopes = [
   new Envelope('Take out', 600),
   new Envelope('Rent', 1000),
   new Envelope('Utilities', 200),
   new Envelope('Groceries', 200),
   new Envelope('Clothes', 200),
   new Envelope('Gas', 0),
   new Envelope('Subscriptions', 100),
   new Envelope('Other', 500)
];

//Make a function which adds up total money and shit -- probably in Envelope.js

//Test
app.get('/', (req, res, next) => {
  res.send('Hello World!')
});

//Get all envelopes
app.get('/envelope', (req, res, next) => {
   console.log(budgetPercentage(envelopes));
   res.status(200).send(envelopes);
});

//Get an envelope with a matching name
//Example: localhost:3000/envelope/id
//fyi this is how you put data into req.params <----Remember
app.get('/envelope/:id', (req, res, next) => {
   const gotEnvelope = getEnvelopeById(envelopes, req.params.id);
   if(gotEnvelope){
      res.status(200).send(gotEnvelope);
   }else{
      res.status(400).send();
   }
});

//Delete an envelope with matching id
app.delete('/envelope/:id', (req, res, next) => {
   let foundId = false;
   envelopes = envelopes.filter( i => {
      if(i.id === Number(req.params.id)){
         foundId = true;
         return false;
      }
      return true;
   });
   console.log(envelopes);
   if(foundId)
      res.status(202).send(envelopes);
   else
      res.status(400).send(envelopes);
});

//Create new envelope with query string
//envelope/?name=''&money=''
//fyi using a query string is how you put data into req.query <----Remember
app.post('/envelope/', (req, res, next) => {
   //check if both entries are completed. I feel like there has to be a better way to do this
   if(req.query.name && req.query.money){
      const newEnvelope = new Envelope(req.query.name, Number(req.query.money));
      envelopes.push(newEnvelope);
      console.log(envelopes);
      res.status(202).send(newEnvelope);
   }else{
      res.status(400).send();
   }
});



















app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});