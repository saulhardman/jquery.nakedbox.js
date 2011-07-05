(function($){

	$.fn.nakedBox = function(options) {

		var defaults = {
		  speed: 500
		};
		var options = $.extend({}, defaults, options);
		
		var $this = $(this), $overlay, $viewer, $loader, $image, $next_link, $previous_link, $images_in_group, number_of_images, index;
		
		$this.click(function(e){
		
			e.preventDefault();
			
			var $element = $(this);
			
			if($('div#overlay').length < 1){
				$overlay = $('<div></div>').attr({
						id: 'overlay'
				})
				.addClass('shown')
				.appendTo('body')
				.click(function(){
					$overlay.animate({'opacity': 0}, options.speed, function(){
						$overlay.hide().removeClass('shown');
						$viewer.css({height: 'auto', width: 'auto', margin: '-15px 0 0 -15px'}).html($loader);
					});
				});
				$viewer = $('<div></div>').attr({
					id: 'viewer'
				}).appendTo($overlay);
				$loader = $('<img/>').attr({
					src: 'images/imageLoader.gif',
					id: 'loader'
				});
				$viewer.delegate('a.navLink', 'click', function(e){
					e.preventDefault()
					e.stopPropagation();
					//Check to see which direction we've gone in and load a new image.
					if($(this).attr('id')=='nextLink'){
						index++;
						loadImageFromLink($next_link.attr('href'));
					}else{
						index--; 
						loadImageFromLink($previous_link.attr('href'));
					};
					//Add missing links.
					if($('a#nextLink').length < 1) $next_link.appendTo($viewer);
					if($('a#prevLink').length < 1) $previous_link.appendTo($viewer);	
					//Change the href values accordingly.
					(index != 1 && $('a#nextLink').length > 0) ? $previous_link.attr('href', $images_in_group.eq(index-2).attr('href')) : $previous_link.remove();
					(index != number_of_images && $('a#nextLink').length > 0) ? $next_link.attr('href', $images_in_group.eq(index+1).attr('href')) : $next_link.remove();
				});
			}else{
				$overlay = $('div#overlay');
				$viewer = $('div#viewer');
				$loader = $('img#loader');
				$overlay.show().animate({'opacity': 1}, options.speed, function(){
					$overlay.addClass('shown');
				});
			};
			
			//Load in the initial image.
			loadImageFromLink($element.attr('href'));
			
			//Check if this image is part of a 'group' of images.
			if($element.attr('rel') != undefined){
				$images_in_group = $('a[rel='+$element.attr('rel')+']');
				number_of_images = $images_in_group.length;
				if(number_of_images > 1){
					index = 1;
					$next_link = $('<a></a>').attr('id', 'nextLink').addClass('navLink').attr('href', $images_in_group.eq(index).attr('href'));
					$previous_link = $('<a></a>').attr('id', 'previousLink').addClass('navLink');
					$next_link.appendTo($viewer);
				}
			};
			
		});
		
		function loadImageFromLink(image_link){
			if($('img#magnified').length > 0){
				$('img#magnified').animate({'opacity': 0}, options.speed, function(){
					$viewer.prepend($loader);
					$(this).remove();
				});
			}else{
				$viewer.prepend($loader);
			};
			var image = new Image();
			image.src = image_link;
			image.onload = function(){
				var h = image.height;
				var padding_height = parseInt($viewer.css('padding-top')) + parseInt($viewer.css('padding-bottom'));
				var w = image.width;
				var padding_width = parseInt($viewer.css('padding-left')) + parseInt($viewer.css('padding-right'));
				$image = $(image).attr({
					id: 'magnified'
				});
				$viewer.animate({
					height: h,
					width: w,
					'margin-top': -h/2-padding_height/2,
					'margin-left': -w/2-padding_width/2
				}, options.speed, function(){
					$('img#loader').remove();
					$viewer.prepend($image);
					$image.animate({'opacity': 1}, options.speed);
				});
			};
		};

	};

})(jQuery);