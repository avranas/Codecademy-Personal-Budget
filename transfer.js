const {pool} = require('./db-config.js');

/*
   Transfer money from one envelope to another
   Also adds an entry to the transactions table
   Example - Transfers $200 from id#0 to id#1
   http://localhost:3000/transfer/0/1/200
*/
const transferMoney = async(req, res, next) => {
   try{
      const sendingID = req.params.sending;
      const receivingID = req.params.receiving;
      const amount = req.params.amount;
      //Get envelope data
      const sendingEnvelope = await pool.query(`
         SELECT * FROM envelopes WHERE id = $1;`,
         [sendingID]
      );
      const receivingEnvelope = await pool.query(`
         SELECT * FROM envelopes WHERE id = $1;`,
         [receivingID]
      );
      //Check for proper data entry
      if(sendingEnvelope.rows.length === 0 || receivingEnvelope.rows.length === 0){
          res.status(400).send("Invalid envelope entry")
       }
       if(sendingEnvelope.rows[0].id === receivingEnvelope.rows[0].id){
         res.status(400).send("You can not send money to the same envelope")
       }
      const sendingBalance = sendingEnvelope.rows[0].amount;
      const receivingBalance = receivingEnvelope.rows[0].amount;
      //Check for a sufficient balance
      if(sendingBalance < amount){
         res.status(400).send("Sending envelope does not have a sufficient balance");
      }else{
         //Update sending envelope
         await pool.query(`
            UPDATE envelopes SET amount = $1 WHERE id = $2;`,
            [Number(sendingBalance) - Number(amount), sendingID]
         );
         //Update receiving envelope
         await pool.query(`
            UPDATE envelopes SET amount = $1 WHERE id = $2;`,
            [Number(receivingBalance) + Number(amount), receivingID]
         );
         //Add to the transactions table
         await pool.query(
            `INSERT INTO transactions (date, amount, sender_id, recipient_id) VALUES (
               $1, $2, $3, $4
               );`,
               [
                  new Date().toJSON().slice(0,10).replace(/-/g,'-'),
                  amount,
                  sendingID,
                  receivingID
               ]
         );
         const reply = `Sent $${amount} from envelope with ID:${sendingID} to envelope with ID:${receivingID}`;
         res.status(202).send(reply);
      }
   }catch(err){
      res.status(404).send(err);
   }
}

module.exports = {
   transferMoney
};
