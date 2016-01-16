if (Meteor.isClient) {

	Template.registerHelper("list", function() {
		return _.range(500);
	});

	Template.item.helpers({
		number: function () {
			return FlowRouter.getParam('number');
		}
	});

}
