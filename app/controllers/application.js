import Ember from 'ember';
export default Ember.Controller.extend({
  title: null,
  post: null,

  actions: {
    publishNewPost() {
      this.store.createRecord('post', {
        title: this.get('title'),
        body: this.get('post'),
        author: this.get('author')
      }).save();
      Ember.set(this, 'title', '');
      Ember.set(this, 'post', '');
    },

    deletePost(post) {
      post.destroyRecord();
    }
  }

});
