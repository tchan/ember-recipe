import Ember from 'ember';

//water
const mlsPerCup = 250;

const gramsPerOunce = 28.3495;

//butter
const butterCupPerGram = 226.8;
const butterTbspPerGram = 14.18;

const whiteSugarCupPerGram = 225;

//tablespoon (US) vanilla extract
const vanillaExtractMlPerTbsp = 14.79;

// All purpose flour
const flourCupPerGram = 125;

const cocoaPowderPerGram = 100;

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

function hasVanillaExtract(arr) {
  arr = arr.join(" ");
  if  (arr.includes('vanilla extract')) {
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

function hasTablespoon(arr) {
  if (arr.includes('tablespoons')) {
    return arr.indexOf('tablespoons');
  }
  if (arr.includes('tablespoon')) {
    return arr.indexOf('tablespoon');
  }
}

//Keep in mind there are multiple types of sugar, needs adjusting later, currently only accounts for white
function hasSugar(arr) {
  return arr.includes('sugar');
}

function hasFlour(arr) {
  return arr.includes('flour');
}

function hasCocoaPowder(arr) {
    arr = arr.join(" ");
    if (arr.includes('cocoa') && arr.includes('powder')) {
      return true;
    }
}

function hasLiquid(arr) {
  arr = arr.join(" ");
  if (arr.includes('water') || arr.includes('milk') || arr.includes('juice')) {
    return true;
  }
}

function replaceFractionSymbol(recipeElement) {
  recipeElement = recipeElement.replace(/⅛/gi, " 1/8");
  recipeElement = recipeElement.replace(/¼/gi, " 1/4");
  recipeElement = recipeElement.replace(/⅓/gi, " 1/3");
  recipeElement = recipeElement.replace(/⅜/gi, " 3/8");
  recipeElement = recipeElement.replace(/½/gi, " 1/2");
  recipeElement = recipeElement.replace(/⅝/gi, " 5/8");
  recipeElement = recipeElement.replace(/⅔/gi, " 2/3");
  recipeElement = recipeElement.replace(/¾/gi, " 3/4");
  recipeElement = recipeElement.replace(/⅞/gi, " 7/8");
  return recipeElement;
}

export default Ember.Controller.extend({
  title: null,
  convertedRecipe: "Click convert!",
  example: "Make sure your recipe is similar to this:\n8 ounces good-quality chocolate \n¾ cup butter, melted \n¼ cups sugar\n2 eggs\n2 teaspoons vanilla\n¾ cup all-purpose flour\n¼ cup cocoa powder\n1 teaspoon salt",

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

      //first replace fraction symbols

      //loop through each element and convert if needed
      console.log('recipeArr', recipeArr);
      for (var i=0; i<recipeArr.length; i++) {
        // each line as a new array
        let recipeElement = recipeArr[i].split(" ");

        //replace symbol fractions
        for (var j=0; j<recipeElement.length; j++) {
          recipeElement[j] = replaceFractionSymbol(recipeElement[j]);
        }
        recipeArr[i] =  recipeElement.join(" ");

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

          if (hasTablespoon(recipeElement)) {
            let butterTablespoon = hasTablespoon(recipeElement);
            let butterTablespoonValueIndex = butterTablespoon - 1;
            let butterTablespoonValue = recipeElement[butterTablespoonValueIndex];

            if (butterTablespoonValue[0] == " ") {
              butterTablespoonValue = butterTablespoonValue.trim();
            }

            if (butterTablespoonValue.split(" ").length > 1) {
              butterTablespoonValue = butterTablespoonValue.split(" ").join("+");
            }

            recipeElement[butterTablespoonValueIndex] = (eval(butterTablespoonValue)*butterTbspPerGram).toFixed(0);
            recipeElement[butterTablespoon] = "grams";
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
              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              // remove double blank space due to bad code
              // combinedElement = combinedElement.replace(/  +/g, ' '); linter complains about this one
              combinedElement = combinedElement.replace(/ {2}/g, ' ');
              recipeElement[1] = combinedElement;
              recipeElement.shift();

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
            recipeElement[cupValueIndex] = (eval(recipeElement[cupValueIndex])*whiteSugarCupPerGram).toFixed(0);
            recipeElement[cupIndex] = "grams";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

        if (hasFlour(recipeElement)) {
          if (hasCup(recipeElement)) {
            let cupIndex = hasCup(recipeElement);
            if (cupIndex >1 && !isNaN(recipeElement[0])) {

              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              combinedElement = combinedElement.replace(/ {2}/g, ' ');
              recipeElement[1] = combinedElement;
              recipeElement.shift();
              cupIndex = hasCup(recipeElement);
            }

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
            if (cupIndex >1 && !isNaN(recipeElement[0])) {

              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              combinedElement = combinedElement.replace(/ {2}/g, ' ');
              recipeElement[1] = combinedElement;
              recipeElement.shift();
              cupIndex = hasCup(recipeElement);
            }
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

        if (hasLiquid(recipeElement)) {
          if (hasCup(recipeElement)) {
            let cupIndex = hasCup(recipeElement);
            if (cupIndex >1 && !isNaN(recipeElement[0])) {

              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              combinedElement = combinedElement.replace(/ {2}/g, ' ');
              recipeElement[1] = combinedElement;
              recipeElement.shift();
              cupIndex = hasCup(recipeElement);
            }

            let cupValueIndex = cupIndex - 1;

            if (recipeElement[cupValueIndex][0] == " ") {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].trim();
            }

            if (recipeElement[cupValueIndex].split(" ").length >1 ) {
              recipeElement[cupValueIndex] = recipeElement[cupValueIndex].split(" ").join("+");
            }

            recipeElement[cupValueIndex] = (eval(recipeElement[cupValueIndex])*mlsPerCup).toFixed(0);
            recipeElement[cupIndex] = "ml";
            recipeArr[i] =  recipeElement.join(" ");
          }
        }

        if (hasVanillaExtract(recipeElement)) {
          if (hasTablespoon(recipeElement)) {
            let TablespoonIndex = hasTablespoon(recipeElement);
            if (TablespoonIndex >1 && !isNaN(recipeElement[0])) {
              let combinedElement = recipeElement[0] + " " + recipeElement[1];
              combinedElement = combinedElement.replace(/ {2}/g, ' ');
              recipeElement[1] = combinedElement;
              recipeElement.shift();
              TablespoonIndex = hasTablespoon(recipeElement);
            }

            let TablespoonValueIndex = TablespoonIndex - 1;
            if (recipeElement[TablespoonValueIndex][0] == " ") {
              recipeElement[TablespoonValueIndex] = recipeElement[TablespoonValueIndex].trim();
            }

            if (recipeElement[TablespoonValueIndex].split(" ").length >1 ) {
              recipeElement[TablespoonValueIndex] = recipeElement[TablespoonValueIndex].split(" ").join("+");
            }

            recipeElement[TablespoonValueIndex] = (eval(recipeElement[TablespoonValueIndex])*vanillaExtractMlPerTbsp).toFixed(0);
            recipeElement[TablespoonIndex] = "ml";
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
