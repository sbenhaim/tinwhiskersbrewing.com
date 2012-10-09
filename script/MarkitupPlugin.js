/***
|Name|MarkitupPlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Description|Markitup WYSIWYG editor|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{
	
(function($) {


	var TIMEOUT = 1000;
	var content = '';

	function M( el, attr ) {
		var el = $( document.createElement( el ) );
		if ( attr ) {
			el.attr( attr );
		}
		return el;
	}


	var editHandler = config.macros.edit.handler;

	config.macros.edit.handler = function(place,macroName,params,wikifier,paramString,tiddler) {

		var editHolder = createTiddlyElement(place, "div", "editHolder");
		editHandler(editHolder,macroName,params,wikifier,paramString,tiddler);  // use old edit handler 

		if( paramString.indexOf("text") === -1 || tiddler.isReadOnly() )  {
			return;
		}
		else { 
			$(".editor textarea").markItUp(mySettings);

			prepareImageUpload();
			twPreview();
		}
	}

	window.MarkitupPlugin  =  {};
	var prepareImageUpload = window.MarkitupPlugin.prepareImageUpload = function( ) {
		var $form = $("<form action='javascript:void(0);'>");
		var $file = $('<input type="file" name="file"/>');
		$file.css( { position: 'absolute',
					 top: 0,
					 width: "16px",
					 height: "16px",
					 opacity: 0 });

		function ddComplete ( e, r ) {
			complete( r.result );
		}

		function complete ( d ) {
			if ( d.ok ) {
				$.markItUp({ openWith: "[img[" + d.image_path + "]]" } );
			}
			else {
				window.alert( d.message );
			}
		}

		$form.submit(function() {
			$.ajax('/images', {
				type: "POST",
				files: $(":file", this),
				iframe: true,
				dataType: "json",
				success: complete
			});
		});

		$file.change( function() { $form.submit(); } );
		$form.append( $file );

		var $li = $('li.markItUpButton.image');

		$li.html('');
		$li.append( '<img src="/public/markitup/sets/wiki/images/picture.png" alt="Insert Image"/>' );
		$li.append( $form );
		$li.unbind( 'click' );


		// Drag and drop support
		$('.editor textarea').fileupload({
			dataType: 'json',
			url: '/images',
			paramName: 'file',
			type: 'POST',
			done: ddComplete
		});
	}

	function twPreview ( ) {

		setTimeout(twPreview, TIMEOUT);
		var newContent  =  $(".markItUpEditor").val();

		if ( newContent === content ) {
			return;
		}

		if ( ! $(".editor").length ) {
			return;
		}
		
		var preview = $(".editor div.markitup-preview");

		if ( ! preview.length ) {
			var preview = $('<div class="markitup-preview"></div>');
			$(".editor").append( preview );
		}


		preview.html('');
		wikify( newContent, preview[0] );

		content = newContent;
	}

})(jQuery);

//}}}
