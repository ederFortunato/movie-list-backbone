define([
  // Application.
  "app",

  "crud",

  "backbone"
],

function (app, Crud, Backbone) {
  "use strict";

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "edit/:id": "editMovie",
      "delete/:id": "deleteMovie"
    },

    index: function () {

    },

    initialize: function () {

      this._collection  = new Crud.Collection();

      // Use main layout and set Views.
      app.useLayout("main");

      app.layout.setViews({
        "#list-container": new Crud.Views.List({
          'id': 'list-view',
          collection: this._collection
        }),
        "#form-container": new Crud.Views.Form({
          'id': 'form-view',
          collection: this._collection
        })
      });

      // Use the main layout.
      app.useLayout("main").render();

      this._collection.fetch();

    },

    editMovie: function (id) {
      var models = this._collection.where({cod: Number(id)});
      if (models.length > 0) {
        this._collection.trigger('edit', models[0]);
      }
    },

    deleteMovie: function (id) {
      var models = this._collection.where({cod: Number(id)});
      if (models.length > 0) {
        models[0].destroy();
      }
      this.navigate('/');
    }
  });

  return Router;

});
