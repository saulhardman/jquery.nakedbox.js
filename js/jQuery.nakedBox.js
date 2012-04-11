(function($){

	$.fn.nakedBox = function(options) {
		
		/* Set defaults and overwrite with custom settings */
		var defaults = {
					overlayColor: 'rgba(20, 20, 20, .8)',
					boxShadow: '0 0 10px rgba(20, 20, 20, .8), 0 0 40px rgba(20, 20, 20, .8)',
					borderColor: '#fff',
					borderSize: 0,
				  speed: 500,
				  keyboard: true
				},
				options = $.extend({}, defaults, options);
		
		/* Element caching */
		var $elements = $(this), $overlay, $viewer, $loader, $image, $next_link, $previous_link, $currentElements, currentRel, currentIndex;
		
		/* nakedBox namespace */
		var nakedBox = {
			
			initialised: false,
			
			createElements: function () {
			
				// Create all of the html elements if they don't already exist.
				
				/* Overlay */
				$overlay = $('<div/>', {
					'id': 'overlay'
				}).css({
					top: 0,
					left: 0,
					height: '100%',
					width: '100%',
					position: 'fixed',
					backgroundColor: options.overlayColor
				});
				
				/* Viewer */
				$viewer = $('<div/>', {
					id: 'viewer'
				});
				
				$viewer.css({
					position: 'absolute',
					top: '50%',
					left: '50%',
					marginTop: - ($viewer.height() + (options.borderSize * 2)) / 2,
					marginLeft: - ($viewer.width() + (options.borderSize * 2)) / 2,
					padding: options.borderSize,
					backgroundColor: options.borderColor,
					boxShadow: options.boxShadow
				});
				
				/* Loader */
				$loader = $('<img>', {
					'id': 'loader',
					'src': 'img/imageLoader.gif',
					'alt': 'Loader'
				}).css({
					position: 'absolute',
					top: '50%',
					left: '50%',
					margin: '-8px 0 0 -8px'
				});
				
				/* Navigation */
				if ($elements.filter('[rel]').length > 0) {
					
					var nav_link_css = {
						position: 'absolute',
						height: '100%',
						width: '50%',
						top: 0,
						opacity: 0,
						backgroundColor: '#fff'
					};
					
					$next_link = $('<a/>', {
						'id': 'nextLink',
						'class': 'navLink'
					}).css(nav_link_css).css('right', 0);
				
					$previous_link = $('<a/>', {
						'id': 'previousLink',
						'class': 'navLink'
					}).css(nav_link_css).css('left', 0);
					
				}
				
				$overlay.append($viewer).appendTo('body');
			
			},
			
			bindEventListeners: function () {
			
				// Bind event listeners to all of the key elements.
				
				/* Overlay */
				$overlay.click(function(){
				
					$overlay.fadeTo(options.speed, 0, function(){
					
						$overlay.hide().removeClass('shown');
						
						$viewer.css({
							height: 16,
							width: 16,
							marginTop: - (16 + (options.borderSize * 2)) / 2,
							marginLeft: - (16 + (options.borderSize * 2)) / 2
						});
						
					});
					
				});
				
				/* Viewer */
				$viewer.on('click', '.navLink', function(e){
				
					e.preventDefault();
					
					// Prevents firing the click event for html etc. and closing the modal.
					
					e.stopPropagation();
					
					// Check to see which direction we've gone in and load a new image.
					
					var $this = $(this);
					
					if ($this.attr('id') == 'nextLink') {
					
						currentIndex++;
						
					} else {
					
						currentIndex--;
						
					}
					
					$image.fadeTo(options.speed, 0, function(){
						
						$(this).detach();
						
						$viewer.append($loader);
						
						$next_link.add($previous_link).detach();
						
						nakedBox.loadImage($this.attr('href'));
						
					});
					
				});
				
				/* Navigation */
				$next_link.add($previous_link).hover(function(){
				
					$(this).css('opacity', .2);
				
				}, function(){
				
					$(this).css('opacity', 0);
				
				});
				
				/* Keyboard navigation */
				if (options.keyboard) {
				
					$(document).keydown(function(e){
					
						switch(e.keyCode) {
							
							// Escape keydown
							case 27:
								$overlay.trigger('click');
							break;
							
							// Left arrow keydown
							case 37:
								$previous_link.trigger('click');
							break;
							
							// Right arrow keydown
							case 39:
								$next_link.trigger('click');
							break;
							
						}
						
					});
				
				}
			
			},
			
			loadImage: function (image_url) {
			
				// Load image from an URL.
				
				var image = new Image();
				
				image.src = image_url;
				
				image.onload = function(){
							
					$image = $(image).attr('id', 'magnified').css({
									   opacity: 0,
									   filter: 'alpha(opacity=0)'
									 });
					
					$viewer.animate({
						height: image.height,
						width: image.width,
						marginTop: - (image.height + (options.borderSize * 2)) / 2,
						marginLeft: - (image.width + (options.borderSize * 2)) / 2
					}, options.speed, function(){
						$loader.detach();
						$viewer.append($image);
						if (currentRel != null) nakedBox.setNavigation();
						$image.animate({'opacity': 1}, options.speed);
					});
					
				}
			
			},
			
			setNavigation: function () {
			
				// Show/hide next and previous links appropriately.
				
				$next_link.add($previous_link).detach();
				
				if ($currentElements.length) {
					
					if (currentIndex == 0) {
						
						$next_link.attr('href', $currentElements.eq(currentIndex+1).attr('href')).appendTo($viewer);
						
					} else if (currentIndex > 0 && currentIndex < $currentElements.length - 1) {
					
						$next_link.attr('href', $currentElements.eq(currentIndex+1).attr('href')).appendTo($viewer);
						
						$previous_link.attr('href', $currentElements.eq(currentIndex-1).attr('href')).appendTo($viewer);
					
					} else {
						
						$previous_link.attr('href', $currentElements.eq(currentIndex-1).attr('href')).appendTo($viewer);
					
					}
					
				}
			
			}
		
		}
		
		return $elements.click(function(e){
		
			e.preventDefault();
			
			var $this = $(this);
			
			if (nakedBox.initialised === false) {
			
				nakedBox.createElements();
				
				nakedBox.bindEventListeners();
			
				nakedBox.initialised = true;
			
			}
			
			$overlay.show().fadeTo(options.speed, 1, function(){
			
				$overlay.addClass('shown');
				
			});
			
			if ($this.attr('rel')) {
				
				currentRel = $this.attr('rel');
				
				$currentElements = $elements.filter('[rel='+currentRel+']');
				
				currentIndex = $currentElements.index($this);
			
			} else {
			
				currentRel = null;
			
			}
			
			// Load in the initial image.
			
			$viewer.append($loader);
			
			$next_link.add($previous_link).add($image).detach();
			
			nakedBox.loadImage($this.attr('href'));
			
			return false;
		
		});

	}

})(jQuery);