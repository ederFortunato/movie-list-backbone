define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone",

  "plugins/backbone.localstorage",
  "plugins/bootstrap-dropdown",
  "plugins/bootstrap-modal"
],
function (app, Backbone) {

  var Crud = app.module();

  //------------------------------------------------
  // MODEL
  //------------------------------------------------

  var MovieModel = Backbone.Model.extend({
    defaults: {
      cod: '',
      title: '',
      status: '0',
      rating: ''
    }
  });

  //------------------------------------------------
  // COLLECTION
  //------------------------------------------------

  Crud.Collection = Backbone.Collection.extend({
    model: MovieModel,
    localStorage: new Store('movie-list')
  });


  //------------------------------------------------
  // VIEW'S
  //------------------------------------------------

  Crud.Views.Form = Backbone.View.extend({
    template: "form",
    currentItem: {},

    initialize: function () {
      this.currentItem =  new MovieModel();

      this.collection.on('edit', this.editMovie, this);
    },

    events: {
      'click #btnConfirm' : 'confirmSave',
      'click #btn-add' : 'openForm',
      'click .btnClose' : 'closeForm'
    },

    openForm: function () {
      $('#fooom').modal('show');
    },

    closeForm: function () {
      app.router.navigate('/');
      this.currentItem =  new MovieModel();
      this.render();
    },

    confirmSave: function () {
      app.router.navigate('/');

      this.currentItem.set({
        title: $('#txtTitle').val()
      });

      if (!this.currentItem.get('cod')) {
        this.currentItem.set({ cod: (new Date()).getTime() });
        this.collection.add(this.currentItem);
      }

      this.currentItem.save();

      this.currentItem = new MovieModel();

      this.render();
    },

    serialize: function () {
      return this.currentItem.toJSON();
    },

    editMovie: function (movie) {
      this.currentItem = movie;
      this.render();
      this.openForm();
    }

  });

  Crud.Views.List = Backbone.View.extend({
    template: "list",

    initialize: function () {

      this.collection.on('reset', function () {
        this.collection.each(this.addMovie, this);
      }, this);

      this.collection.on("add", function (movie) {
        this.addMovie(movie);
      }, this);

    },

    addMovie: function (movie) {
      var vList = this.insertView('tbody', new Crud.Views.Item({model: movie}));
      vList.render();
    }
  });

  Crud.Views.Item = Backbone.View.extend({
    template: 'item',
    tagName: "tr",

    initialize: function () {
      this.model.on('change', function () {
        this.render();
      }, this);

      this.model.on('destroy', function () {
        this.remove();
      }, this);
    },
    events: {
      'click #btnStatusNotWatched' : 'changeStatus',
      'click #btnStatusWatched' : 'changeStatus',
      'click #btnStatusWantWatched' : 'changeStatus',
      'click .rating span' : 'changeRating'
    },
    changeStatus: function (e) {
      this.model.save({status: $(e.currentTarget).data('status')});
      this.render();
    },
    changeRating: function (e) {
      var r = 5 - $(e.currentTarget).index();
      this.model.save({rating: r});
      this.render();
    },
    serialize: function () {
      return {
        model: this.model.toJSON()
      };
    },
    afterRender: function() {
      var csStatus = ['', 'btn-success', 'btn-warning'];
      this.$el.find('.dropdown-toggle').addClass(csStatus[this.model.get('status')]);
      this.$el.find('.star:eq('+(5-this.model.get('rating'))+')').addClass('starMark');
    }

  });

  return Crud;

});
