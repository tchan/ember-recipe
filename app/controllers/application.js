import Ember from 'ember';

const fractionSymbols = {
  "⅛": "1/8",
  "¼": "1/4",
  "⅓": "1/3",
  "⅜": "3/8",
  "½": "1/2",
  "⅝": "5/8",
  "⅔": "2/3",
  "¾": "3/4",
  "⅞": "7/8",

};
const gramsPerOunce = 28.3495;

function checkIfOunces(arr) {
    if (arr.includes('ounces')) {
      return arr.indexOf('ounces');
    }
    if (arr.includes('ounce')) {
      return arr.indexOf('ounce');
    }
    if (arr.includes('oz')) {
      return arr.indexOf('oz');
    }
}

function hasButter(arr) {
  arr = arr.join(" ");
  if (arr.includes('butter') && !arr.includes('peanut')) {
    return true;
  }
  else {
    return false;
  }
}

function hasCup(arr) {
  if (arr.includes('cup')) {
    return arr.indexOf('cup');
  }
  if (arr.includes('cups')) {
    return arr.indexOf('cups');
  }
}

const butterCups = {
  "1/8": 28.4,
  "1/4": 56.7,
  "1/3": 75.6,
  "3/8": 85,
  "1/2": 113.4,
  "5/8": 141.8,
  "2/3": 151.2,
  "3/4": 170.1,
  "7/8": 198.5,
  "1": 226.8
};

//Also known as white sugar
const whiteSugarCups = {
  "1/4": 50,
  "1/3": 66.7,
  "1/2": 100,
  "5/8": 125,
  "2/3": 133,
  "3/4": 150,
  "1": 200
};

//Keep in mind there are multiple types of sugar
function hasSugar(arr) {
  return arr.includes('sugar');
}

export default Ember.Controller.extend({
  title: null,
  convertedRecipe: "Click convert!",

  actions: {
    publishNewPost() {
      this.store.createRecord('recipe', {
        title: this.get('title'),
        body: this.get('post'),
        author: this.get('author')
      }).save();
      Ember.set(this, 'title', '');
      Ember.set(this, 'post', '');
    },

    deletePost(recipe) {
      recipe.destroyRecord();
    },

    convertRecipe(recipe) {
      let recipeArr = recipe.split("\n");
      console.log('initial recipeArr', recipeArr);

      //loop through each element and convert if needed
      for (var i=0; i<recipeArr.length; i++) {

        // each line as a new array
        let recipeElement = recipeArr[i].split(" ");
        // console.log(recipeElement);

        //replace symbol fractions
        for (var j=0; j<recipeElement.length; j++) {
          recipeElement[j] = recipeElement[j].replace(/⅛/gi, " 1/8");
          recipeElement[j] = recipeElement[j].replace(/¼/gi, " 1/4");
          recipeElement[j] = recipeElement[j].replace(/⅓/gi, " 1/3");
          recipeElement[j] = recipeElement[j].replace(/⅜/gi, " 3/8");
          recipeElement[j] = recipeElement[j].replace(/½/gi, " 1/2");
          recipeElement[j] = recipeElement[j].replace(/⅝/gi, " 5/8");
          recipeElement[j] = recipeElement[j].replace(/⅔/gi, " 2/3");
          recipeElement[j] = recipeElement[j].replace(/¾/gi, " 3/4");
          recipeElement[j] = recipeElement[j].replace(/⅞/gi, " 7/8");
          recipeArr[i] =  recipeElement.join(" ");
        }

        // Convert ounce value to grams if exists
        if (checkIfOunces(recipeElement)) {
          let ounce = checkIfOunces(recipeElement);
          let ounceValue = ounce - 1;
          recipeElement[ounceValue] = (gramsPerOunce*recipeElement[ounceValue]).toFixed(0);
          recipeElement[ounce] = "grams";
          recipeArr[i] =  recipeElement.join(" ");
        }


        if (hasButter(recipeElement)) {
          // Convert cups to grams
          // console.log('has butter');
          if (hasCup(recipeElement)) {
            let butterCup = hasCup(recipeElement);
            let butterCupValueIndex = butterCup - 1;
            let butterCupValue = recipeElement[butterCupValueIndex];

            if (butterCupValue[0] == " ") {
              butterCupValue = butterCupValue.trim();
            }
            // console.log('buttercup value:', butterCupValue);
            // console.log('buttercup value:', butterCups[butterCupValue]);
            recipeElement[butterCupValueIndex] = butterCups[butterCupValue].toFixed(0);
            recipeElement[butterCup] = "grams";
            recipeArr[i] =  recipeElement.join(" ");

          }
        }

        if (hasSugar(recipeElement)) {
          console.log('has sugar: ', hasSugar(recipeElement));
          if (hasCup(recipeElement)) {

            let cupIndex = hasCup(recipeElement);
            console.log('cupindex', cupIndex);
            let cupValueIndex = cupIndex - 1;
            console.log('recipeele', recipeElement);
            console.log('cupValue', recipeElement[cupValueIndex]);
            console.log('cupValue value:',whiteSugarCups[cupValueIndex]);
            // recipeElement[cupIndex] = "grams";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

        // console.log(recipeElement);
      } //end looping through each line of ingredient

      //final conversion output
      Ember.set(this, 'convertedRecipe', recipeArr.join("\n"));
    } //end convert recipe function
  }

});
