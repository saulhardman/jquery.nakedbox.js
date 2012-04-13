(function($){

	$.fn.backgroundBlur = function (_options) {
	
		var defaults = {
			
			imagePath: null,
			imageType: 'png',
			blurRadius: 5
		
		},
		options = $.extend({}, defaults, _options);
		
		var $element = $(this),
				context = $('<canvas/>', {
					id: 'canvas',
					width: '0',
					height: '0'
				}).appendTo('body').get(0).getContext('2d'),
				image = new Image();
		
		$element.spin({top: $(window).height() / 2, left: $(window).width() / 2});
		
		image.onload = function () {
				
			context.canvas.width = image.width;
			context.canvas.height = image.height;
			
			context.drawImage(image, 0, 0);
			
			stackBlurCanvasRGBA(context.canvas.id, 0, 0, context.canvas.width, context.canvas.height, options.blurRadius);
			
			var image_url = context.canvas.toDataURL('image/'+options.imageType),
					css = {
						'background': $element.css('background-color') + ' url(' + image_url + ') fixed center no-repeat',
						'-webkit-background-size': 'cover',
						'-moz-background-size': 'cover',
						'-o-background-size': 'cover',
						'-ms-background-size': 'cover',
						'background-size': 'cover'
					};
					
			return $element.spin(false).css(css);
			
			$(context.canvas).remove();
		
		};
		
		image.src = options.imagePath;
	
	};

})(jQuery);