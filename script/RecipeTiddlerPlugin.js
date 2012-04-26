/***
|Name|TiddlerFormPlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Requires|ejs|
|Description|Log in, and out!|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{
	
(function($) {


	// if ( Story.prototype.TFP_coreDisplayTiddler==undefined ) {
	// 	Story.prototype.TFP_coreDisplayTiddler=Story.prototype.displayTiddler;
	// }

	var display = Story.prototype.displayTiddler;
	var button = '<html><button onclick="TfpEditTiddler( this )">Edit</button></html>';
	var originalText;
	var firstTime = true;

	Story.prototype.displayTiddler = function( srcElement, tiddler, template, animate, slowly ) {

		console.log( "arguments: ", arguments );
		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );

		if ( t instanceof Tiddler && t.tags.contains( "formTiddler" ) ) {
			var data = DataTiddler.getDataObject( t );
			var tt = store.getTiddlerText( "BeerRecipeTemplate" );

			var temp = new EJS( {"text": tt } );
			originalText = t.text;
			t.text = temp.render( data );

			display.apply( this, arguments );

			var input = $( document.createElement( 'input' ) );
			input.attr( { "type": "button", "value": "edit" } );
			input.click( (function( self, args ) {
				return function( ) { editForm.apply( self, args ); };
			})( this, arguments ) );

			$('div.viewer').append( input );
		}
		else {
			display.apply( this, arguments );
		}

		firstTime = false;
	}

	function editForm ( srcElement, tiddler, template, animate, slowly ) {

		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );
		t.text = originalText;
		story.refreshTiddler( title, template, true );
	}
})(jQuery);

//}}}
