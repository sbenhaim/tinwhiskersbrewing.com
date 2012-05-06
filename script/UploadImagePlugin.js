/***
|Name|UploadImagePlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Description|Upload images|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{
	
(function($) {
	
	window.config.macros.ImageUploadForm = {};
	window.config.macros.ImageUploadForm.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
		var $form = $("<form action='javascript:void(0);'>");
		var $file = $('<input type="file" name="file"/>');
		var $submit = $('<input type="submit" value="upload"/>');

		$form.submit(function() {
			$.ajax('/images', {
				type: "POST",
				files: $(":file", this),
				iframe: true,
				dataType: "json",
				success: function( d ) {
					if ( d.ok ) {
						$image = $("<img/>");
						$image.attr( 'src', d.image_path );
						$embed = $("<code/>");
						$embed.html( "[img[" + d.image_path + "]]" );
						$(place).append( $image );
						$(place).append( $embed );
					}
					else {
						window.alert( d.message );
					}
				},
			});
		});

		$form.append( $file ).append( $submit );
		$(place).append( $form );
	}
	
})(jQuery);

//}}}
