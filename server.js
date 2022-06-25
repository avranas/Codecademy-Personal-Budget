const {Envelope} = require('./Envelope.js');
const express = require('express');
const app = express();
const port = 3000
const envelopeRouter = express.Router();
const transferRouter = express.Router();
const envelopes = require('./envelopes');
const transactions = require('./transactions');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.json());
app.use('/envelope', envelopeRouter);
app.use('/transaction', transferRouter);

envelopeRouter.get('/', envelopes.getEnvelopes);
envelopeRouter.get('/:id', envelopes.getEnvelope);
envelopeRouter.delete('/:id', envelopes.deleteEnvelope);
envelopeRouter.post('/', envelopes.createEnvelope);
envelopeRouter.put('/:id/:balance', envelopes.updateBalance);
envelopeRouter.post('/transfer/:sending/:receiving/:amount', envelopes.transferMoney);
transferRouter.get('/', transactions.getTransfers);
transferRouter.get('/:id', transactions.getTransfer);
transferRouter.put('/:id', transactions.updateTransaction);
transferRouter.delete('/:id', transactions.deleteTransaction);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});