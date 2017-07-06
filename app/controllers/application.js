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
      // console.log('initial recipeArr', recipeArr);
      // console.log(recipeArr);
      // console.log(recipeArr.length);
      //loop through each element and convert if needed
      for (var i=0; i<recipeArr.length; i++) {
        // console.log(recipeArr[i]);
        // each line as a new array
        let recipeElement = recipeArr[i].split(" ");
        // console.log(recipeElement);

        // Convert ounce value to grams
        if (checkIfOunces(recipeElement)) {
          let ounce = checkIfOunces(recipeElement);
          let ounceValue = checkIfOunces(recipeElement) - 1;
          // console.log('recipeElement:', recipeElement);
          recipeElement[ounceValue] = (gramsPerOunce*recipeElement[ounceValue]).toFixed(0);
          recipeElement[ounce] = "grams";
          // console.log('updated recipeElement:', recipeElement[ounceValue]);
          // console.log('recipeElement:', recipeElement);
          // console.log('recipeArr[i].split():', recipeArr[i].split(" "));
          recipeArr[i] =  recipeElement.join(" ");
          // console.log('updated recipeArr[i]', recipeArr[i]);
        }

      }

      //final conversion output
      Ember.set(this, 'convertedRecipe', recipeArr.join("\n"));
    } //end convert recipe function
  }

});
