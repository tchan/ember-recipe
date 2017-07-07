import Ember from 'ember';

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
  if (arr.includes('butter')) {
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
  "⅛": 28.4,
  "¼": 56.7,
  "⅓": 75.6,
  "⅜": 85,
  "½": 113.4,
  "⅝": 141.8,
  "⅔": 151.2,
  "¾": 170.1,
  "⅞": 198.5,
  "1": 226.8
};

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
        // console.log(recipeArr[i]);
        // each line as a new array
        let recipeElement = recipeArr[i].split(" ");
        console.log(recipeElement);

        // Convert ounce value to grams if exists
        if (checkIfOunces(recipeElement)) {
          let ounce = checkIfOunces(recipeElement);
          let ounceValue = ounce - 1;
          recipeElement[ounceValue] = (gramsPerOunce*recipeElement[ounceValue]).toFixed(0);
          recipeElement[ounce] = "grams";
          recipeArr[i] =  recipeElement.join(" ");
        }

        // console.log('recipeElement: ', recipeElement);
        if (hasButter(recipeElement)) {
          // Convert cups to grams
          // figure out the index of cup / other
          if (hasCup(recipeElement)) {
            let butterCup = hasCup(recipeElement);
            let butterCupValueIndex = butterCup - 1;
            let butterCupValue = recipeElement[butterCup - 1];
            recipeElement[butterCupValueIndex] = butterCups[butterCupValue].toFixed(0);
            recipeElement[butterCup] = "grams";
            recipeArr[i] =  recipeElement.join(" ");

          }
        }

        if (hasSugar(recipeElement)) {
          console.log('has sugar: ',hasSugar(recipeElement));
          if (hasCup(recipeElement)) {

            let cupIndex = hasCup(recipeElement);
            console.log('cupindex', cupIndex);
            let cupValueIndex = cupIndex - 1;
            console.log('cupValue', recipeElement[cupValueIndex]);
            recipeElement[cupIndex] = "grams";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

      }

      //final conversion output
      Ember.set(this, 'convertedRecipe', recipeArr.join("\n"));
    } //end convert recipe function
  }

});
