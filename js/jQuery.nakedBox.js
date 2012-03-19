(function($){

	$.fn.nakedBox = function(options) {

		var defaults = {
				  speed: 500
				},
				options = $.extend({}, defaults, options);
		
		var $elements = $(this),
				$overlay = $('#overlay'),
				$viewer = $('#viewer'),
				$loader = $('#loader'),
				$image,
				$next_link = $('#nextLink'),
				$previous_link = $('#prevLink');
				
		var currentRel,
				currentIndex,
				$currentElements;
		
		return $elements.click(function(e){
		
			e.preventDefault();
			
			var $this = $(this);
			
			if ($overlay.length) {
				
				$overlay.show().animate({'opacity': 1}, options.speed, function(){
					$overlay.addClass('shown');
				});
				
			} else {
				
				$overlay = $('<div/>', {
					'id': 'overlay',
					'class': 'shown'
				}).click(function(){
				
					$overlay.animate({
						'opacity': 0
					}, options.speed, function(){
					
						$overlay.hide().removeClass('shown');
						
						$viewer.css({
							height: 'auto',
							width: 'auto',
							margin: '-15px 0 0 -15px'
						}).html($loader);
						
					});
					
				}).appendTo('body');
				
				$viewer = $('<div/>', {
					id: 'viewer'
				}).on('click', '.navLink', function(e){
				
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
					
					$('#magnified').animate({'opacity': 0}, options.speed, function(){
					
						$viewer.html($loader);
						
						loadImageFromLink($this.attr('href'));
						
					});
					
				}).appendTo($overlay);
				
				$loader = $('<img>', {
					'src': 'img/imageLoader.gif',
					'id': 'loader'
				});
				
			}
			
			if ($this.attr('rel')) {
			
				$next_link = $('<a/>', {
					'id': 'nextLink',
					'class': 'navLink'
				});
			
				$previous_link = $('<a/>', {
					'id': 'previousLink',
					'class': 'navLink'
				});
				
				currentRel = $this.attr('rel');
				
				$currentElements = $elements.filter('[rel='+currentRel+']');
				
				currentIndex = $currentElements.index($this);
			
			}
			
			// Load in the initial image.
			
			$viewer.html($loader);
			
			loadImageFromLink($this.attr('href'));
			
		});
		
		function loadImageFromLink (image_url) {
		
			var image = new Image();
			
			image.src = image_url;
			
			image.onload = function(){
			
				var image_height = image.height,
						padding_height = parseInt($viewer.css('padding-top')) + parseInt($viewer.css('padding-bottom')),
						image_width = image.width,
						padding_width = parseInt($viewer.css('padding-left')) + parseInt($viewer.css('padding-right'));
						
				$image = $(image).attr('id', 'magnified');
				
				$viewer.animate({
					height: image_height,
					width: image_width,
					'margin-top': - (image_height / 2) - (padding_height / 2),
					'margin-left': - (image_width / 2) - (padding_width / 2)
				}, options.speed, function(){
					$viewer.html($image);
					if ($currentElements != undefined) setNavigation();
					$image.animate({'opacity': 1}, options.speed);
				});
				
			}
			
		}
		
		function setNavigation () {
			
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

})(jQuery);