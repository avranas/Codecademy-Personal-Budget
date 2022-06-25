const {pool} = require('./db-config.js');

//Get all transfers
const getTransfers = async(req, res) => {
   try{
      const results = await pool.query(`SELECT * FROM transactions`);
      if(results){
         res.status(200).json(results.rows);
      }else{
         res.status(400).send('Something bad happened');
      }
   }catch(err){
      console.log(err);
   }
}

//Get one transfer by ID
const getTransfer = async(req, res) => {
   try{
      const id = req.params.id;
      const results = await pool.query(
         `SELECT * FROM transactions WHERE id = $1`,
         [id]
      );
      if(results){
         res.status(200).json(results.rows[0]);
      } else {
         res.status(400).send('Something bad happened');
      }
   }catch(err){
      console.log(err);
   }
}

/*
   Update date
   Example: Give transaction with ID#7 a new date = '2022-06-21'
   http://localhost:3000/transaction/7/?newDate=2022-06-21
   OR
   //Update amount
   Example: Give transaction with ID#7 a new amount = 42
   http://localhost:3000/transaction/7/?newAmount=42 
*/
const updateTransaction = async(req, res) => {
   try{
      const id = req.params.id;
      const newDate = req.query.newDate;
      const newAmount = req.query.newAmount;
      let results = null;
      //If 'newDate' data was entered, update the date
      if(newDate){
         results = await pool.query(
            `UPDATE transactions SET date = $1 WHERE id = $2 RETURNING *;`,
            [newDate, id]
         );
      }
      //If 'newAmount' data was entered, update the amount
      if(newAmount){
         results = await pool.query(
            `UPDATE transactions SET amount = $1 WHERE id = $2 RETURNING *;`,
            [newAmount, id]
         );
      }
      if(results){
         res.status(202).send(results.rows[0]);
      }else{
         res.status(400).send('An error occured while updating the transaction');
      }
   }catch(err){
      console.log(err);
   }
}

//Delete a transaction
const deleteTransaction = async(req, res) => {
   try{
      const id = req.params.id;
      const results = await pool.query(
         `DELETE FROM transactions WHERE id = $1 RETURNING *;`,
         [id]
      );
      const deletedTransaction = results.rows[0];
      if(deletedTransaction)
         res.status(202).send(`Transaction deleted with ID: ${id}`);
      else
         res.status(404).send('Transaction not found!');
   }catch(err){
      console.log(err);
   }
}

module.exports = {
   getTransfers,
   getTransfer,
   updateTransaction,
   deleteTransaction
}