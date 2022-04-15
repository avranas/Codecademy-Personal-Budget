const {Envelope, getEnvelopeById} = require('./Envelope.js');
const express = require('express');
const app = express();
const port = 3000
const envelopeRouter = express.Router();
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

app.use('/envelope', envelopeRouter);

//Make a function which adds up total money and shit -- probably in Envelope.js

//Test
app.get('/', (req, res, next) => {
  res.send('Hello World!')
});

//Get all envelopes
envelopeRouter.get('/', (req, res, next) => {
   res.status(200).send(envelopes);
});

//Get an envelope with a matching name
//Example: localhost:3000/envelope/id
//fyi this is how you put data into req.params <----Remember
envelopeRouter.get('/:id', (req, res, next) => {
   const gotEnvelope = getEnvelopeById(envelopes, req.params.id);
   if(gotEnvelope){
      res.status(200).send(gotEnvelope);
   }else{
      res.status(400).send();
   }
});

//Delete an envelope with matching id
envelopeRouter.delete('/:id', (req, res, next) => {
   let foundId = false;
   envelopes = envelopes.filter( i => {
      if(i.id === Number(req.params.id)){
         foundId = true;
         return false;
      }
      return true;
   });
   if(foundId)
      res.status(202).send(envelopes);
   else
      res.status(400).send(envelopes);
});

//Create new envelope with query string
//envelope/?name=''&money=''
//fyi using a query string is how you put data into req.query <----Remember
envelopeRouter.post('/', (req, res, next) => {
   //check if both entries are completed. I feel like there has to be a better way to do this
   if(req.query.name && req.query.money){
      const newEnvelope = new Envelope(req.query.name, Number(req.query.money));
      envelopes.push(newEnvelope);
      res.status(202).send(newEnvelope);
   }else{
      res.status(400).send();
   }
});

//I know this code is a little ugly, but it's what the project asked for, okay?
//Update specific envelopes with a new balance. Can also update the category name with ?newName='' query
envelopeRouter.put('/:id/:balance', (req, res, next) => {
   const gotEnvelope = getEnvelopeById(envelopes, req.params.id);
   if(gotEnvelope){
      if(req.query.newName){
         gotEnvelope.updateCategory(req.query.newName);
      }
      gotEnvelope.updateBalance(Number(req.params.balance));
      res.status(202).send(gotEnvelope);
   }else{
      res.status(400).send(gotEnvelope);
   }
});

//POST Transfer budgets from different envelopes
//Returns updated Envelope[]
envelopeRouter.post('/transfer/:from/:to/:amount', (req, res, next) => {
   const amount = Number(req.params.amount);
   const sendingEnvelope = getEnvelopeById(envelopes, req.params.from);
   const recievingEnvelope = getEnvelopeById(envelopes, req.params.to);
   //Returns false if unsuccessful
   if(sendingEnvelope.loseMoney(amount)){
      recievingEnvelope.recieveMoney(amount);
      res.status(202).send(envelopes);
   }else{
      console.log('Sending envelope does not have sufficient funds');
      res.status(400).send();
   }
   console.log(envelopes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});