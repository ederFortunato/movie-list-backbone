define(['../../../app/app', '../../../app/Crud'], function() {

  var app = require("app"),
    lastMovie,
    _collection,
    formView;

  describe("Tests for Movie List Backbone", function() {

    beforeEach(function() {
      _collection = app.router._collection;
      formView = getView('form-view');

      if(_collection.models.length > 0){
        lastMovie = _collection.models[_collection.models.length-1];
      }

      //prevent change URL
      app.router.navigate = function(){};
    });

    it("Add Movie", function(){
      var prevTotal = _collection.length;

      formView.$el.find('#txtTitle').val('movie test');
      formView.confirmSave();

      expect(prevTotal + 1).toBe(_collection.length);
    });

    it("Edit Movie", function(){
      var newName = 'movie 2',
        oldName = lastMovie.get('title'),
        model;

      app.router.editMovie(lastMovie.get('cod'));
      formView.$el.find('#txtTitle').val(newName);
      formView.confirmSave();

      model = _collection.where({cod: lastMovie.get('cod')})[0];

      expect(newName).toBe(model.get('title'));

    });

    it("Delete Movie", function(){
      var prevTotal = _collection.length;

      app.router.deleteMovie(lastMovie.get('cod'));

      expect(prevTotal-1).toBe(_collection.length);

    });

    function getView(id){
      return app.layout.getView(function(view) {
          return view.id === id;
      });
    }
  });
});
