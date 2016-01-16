if (Meteor.isClient) {

	Template.registerHelper("fuiShowContent", function(name) {
		if (name) {

			//If it is the first template, return true no matter what
			if (Session.get('fuiFirstTemplate') === name) return true;

			//Check if first template has loaded
			if  (Session.get('fuiFirstTemplateLoaded')) {

				//If it should be persisted, show it!
				if (Template.instance().data.persist) return true;
				
				//Check if it is the current or last page (need to keep both of those showing and ready)
				if ( name === Session.get('fuiCurrentTemplate') || name === Session.get('fuiLastTemplate') || name === Session.get('fuiHistoryTemplate')) {
					//Show it!
					return true;
				}

			}
			
		}
	});


	Template.registerHelper("fuiBackPath", function() {
	  	var fuiHistory = Session.get('fuiHistory');
	  	if (fuiHistory && fuiHistory.length) {
	    	return fuiHistory[fuiHistory.length - 1].path;
	  	}
	});

	Template.registerHelper("fuiCurrentTemplate", function() {
		return Session.get('fuiCurrentTemplate');
	});

	Template.registerHelper("fuiDisabled", function() {
		return Session.get('fuiDisabled');
	});
	

	Template.body.events({
		'click .fui-input .fui-clear': function (event, template) {
			$(event.currentTarget).parent().find('input').val('');
		}
	});

}