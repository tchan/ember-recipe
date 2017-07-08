import Ember from 'ember';

// const fractionSymbols = {
//   "⅛": "1/8",
//   "¼": "1/4",
//   "⅓": "1/3",
//   "⅜": "3/8",
//   "½": "1/2",
//   "⅝": "5/8",
//   "⅔": "2/3",
//   "¾": "3/4",
//   "⅞": "7/8",
//
// };

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

const butterCupPerGram = 226.8;

const whiteSugarCupPerGram = 225;

//Keep in mind there are multiple types of sugar, needs adjusting later, currently only accounts for white
function hasSugar(arr) {
  return arr.includes('sugar');
}

function hasFlour(arr) {
  return arr.includes('flour');
}
// All purpose flour
const flourCupPerGram = 125;

const cocoaPowderPerGram = 100;

function hasCocoaPowder(arr) {
    arr = arr.join(" ");
    if (arr.includes('cocoa') && arr.includes('powder')) {
      return true;
    }
}

export default Ember.Controller.extend({
  title: null,
  convertedRecipe: "Click convert!",
  example: "Paste and make sure your recipe here like this:\n8 ounces good-quality chocolate \n¾ cup butter, melted \n¼ cups sugar\n2 eggs\n2 teaspoons vanilla\n¾ cup all-purpose flour\n¼ cup cocoa powder\n1 teaspoon salt",

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
      // console.log('initial recipeArr', recipeArr);

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
          // console.log(ounce);
          let ounceValue = ounce - 1;
          recipeElement[ounceValue] = (gramsPerOunce*eval(recipeElement[ounceValue])).toFixed(0);
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
            // console.log('buttercup valueArr:', butterCupValue.split(" "));

            // accounts for  something lines starting with 1¾ -> ["1", "3/4"]
            if (butterCupValue.split(" ").length > 1) {
              butterCupValue = butterCupValue.split(" ").join("+");
              // console.log('eval new ', eval(butterCupValue));
            }
            // console.log('butterCupPerGram', butterCupPerGram);
            // console.log('buttercup value:', (eval(butterCupValue)*butterCupPerGram).toFixed(0));
            recipeElement[butterCupValueIndex] = (eval(butterCupValue)*butterCupPerGram).toFixed(0);
            recipeElement[butterCup] = "grams";
            recipeArr[i] =  recipeElement.join(" ");

          }
        }

        if (hasSugar(recipeElement)) {
          if (hasCup(recipeElement)) {
            // console.log('recipe element:', recipeElement);
            let cupIndex = hasCup(recipeElement);
            // account for recipes like "1 1/2 cups sugar"
            if (cupIndex >1 && !isNaN(recipeElement[0])) {
              //combine the two into a single element
              // console.log('recipe0', recipeElement[0]);
              // console.log('recipe1', recipeElement[1]);
              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              // remove double blank space due to bad code
              combinedElement = combinedElement.replace(/  +/g, ' ');
              // console.log('combinedElement', combinedElement);
              recipeElement[1] = combinedElement;
              recipeElement.shift();
              // console.log('recipeElementvs', recipeElement);
              cupIndex = hasCup(recipeElement);
            }

            // console.log('cupindex', cupIndex);
            let cupValueIndex = cupIndex - 1;

            // accounts for something like ¾ cup rather than 1¾
            if (recipeElement[cupValueIndex][0] == " ") {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].trim();
            }

            if (recipeElement[cupValueIndex].split(" ").length >1 ) {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].split(" ").join("+");
            }
            // console.log('recipeele', recipeElement);
            // console.log('cupValue', eval(recipeElement[cupValueIndex].split(" ").join("+")));
            // console.log('cupValue index:',cupValueIndex);
            recipeElement[cupValueIndex] = (eval(recipeElement[cupValueIndex])*whiteSugarCupPerGram).toFixed(0);
            recipeElement[cupIndex] = "grams";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

        if (hasFlour(recipeElement)) {
          // console.log(recipeElement);
          if (hasCup(recipeElement)) {
            let cupIndex = hasCup(recipeElement);
            let cupValueIndex = cupIndex - 1;
            if (recipeElement[cupValueIndex][0] == " ") {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].trim();
            }

            if (recipeElement[cupValueIndex].split(" ").length >1 ) {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].split(" ").join("+");
            }

            recipeElement[cupValueIndex] = (eval(recipeElement[cupValueIndex])*flourCupPerGram).toFixed(0);
            recipeElement[cupIndex] = "grams";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

        if (hasCocoaPowder(recipeElement)) {
          if (hasCup(recipeElement)) {
            let cupIndex = hasCup(recipeElement);
            let cupValueIndex = cupIndex - 1;
            if (recipeElement[cupValueIndex][0] == " ") {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].trim();
            }

            if (recipeElement[cupValueIndex].split(" ").length >1 ) {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].split(" ").join("+");
            }

            recipeElement[cupValueIndex] = (eval(recipeElement[cupValueIndex])*cocoaPowderPerGram).toFixed(0);
            recipeElement[cupIndex] = "grams";
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
