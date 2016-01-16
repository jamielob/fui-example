if (Meteor.isClient) {
	//Listen for fuiTarget clicks
	Template.fuiTemplate.events({
		'click [fui-target]': function (event, template) {
			//Get the target name
			var fuiTarget = $(event.currentTarget).attr('fui-target');
			fui.triggerElement(fuiTarget);
		},


		'click .fui-slider .fui-photo': function (event, template) {
			
			//Get the img and container
			var $img = $(event.currentTarget).find('img');

			var $container = $(event.currentTarget).parents('.fui-slider');

			//Scroll up
			var offsetTop = $container[0].offsetTop;
     		template.$(".fui-scroll").animate({scrollTop: offsetTop }, 200);

			//Check if it's already enlarged
			if ($img.hasClass('fui-enlarged')) {
				//Return to normal
				$img.velocity({
					    width: $img.data('originalWidth'),
					    height: $img.data('originalHeight')
				}, { duration: 200 });

				//Toggle the enlarged class
				$img.removeClass('fui-enlarged');	

			} else {
				//Reduce any other enlarged images
				var $enlarged = $container.find('.fui-enlarged');
				$enlarged.velocity({
					    width: $enlarged.data('originalWidth'),
					    height: $enlarged.data('originalHeight')
				}, { 
					duration: 200,
					complete: function() {
						$(this).removeClass('fui-enlarged');
					} 
				});
				//$enlarged.css('width', $enlarged.data('originalWidth'));
				//$enlarged.css('height', $enlarged.data('originalHeight'));

				//Save the original sizes
				$img.data('originalWidth', $img.width());
				$img.data('originalHeight', $img.height());

				//Calculate the bigger size (100% of the viewport)
				var ratio = $(window).width() / $img.width();
				var newWidth = $(window).width() + 'px';
				var newHeight = ( $img.height() * ratio  ) + 'px';
				//Animate
				$img.velocity({
					    width: newWidth,
					    height: newHeight
				}, { 
					duration: 200,
					complete: function() {
						var offsetLeft = event.currentTarget.offsetLeft;
     					$container.animate({scrollLeft: offsetLeft }, 200);
     					$img.addClass('fui-enlarged');
					}

				});

				// //Scroll into place
				// Meteor.setTimeout(function() {
					
				// }, 500);
				
			}
			
					
		}
	});



	Template.fuiTabs.helpers({
		fuiTabs: function () {
			return Session.get('fuiTabs');
		},

		fuiCurrentTab: function () {
			return Session.get('fuiCurrentTab');
		},

		fuiTabsDivider: function() {
			if (this.divider === "true") return 'fui-tabs-divider';
		},

		fuiTabsInline: function() {
			if (this.inline === "true") {
				return 'fui-tabs-inline';
			} else {
				return 'fui-tabs-fixed';
			}
		}

	});


	fui.triggerElement = function(fuiTarget) {

		//Hide any others that are showing
		var $fuiOtherTargets = $('[fui-element]').not('[fui-element="' + fuiTarget + '"]');
		if ( $fuiOtherTargets.hasClass('fui-element-in') ) {
			$fuiOtherTargets.removeClass('fui-element-in');
		}

		//Get the target element
		var $fuiTarget = $('[fui-element="' + fuiTarget + '"]');
		//If it's showing 
		if ( $fuiTarget.hasClass('fui-element-in') ) {
			//animate it out of view
			$fuiTarget.addClass('fui-element-out').removeClass('fui-element-in').on("animationend oAnimationEnd webkitAnimationEnd", function(event) {
				//Make sure it's only on the out animation
				if (!$(event .currentTarget).hasClass('fui-element-out')) return;
				$(this).off("animationend oAnimationEnd webkitAnimationEnd");	
				//Removing the class onon end so we can hide the overlay easily using css
				$(this).removeClass('fui-element-out')
			});

			//Need to move to using js on mobile because of CSS flicker (reduced using fix already implemented)
			//http://stackoverflow.com/questions/17747239/ios-flicker-bug-when-the-css-overflowscroll-is-changed-to-overflowhidden
			//But couldn't figure out a way of doing it cleanly, so leaving it as CSS with flicker for now
			//Don't implement the same delay below up here, as it takes too long to re-implement scrolling that way.
			$('.fui-current .fui-scroll').not('.fui-element .fui-scroll').css('overflow-y', '')
			

		//Otherwise
		} else {
			//Animate it in to view
			$fuiTarget.addClass('fui-element-in').removeClass('fui-element-out').on("animationend oAnimationEnd webkitAnimationEnd", function(event) {
				//Make sure it's only on the in animation
				if (!$(event.currentTarget).hasClass('fui-element-in')) return;
				$(this).off("animationend oAnimationEnd webkitAnimationEnd");
				//Disable scrolling underneath - Doing at the end of the animation seems to reduce/remove the flicker mentioned above
				$('.fui-current .fui-scroll').not('.fui-element .fui-scroll').css('overflow-y', 'hidden');
			});

		}

	}


	
}
