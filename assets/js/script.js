$(function(){

    // Create a model for the foods
    var food = Backbone.Model.extend({

        // Will contain three attributes.
        // These are their default values

        defaults:{
            title: 'My food',
            checked: false
        },

        // Helper function for checking/unchecking a food
        toggle: function(){
            this.set('checked', !this.get('checked'));
        }
    });

    // Create a collection of foods
    var foodList = Backbone.Collection.extend({

        // Will hold objects of the food model
        model: food,

        // Return an array only with the checked foods
        getChecked: function(){
            return this.where({checked:true});
        }
    });

    // Prefill the collection with a number of foods.
    var foods = new foodList([
        new food({ title: 'Pizzas'}),
        new food({ title: 'Burgers'}),
        new food({ title: 'Fries'}),
        new food({ title: 'Kebabs'}),
        new food({ title: 'Chocolate'})
        // Add more here
    ]);

    // This view turns a food model into HTML. Will create LI elements.
    var foodView = Backbone.View.extend({
        tagName: 'li',

        events:{
            'click': 'togglefood'
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)

            this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            // Create the HTML

            this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title') + '</span>');
            this.$('input').prop('checked', this.model.get('checked'));

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        togglefood: function(){
            this.model.toggle();
        }
    });

    // The main view of the application
    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#main'),

        initialize: function(){

            // Cache these selectors
            this.input = this.$('#new-food');
            this.total = $('#total span');
            this.list = $('#foods');

            // Listen for the change event on the collection.
            // This is equivalent to listening on every one of the 
            // food objects in the collection.
            this.listenTo(foods, 'change', this.render);

            // Create views for every one of the foods in the
            // collection and add them to the page

            foods.each(function(food){

                var view = new foodView({ model: food });
                this.list.append(view.render().el);

            }, this);   // "this" is the context in the callback
        },
        
        events: {
            'keypress #new-food': 'createfoodOnEnter'
        },
        
        createfoodOnEnter: function(e){
            if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
              return;
            }
            app.foodList.create(this.newAttributes());
            this.input.val(''); // clean input box
        },
  
        render: function(){

            // Calculate the total order amount by agregating
            // the prices of only the checked elements

            var total = '';

            _.each(foods.getChecked(), function(elem){
                total += (elem.get('title') + ', ');
            });

            // Update the total price
            this.total.text(total);

            return this;
        }
    });

    new App();

});