const express = require('express');
const app = express();
const port = 3000
const envelopeRouter = express.Router();
const transactionRouter = express.Router();
const envelope = require('./envelope.js');
const transaction = require('./transaction.js');
const transfer = require('./transfer.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.json());
app.use('/envelope', envelopeRouter);
app.use('/transaction', transactionRouter);

app.post('/transfer/:sending/:receiving/:amount', transfer.transferMoney);
envelopeRouter.get('/', envelope.getEnvelopes);
envelopeRouter.get('/:id', envelope.getEnvelope);
envelopeRouter.delete('/:id', envelope.deleteEnvelope);
envelopeRouter.post('/', envelope.createEnvelope);
envelopeRouter.put('/:id/:balance', envelope.updateEnvelope);
transactionRouter.get('/', transaction.getTransactions);
transactionRouter.get('/:id', transaction.getTransaction);
transactionRouter.put('/:id', transaction.updateTransaction);
transactionRouter.delete('/:id', transaction.deleteTransaction);

app.listen(port, () => {
  console.log(`Starting Personal Budget. Listening on port ${port}`)
});