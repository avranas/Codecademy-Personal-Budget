//Takes a number from 0-1 and returns a percentage in the XX.XX% notation
function percentageAsText(value){
   if(this._max === 0)
      return '0.00%'
   let num = (value * 100).toFixed(2);
   let text = num.toString();
   text += '%';
   return text;
}

//Is this good practice? Does JS really have no static variable support?
let idCounter = 0;

class Envelope{
   constructor(categoryName, initBalance){
      this._id = idCounter;
      this._balance = initBalance;
      this._category = categoryName;
      idCounter++;
      if(initBalance < 0){
         console.log(`Invalid entry on initBalance for new envelope named: "${categoryName}" Setting max to 0`)
         this._max = 0;
      }
   }
   get id(){
      return this._id;
   }
   get categoryName(){
      return this._category;
   }
   get moneyInside(){
      return this._balance;
   }
   get percentage(){
      return percentageAsText(this._balance / this._max);
   }
   updateCategory(newName){
      this._category = newName;
   }
   //Returns false if balance is insufficient
   updateBalance(newBalance){
      if(!this.hasSufficientFunds(newBalance)){
         console.log('Unable to update balance');
         return false;
      }
      this._balance = newBalance;
      return true;
   }
   //For sending and recieving between Envelopes
   //Adds to max and balance
   recieveMoney(amount){
      this._balance += amount;
   }
   //Returns true if successful
   loseMoney(amount){
      return this.updateBalance(this._balance - amount);
   }

   hasSufficientFunds(amount){
      if(amount < 0){
         console.log('Insufficient funds')
         return false;
      }
      return true;
   }
}

//A lot of this shit just never got used lmao

//Adds up all the money from Envelope[] and returns amount of money inside
function totalMoney(envelopes){
   let amount = 0;
   envelopes.forEach(i => {
      amount += i.moneyInside;
   });
   return amount;
}

//Adds up max of each Envelope and returns the total
function totalBudget(envelopes){
   let amount = 0;
   envelopes.forEach(i => {
      amount += i.max;
   });
   return amount;
}

//Returns percentage of entire budget
function budgetPercentage(envelopes) {
   let money = totalMoney(envelopes);
   let budget = totalBudget(envelopes);
   return percentageAsText(money / budget);
}

//Put in (Envelope[], id), returns first id that matches 
function getEnvelopeById(envs, num){
   return envs.find(i => {
      return i.id === Number(num);
   });
}

module.exports = {Envelope, totalMoney, totalBudget, budgetPercentage, getEnvelopeById};