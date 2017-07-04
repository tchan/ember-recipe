import Ember from 'ember';

function checkIfOunces(arr) {
    if (arr.includes('ounces')) {
      return 'ounces';
    }
    if (arr.includes('ounce')) {
      return 'ounce';
    }
    if (arr.includes('oz')) {
      return 'oz';
    }
}

function ounceIndex(arr) {

}

export default Ember.Controller.extend({
  title: null,

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
      // console.log(recipeArr);
      // console.log(recipeArr.length);
      //loop through each element and convert if needed
      for (var i=0; i<recipeArr.length; i++) {
        // console.log(recipeArr[i]);
        // each line as a new array
        let recipeElement = recipeArr[i].split(" ");
        console.log(recipeElement);
        if (checkIfOunces(recipeElement)) {
          console.log('has ounces!');
        }
        
      }

    }
  }

});
