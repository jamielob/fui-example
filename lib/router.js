if (Meteor.isClient) {
    
    FlowRouter.route('/', {
      name: 'home'
    });


    FlowRouter.route('/profile/', {
      name: 'profile'
    });


 	FlowRouter.route('/item/:number/', {
      name: 'item'
    });

}


