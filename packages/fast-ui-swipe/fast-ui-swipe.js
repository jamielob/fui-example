if (Meteor.isClient) {

	originalDragEnd = Draggabilly.prototype.dragEnd;

	Template.fuiTemplate.onRendered(function() {

		var self = this;
		
		Meteor.defer(function() {
			
			//Modify for fast ui swipe purposes
			Draggabilly.prototype.dragEnd = function( event, pointer ) {
			  if ( !this.isEnabled ) {
			    return;
			  }
			  this.isDragging = false;
			  //Removing the left position because we don't need or want it - we prefer to animate with Transform
			  //use top left position when complete only if it's not the fui-swipe
			  if (!this.$element.hasClass('fui-content')) {
				   this.$element.css('transform', '');
				   this.setLeftTop();
		     }
			  classie.remove( this.element, 'is-dragging' );
			  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
			};
			
			var $fuiDragBack = self.$('.fui-content').draggabilly({
				handle: '.fui-dragBack',
		    	axis: 'x'
			});



			$fuiDragBack.on( 'dragStart', function( event, position ) {
				if (event.target !== event.currentTarget) return;
				fuiHistory = Session.get('fuiHistory');
			  	if (fuiHistory.length) {
			    	var fuiLastPage = fuiHistory[fuiHistory.length - 1];
			    	fuiLastPageId = "#" + fuiLastPage.name;
			    	fuiLastPageName = fuiLastPage.name;
			    	fuiLastPagePath = fuiLastPage.path;
			    } else {
			    	$(this).draggabilly('disable').css('transform', '');
			    }
			});

			$fuiDragBack.on( 'dragEnd', function( event, position ) {
				if (event.target !== event.currentTarget) return;
				
				//Get percentage dragged
				var percentage = position.clientX / $('.fui-content').width() * 100;
				if (percentage < 50) {
					//Reset if under the threshold
					$(this)
						.addClass('fui-swipe-reset')
						.on("animationend oAnimationEnd webkitAnimationEnd", function() {
							if (event.target !== event.currentTarget) return;
							$(this).off("animationend oAnimationEnd webkitAnimationEnd");
							$(this)
								.css({'transform': '', 'left': '', 'top': ''})
				            	.removeClass('fui-swipe-reset');
				            //$('.fui-underneath').removeClass('fui-underneath');
				        });
					
				} else {

					//Complete transition to go back
					$(this)
						.addClass('fui-swipe-complete')
						.on("animationend oAnimationEnd webkitAnimationEnd", function() {
							if (event.target !== event.currentTarget) return;
							$(this).off("animationend oAnimationEnd webkitAnimationEnd");

							$(this)
								.css({'transform': '', 'left': '', 'top': ''})
				            	.removeClass('fui-swipe-complete');
				            //$('.fui-underneath').removeClass('fui-underneath');

			            	fui.skipExit = true;
							fui.skipEnter = true;
							fui.directionExit = 'backwards';
							fui.directionEnter = 'backwards';
			            	FlowRouter.go(fuiLastPagePath);
				        });
									
				}

				
			});



			//Disable draggers when history becomes empty
			Tracker.autorun(function () {
				//Watch the history
				fuiHistory = Session.get('fuiHistory');
				if (fuiHistory) {
					//If it's up or down to 1, make sure it's enabled
					if (fuiHistory.length === 1) {
						$fuiDragBack.draggabilly('enable');
					//If it's empty, disable the draggers
					} else if (!fuiHistory.length) {
						$fuiDragBack.draggabilly('disable');

						//Reset the position, just in case it's in the middle of a drag (like someone going back really quickly)
						$fuiDragBack
							.addClass('fui-swipe-reset')
							.on("animationend oAnimationEnd webkitAnimationEnd", function() {
								if (event.target !== event.currentTarget) return;
								$(this).off("animationend oAnimationEnd webkitAnimationEnd");
								$(this)
									.css({'transform': '', 'left': '', 'top': ''})
					            	.removeClass('fui-swipe-reset');
					        });
						
					}
				}
				
			});


		});


	});	

	

}
