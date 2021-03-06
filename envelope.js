const { toValueOrError } = require('mocha/lib/runnable');
const {pool} = require('./db-config.js');

//Get all envelopes
const getEnvelopes = async (request, response) => {
   try{
      const results = await pool.query('SELECT * FROM envelopes;');
      if(results){
         response.status(200).send(results.rows);
      }else{
         response.status(400).send("Couldn't get all envelopes");
      }
   }catch(err){
      console.log(err);
   }
 }

 //Get one envelope with ID
 const getEnvelope = async (req, res, next) => {
    try{
      const id = req.params.id;
      const results = await pool.query(
         `SELECT * FROM envelopes WHERE id = $1;`,
         [id]
      );
      const gotEnvelope = results.rows[0];
      if(gotEnvelope)
         res.status(200).send(gotEnvelope);
      else
         res.status(404).send('Envelope not found!');
   }catch(err){
       console.log(err);
    }
};

//Delete an envelope with ID
const deleteEnvelope = async (req, res, next) => {
   try{
      const id = parseInt(req.params.id)
      const results = await pool.query(
         `DELETE FROM envelopes WHERE id = $1 RETURNING *;`,
         [id]
      );
      const deletedEnvelope = results.rows[0];
      if(deletedEnvelope)
         res.status(202).send(`Envelope deleted with ID: ${id}`);
      else
         res.status(404).send('Envelope not found!');
   }
   catch(err){
      console.log(err);
   }
};

//Create new envelope
//Example: http://localhost:3000/envelope/?name=Investing&amount=1500
const createEnvelope = async (req, res, next) => {
   try{
      const newName = req.query.name;
      const newAmount = req.query.amount;
      const results = await pool.query('INSERT INTO envelopes (name, amount) VALUES ($1, $2) RETURNING *',
         [newName, newAmount],
      );
      const newEnvelope = results.rows[0];
      if(newEnvelope){
         res.status(201).send(newEnvelope);
      }else{
         res.status(400).send("Something went wrong");
      }
   }catch(err){
      res.status(400).send(err);
   }
};

/*
   Update specific envelopes with a new balance.
   It can also update the category name with ?newName= query
   Example - Give id#7 a $1000 budget
   http://localhost:3000/envelope/7/1000
   Example - Same as above, but also changes the name to 'Savings'
   http://localhost:3000/envelope/7/1000/?newName=Savings
   I know it's weird to have both of these in one path, but it's what the project asked for
*/
const updateEnvelope = async (req, res, next) => {
   try{
      const id = req.params.id;
      const newName = req.query.newName;
      const newBalance = req.params.balance;
      let results = null;
      if(newName){
         results = await pool.query(`UPDATE envelopes SET name = $1 WHERE id = $2 RETURNING *;`,
            [newName, id]
         );
      }
      results = await pool.query(`UPDATE envelopes SET amount = $1 WHERE id = $2 RETURNING *;`,
         [newBalance, id]
      );
      const updatedEnvelope = results.rows[0];
      if(updatedEnvelope){
         res.status(202).send(updatedEnvelope);
      }else{
         res.status(404).send('Envelope not found!');
      }
   }catch(err){
      console.log(err);
   }
}

module.exports = {
   getEnvelopes,
   getEnvelope,
   deleteEnvelope,
   createEnvelope,
   updateEnvelope,
};
