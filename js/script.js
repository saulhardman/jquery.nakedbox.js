$(document).ready(function(){
	
	// Non-fancy overlay for magnified images.
	
	$('.nakedBox').nakedBox();
	
	$('body').backgroundBlur({imagePath: 'img/test_image_1.jpg', imageType: 'jpg', blurRadius: 15});

});