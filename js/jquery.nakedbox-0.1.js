/**
 * jQuery Naked Box 0.1
 * https://github.com/saulhardman/jquery.nakedbox.js
 * Saul Hardman (@saulhardman)
 */

(function($){

	$.fn.nakedBox = function(_options) {
		
		/* Set defaults and overwrite with custom settings */
		var defaults = {
					overlayColor: 'rgba(20, 20, 20, .8)',
					boxShadow: '0 0 10px rgba(20, 20, 20, .8), 0 0 40px rgba(20, 20, 20, .8)',
					borderColor: '#fff',
					borderSize: 0,
					pathToImage: 'img/imageLoader.gif',
					speed: 500,
					keyboard: true,
					spinOptions: {
						lines: 8,
						length: 6,
						width: 2,
						radius: 8
					}
				},
				options = $.extend({}, defaults, _options);
		
		/* Element caching */
		var $elements = $(this), $overlay, $viewer, $loader, $image, $next_link, $previous_link, $figure, $caption, $currentElements, currentGroup, currentIndex;
		
		/* nakedBox namespace */
		var nakedBox = {
		
			element: null,
			
			initialised: false,
			
			inProgress: false,
			
			hasNavigation: false,
			
			hasCaptions: false,
			
			useSpin: $.isFunction($.fn.spin),
			
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
					backgroundColor: 'transparent',
					filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000050,endColorstr=#99000050)',
					zoom: 1,
					'background-color': options.overlayColor
				});
				
				/* Viewer */
				$viewer = $('<figure/>', {
					id: 'viewer'
				});
				
				$viewer.css({
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: 0,
					height: 0,
					marginTop: - ($viewer.height() + (options.borderSize * 2)) / 2,
					marginLeft: - ($viewer.width() + (options.borderSize * 2)) / 2,
					padding: options.borderSize,
					backgroundColor: options.borderColor,
					boxShadow: options.boxShadow
				});
				
				/* Caption */
				
				if ($elements.filter('[data-caption]').length) {
					
					this.hasCaptions = true;
					
					$caption = $('<figcaption/>', {
						id: 'caption'
					}).css({
						padding: 10,
						background: '#fff'
					});
				
				}
				
				/* Image */
				
				$image = $('<img>').attr('id', 'magnified').css({
					opacity: 0,
					display: 'block',
					position: 'relative',
					zIndex: 2
				}).appendTo($viewer);
				
				/* Loader */
				
				if (!this.useSpin) {
				
					$loader = $('<img>', {
						'id': 'loader',
						'src': options.pathToImage,
						'alt': 'Loader'
					}).css({
						position: 'absolute',
						top: '50%',
						left: '50%',
						margin: '-8px 0 0 -8px'
					});
				
				}
				
				/* Navigation (is it necessary?) */
				var $elementsWithGroup = $elements.filter('[data-group]');
				
				if ($elementsWithGroup.length > 0) {
				
					$elementsWithGroup.each(function(){
					
						var $this = $(this);
						
						if ($elementsWithGroup.filter('[data-group='+$this.attr('data-group')+']').length > 1) {
						
							nakedBox.hasNavigation = true;
						
							return false;
						
						}
					
					});
				
				}
				
				if (nakedBox.hasNavigation) {
					
					var nav_link_css = {
						position: 'absolute',
						height: '100%',
						width: '50%',
						top: 0,
						opacity: 0,
						backgroundColor: '#fff',
						zIndex: 3
					};
					
					$next_link = $('<a/>', {
						id: 'nextLink',
						'class': 'navLink'
					}).css(nav_link_css).css('right', 0);
				
					$previous_link = $('<a/>', {
						id: 'previousLink',
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
					
					// Check to see which direction we've gone in and load a new image.
					
					if (nakedBox.inProgress) {
					
						return false;
						
					} else {
					
						nakedBox.inProgress = true;
					
					}
					
					var $this = $(this);
					
					if ($this.attr('id') === 'nextLink') {
					
						currentIndex++;
						
					} else {
					
						currentIndex--;
						
					}
					
					$image.fadeTo(options.speed, 0, function(){
						
						$(this).detach();
						
						if (nakedBox.useSpin) {
							$viewer.spin(options.spinOptions);
						} else {
							$viewer.append($loader);
						}
						
						$next_link.add($previous_link).detach();
						
						if (nakedBox.hasCaptions) {
							$caption.detach();
						}
						
						nakedBox.loadImage($this.attr('href'));
						
					});
					
					return false;
					
				}).click(function(e){
				
					// Prevents firing the click event for overlay and closing the modal.
					
					e.stopPropagation();
				
				});
				
				if (nakedBox.hasNavigation) {
				
					/* Navigation */
					$next_link.add($previous_link).hover(function(){
					
						$(this).css('opacity', 0.2);
					
					}, function(){
					
						$(this).css('opacity', 0);
					
					});
				
				}
				
				/* Keyboard navigation */
				if (options.keyboard) {
				
					$(document).keydown(function(e){
					
						switch(e.keyCode) {
							
							// Escape keydown
							case 27:
								$overlay.css('opacity', 0.2).trigger('click');
							break;
							
							// Left arrow keydown
							case 37:
								$previous_link.css('opacity', 0.2).trigger('click');
							break;
							
							// Right arrow keydown
							case 39:
								$next_link.css('opacity', 0.2).trigger('click');
							break;
							
						}
						
					});
				
				}
			
			},
			
			loadImage: function (image_url) {
			
				// Load image from an URL.
				
				var image = new Image(),
						dimensions = {};
				
				image.src = image_url;
				
				image.onload = function(){
							
					$image.attr('src', image.src);
					
					dimensions.width = image.width;
					dimensions.height = image.height;
					
					$image.css('opacity', 0).appendTo($viewer);
					
					if (nakedBox.hasCaptions) {
						dimensions.height += nakedBox.setCaption();
					}
					
					if (nakedBox.hasNavigation) {
						nakedBox.setNavigation();
					}
					
					$viewer.animate({
						width: dimensions.width,
						height: dimensions.height,
						marginLeft: - (dimensions.width + (options.borderSize * 2)) / 2,
						marginTop: - (dimensions.height + (options.borderSize * 2)) / 2
					}, options.speed, function(){
						if (nakedBox.useSpin) {
							$viewer.spin(false);
						} else {
							$loader.detach();
						}
						$image.fadeTo(options.speed, 1, function(){
							nakedBox.inProgress = false;
						});
						if (nakedBox.hasCaptions) {
							$caption.fadeTo(options.speed, 1);
						}
					});
					
				};
			
			},
			
			setNavigation: function () {
			
				// Show/hide next and previous links appropriately.
				
				$next_link.add($previous_link).css('opacity', 0).detach();
				
				if ($currentElements.length) {
					
					if (currentIndex === 0) {
						
						$next_link.attr('href', $currentElements.eq(currentIndex+1).attr('href')).appendTo($viewer);
						
					} else if (currentIndex > 0 && currentIndex < $currentElements.length - 1) {
					
						$next_link.attr('href', $currentElements.eq(currentIndex+1).attr('href')).appendTo($viewer);
						
						$previous_link.attr('href', $currentElements.eq(currentIndex-1).attr('href')).appendTo($viewer);
					
					} else {
						
						$previous_link.attr('href', $currentElements.eq(currentIndex-1).attr('href')).appendTo($viewer);
					
					}
					
				}
			
			},
			
			setCaption: function () {
				
				var $this;
				
				if (nakedBox.hasNavigation) {
					
					if ($currentElements.length) {
					
						$this = $currentElements.eq(currentIndex);
					
					} else {
					
						$this = nakedBox.element;
					
					}
				
				} else {
				
					$this = nakedBox.element;
				
				}
				
				if (typeof $this.data('caption') !== 'undefined') {
					
					var paddingTotal = parseInt($caption.css('padding-left'), 10) + parseInt($caption.css('padding-right'), 10);
					
					$caption.text($this.data('caption')).css({
						width: $image.width() - paddingTotal,
						opacity: 0
					}).show();
					
					$caption.appendTo($viewer);
					
					return $caption.outerHeight();
				
				} else {
				
					return 0;
				
				}
			
			}
		
		};
		
		return $elements.click(function(e){
		
			e.preventDefault();
			
			var $this = $(this);
			
			nakedBox.element = $this;
			
			if (nakedBox.initialised === false) {
			
				nakedBox.createElements();
				
				nakedBox.bindEventListeners();
			
				nakedBox.initialised = true;
			
			}
			
			$overlay.show().fadeTo(options.speed, 1, function(){
			
				$overlay.addClass('shown');
				
			});
			
			if (nakedBox.hasNavigation) {
				
				currentGroup = $this.attr('data-group');
				
				$currentElements = $elements.filter('[data-group=' + currentGroup + ']');
				
				currentIndex = $currentElements.index($this);
			
			}
			
			// Load in the initial image.
			
			$caption.detach();
			
			$image.detach();
			
			if (nakedBox.hasNavigation) {
			
				$next_link.add($previous_link).detach();
			
			}
			
			nakedBox.loadImage($this.attr('href'));
			
			return false;
		
		});

	};

})(jQuery);