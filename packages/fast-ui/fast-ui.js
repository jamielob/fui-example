//Pages are stored off screen to the right using transform 
//They are animated in by adding a class to them
//The current page remains static until it is covered by the new page
//This helps reduce performance issues when animating and means that large lists that remain static don't have problems

//Events that can happen are:
//Forward with transition
//Forward skipping transition
//Back button with transition
//Back button skipping transition
//Back swipe skipping transition

//Also need to:
//Update the history
//Place the new last page underneath


if (Meteor.isClient) {

	//Exported global object
	fui = {};

	//Initial load
	Meteor.startup(function () {
		Meteor.defer(function() {
			//Show the current page
			$fuiFirstTemplate = $('#' + FlowRouter.getRouteName());
			$fuiFirstTemplate.addClass('fui-current');

			//Set the  initial last direction travelled to forwards for semantics
			fui.lastDirection = 'forwards';
			
			//Set the first template
			Session.set('fuiFirstTemplate', FlowRouter.getRouteName());

			//Move the last history item in to place
			var fuiHistory = Session.get('fuiHistory');
			if (fuiHistory && fuiHistory.length) {
				var fuiLastPage = fuiHistory[fuiHistory.length - 1];
	    		fuiLastPageId = "#" + fuiLastPage.name;
	   	 		$(fuiLastPageId).addClass('fui-last');
   	 		}

   	 		//Set the first template as loaded after 1/10th second.  This is a bit hacky, but stops other persistent templates loading until the first one has come in.
   	 		Meteor.setTimeout(function() {
				Session.set('fuiFirstTemplateLoaded', true); 
   	 		}, 100);

   	 		if ($fuiFirstTemplate.attr('fui-tabs')) {
				Session.set('fuiTabs', 'showing');

				//Check which tab should be active
				var $matchingTab = $('.fui-tabs-fixed a[href="' + FlowRouter.current().path + '"]');
				if ($matchingTab) {
					$('.fui-tabs-fixed a').removeClass('fui-active');
					$matchingTab.addClass('fui-active');
				}

			} else {
				Session.set('fuiTabs', 'hidden');
			}

			//Enable the back button by default
			Session.set('fuiDisabled', false);

		});
	});

	//Set up history
	Session.setDefault('fuiHistory', []);

	//Listen for skip events
	fui.skipExit = false;
	fui.skipEnter = false;
	Template.body.events({
		'click .fui-skip': function () {
			fui.skipExit = true;
			fui.skipEnter = true;
		}
	});

	//Listen for back and detour events
	fui.directionExit = 'forwards';
	fui.directionEnter = 'forwards';
	Template.body.events({
		'click .fui-back': function (event) {
			//Check if the button is disabled
			if (Session.get('fuiDisabled')) {
				event.preventDefault();
				return;
			} else {
				Session.set('fuiDisabled', true)
			}
			fui.directionExit = 'backwards';
			fui.directionEnter = 'backwards';
		},

		'click .fui-detour': function (e) {
			Session.set('fuiDetour', FlowRouter.current().path);
		}
	});








	//On Exit
	FlowRouter.triggers.exit(function() {
		
		var $fuiExitTemplate = $('#' + FlowRouter.getRouteName());

		//Save last page to the Session, so it can be kept visible
	   	Session.set('fuiLastTemplate', FlowRouter.getRouteName());

		fuiHistory = Session.get('fuiHistory'); //Global so exposed to both exit and enter
		if (!fuiHistory) fuiHistory = {}; //Adding this so hot code pushes work better

		//If backward
		if (fui.directionExit === 'backwards') {

			//Pop from the history immediately
			fuiHistory.pop();
			//Save the history - MUST go at top so that the history updates in the correct order and quick enough.  Otherwise we get a white screen problem where it jumps a place.
			Session.set('fuiHistory', fuiHistory);

			//If skip
			if (fui.skipExit) {

				//Remove the current class
				$fuiExitTemplate.removeClass('fui-current');

				//Find the last item, add the current class, remove the last class
				$('.fui-last').addClass('fui-current').removeClass('fui-last');

				//Reset skip flag
				fui.skipExit = false;

				//Reset the direction flag
				fui.directionExit = 'forwards';

				//Set the new last item
				if (fuiHistory && fuiHistory.length) {
					var fuiLastPage = fuiHistory[fuiHistory.length - 1];
		    		fuiLastPageId = "#" + fuiLastPage.name;
		   	 		$(fuiLastPageId).addClass('fui-last');
		   	 		//Save last page to the Session, so it can be made visible
		   	 		Session.set('fuiHistoryTemplate', fuiLastPage.name);
	   	 		} 

			//Else transition
			} else {

				//Add animation class
				$fuiExitTemplate
					.addClass('fui-slideOut-backwards')
					.on("animationend oAnimationEnd webkitAnimationEnd", function(event) {

						//Make sure that the animation is on the template and not child elements
						if( event.target !== event.currentTarget ) return;
						$(this).off("animationend oAnimationEnd webkitAnimationEnd");

						//Find the last item, add the current class
						$('.fui-last').addClass('fui-current');

						//Remove the current class and the anination class
						$fuiExitTemplate.removeClass('fui-current fui-slideOut-backwards');

						//Reset the direction flag
						fui.directionExit = 'forwards';

						//Find the last item, remove the last class - doing this separate to above to reduce flicker on slower devices
						$('.fui-last').removeClass('fui-last');
						
						//Set the new last item
						if (fuiHistory && fuiHistory.length) {
							var fuiLastPage = fuiHistory[fuiHistory.length - 1];
				    		fuiLastPageId = "#" + fuiLastPage.name;
				   	 		$(fuiLastPageId).addClass('fui-last');				   	 		
				   	 		
				   	 		//Save last page to the Session, so it can be made visible
		   	 				Session.set('fuiHistoryTemplate', fuiLastPage.name);
			   	 		}
 
						//Re-enable the back button after a short delay.  This helps the back route be ready.
						Meteor.setTimeout(function() {
							Session.set('fuiDisabled', false);
						}, 100);
						

					});

			}

			//Set the last direction
			fui.lastDirection = 'backwards';

		} else if (fui.directionExit === 'forwards') {
			
			//Add to the history
			var historyState = { path: FlowRouter.current().path, name: FlowRouter.getRouteName() }
			fuiHistory.push(historyState);

			//Save the history - MUST go at top so that the history updates in the correct order and quick enough.  Otherwise we get a white screen problem where it jumps a place.
			Session.set('fuiHistory', fuiHistory);

			// //If skip
			// if (fui.skipExit) {
			// 	//Save the history immediately
		 //   		Session.set('fuiHistory', fuiHistory);
		 //   	} else {
		 //   		//Save it when the animation finished on enter
		 //   	}

		   	// //Save last page to the Session
		   	// Session.set('fuiLastTemplate', FlowRouter.getRouteName());

		   	//Reset skip flag
			fui.skipExit = false;

			//Reset the direction flag
			fui.directionExit = 'forwards';

			//Set the last direction
			fui.lastDirection = 'forwards';
		}

		

	});





	//On Enter
	FlowRouter.triggers.enter(function() {
		
		var $fuiEnterTemplate = $('#' + FlowRouter.getRouteName());

		//Save current page to the Session - used to know which templates to render
		Session.set('fuiCurrentTemplate', FlowRouter.getRouteName());

		//If forward
		if (fui.directionEnter === 'forwards') {

			

			//If skip
			if (fui.skipEnter) {
			
				//Find the last item, remove the last class
				$('.fui-last').removeClass('fui-last');

				//Find the current item, add the last class, remove the current class
				$('.fui-current').addClass('fui-last');

				//Add the current class
				$fuiEnterTemplate.addClass('fui-current');

				//Reset skip flag
				fui.skipEnter = false;

				//Reset the direction flag
				fui.directionEnter = 'forwards';

				//Remove the current flag from last -- doing this down here to reduce content flash on slower devices
				$('.fui-last').removeClass('fui-current');

			//Else transition
			} else {
				//Add animation class
				$fuiEnterTemplate
					.addClass('fui-slideIn-forwards')
					.on("animationend oAnimationEnd webkitAnimationEnd", function(event) {
						
						//Make sure that the animation is on the template and not child elements
						if ( event.target !== event.currentTarget ) return;
						$(this).off("animationend oAnimationEnd webkitAnimationEnd");

						//Find the last item, remove the last class
						$('.fui-last').removeClass('fui-last');

						//Find the current item, add the last class, remove the current class
						$('.fui-current').addClass('fui-last').removeClass('fui-current');

						//Add the current class
						$fuiEnterTemplate.addClass('fui-current');

						//Remove the animation class
						$(this).removeClass('fui-slideIn-forwards');

						//Reset the direction flag
						fui.directionEnter = 'forwards';

						//Save the history here so that the back button doesn't appear too quickly
		   				Session.set('fuiHistory', fuiHistory);

		   				//Deal with detours
		   				//--------------------------------------------------------------
		   				if (fuiHistory) {
							var detour = Session.get('fuiDetour');
					   		//Check if it matches the current page
					   		if (detour === FlowRouter.current().path) {
					   			//If going forwards, clear back the history
					   			if (fui.lastDirection === "forwards") {
						   			//Remove everything in the history back to the last occurance of the current page
									//Loops through history backwards until the current page is reached again
									for (var i = fuiHistory.length - 1; i >= 0; i--) {

										//Cache this point
										thisHistoryPoint = fuiHistory[i].path;
										//Pop it from the array
										fuiHistory.pop();
										//If we've reached the jump point, stop going back in time
										if (thisHistoryPoint === detour) {
											break;
										}
									};

									//Set the new last item
									if (fuiHistory && fuiHistory.length) {
										var fuiLastPage = fuiHistory[fuiHistory.length - 1];
							    		fuiLastPageId = "#" + fuiLastPage.name;
							    		$('.fui-last').removeClass('fui-last');
							   	 		$(fuiLastPageId).addClass('fui-last');				   	 		
							   	 		
							   	 		//Save last page to the Session, so it can be made visible
					   	 				Session.set('fuiHistoryTemplate', fuiLastPage.name);
						   	 		}

									//Re-save the history
									Session.set('fuiHistory', fuiHistory);
								}
								//Clear the detour
								Session.set('fuiDetour', '');
							}	
						}
						//--------------------------------------------------------------


		   				//Re-Save current page to the Session - seems to be a bug, where it's getting wiped and results in a white screen
						Session.set('fuiCurrentTemplate', FlowRouter.getRouteName());
		   				

					});

			}

		} else {

			// if (fui.skipEnter) {
			// 	//Save current page to the Session - so it knows to render it
			// 	Session.set('fuiCurrentTemplate', FlowRouter.getRouteName());
			// }

			//Reset skip flag
			fui.skipEnter = false;

			//Reset the direction flag
			fui.directionEnter = 'forwards';

		}


		//Deal with tabs
		if ($fuiEnterTemplate.attr('fui-tabs')) {
			//Make sure they aren't already showing to avoid animation blip
			if (Session.get('fuiTabs') !== 'showing') {
				Session.set('fuiTabs', 'slideUp');
			}

			//Check which tab should be active
			var $matchingTab = $('.fui-tabs-fixed a[href="' + FlowRouter.current().path + '"]');
			if ($matchingTab) {
				$('.fui-tabs-fixed a').removeClass('fui-active');
				$matchingTab.addClass('fui-active');
			}

		} else {
			//Make sure they aren't already hidden to avoid animation blip
			if (Session.get('fuiTabs') !== 'hidden') {
				Session.set('fuiTabs', 'slideDown');
			}

		}


	});






	//Enter and Exit function
	fui.onEnter = function (templateName, callback) {
		//Convert templateName to an array if it isn't alreaday
		if (!$.isArray(templateName)) templateName = [templateName];
		Meteor.defer(function() {
			//Have to do it this way, rather than a Flow Router hook, otherwise it won't trigger when first rendered inside an onRendered callback
			Tracker.autorun(function () {
				if ( _.contains(templateName, FlowRouter.getRouteName()) ) {
					//Make callback nonreactive, so that the autorun won't loop based on reactive variables inside the callback
					Tracker.nonreactive(function () {
						callback();
					});
				}
			});	
		});
	};

	fui.onExit = function (templateName, callback) {
		//Convert templateName to an array if it isn't alreaday
		if (!$.isArray(templateName)) templateName = [templateName];
		Meteor.defer(function() {
			FlowRouter.triggers.exit(function() {
					return callback();
			}, {only: templateName});
		});
	};


	//Where we cache params
	fui.params = {};

	//Get last param function

	fui.getParam = function(paramName) {
		
		if (typeof FlowRouter.getParam(paramName) !== 'undefined') {
			fui.params[paramName] = FlowRouter.getParam(paramName);
		}

		return fui.params[paramName];

	}



}