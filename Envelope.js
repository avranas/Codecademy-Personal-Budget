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
   constructor(categoryName, moneyAmount){
      this._id = idCounter;
      this._max = moneyAmount;
      this._moneyInside = moneyAmount;
      this._category = categoryName;
      idCounter++;
      if(moneyAmount < 0){
         console.log(`Invalid entry on moneyAmount for new envelope named: "${categoryName}" Setting max to 0`)
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
      return this._moneyInside;
   }
   get max(){
      return this._max;
   }

   //Returns string showing the percentage of money in the envelope rounded to 2 decimal places
   get percentage(){
      return percentageAsText(this._moneyInside / this._max);
   }
}

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