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


	var display = Story.prototype.displayTiddler;
	var editDisplay;
	var viewDisplay;
	var firstTime = true;

	Story.prototype.displayTiddler = function( srcElement, tiddler, template, animate, slowly ) {

		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );

		var identifier  =  title.abbr( ) + "-edit-button";
		var modified  =  $("#" + identifier );

		if ( modified.length === 0 && t instanceof Tiddler && t.tags.contains( "formTiddler" ) ) {
			var data = DataTiddler.getDataObject( t );
			var tt = store.getTiddlerText( "BeerRecipeTemplate" );

			var temp = new EJS( {"text": tt } );
			editDisplay = t.text;
			t.text = temp.render( {"data": data} );

			display.apply( this, arguments );
			story.refreshTiddler( title, template, true );

			store.setDirty( false );

			$el = $('div.viewer');

			var input = $( document.createElement( 'input' ) );
			input.attr( { "type": "button", "value": "edit", "id": identifier } );
			input.click( (function( self, args ) {
				return function( ) { editForm.apply( self, args ); };
			})( this, arguments ) );

			$el.append( input );
		}
		else {
			display.apply( this, arguments );
		}

		firstTime = false;
	}



	function createPlusButtons( $el ) {
		var $button = $( '<input type="button" value="+" class="plus-button" />' );
		$button.click( function( evt ) {
			var $div = $( evt.target ).parent( 'div.plus-able' );
			$div.append( '<br/>');
			$div.append( "\n" );
			$div.append( $div.find( 'input.plus-able:last' ).clone( ) );
			$div.append( evt.target );
		});


		var $group = $el.find( 'div.plus-able' );
		var $input = $el.find( 'input.plus-able' );

		if ( $group.length ) {
		}
		else if ( $input ) {
			var $div = $( '<div class="plus-able">' );
			$input.wrap( $div );
			$input.after( $button );
		}
	}

	function editForm ( srcElement, tiddler, template, animate, slowly ) {

		var title = ( tiddler instanceof Tiddler ) ? tiddler.title : tiddler;
		var t = store.getTiddler( title );
		var formDisplay  =  t.text;
		t.text = editDisplay;
		story.refreshTiddler( title, template, true );

		var identifier  =  title.abbr( ) + "-save-button";
		var input = $( document.createElement( 'input' ) );
		input.attr( { "type": "button", "value": "save", "id": identifier } );

		input.click( ( function( self, t, args ) {
			return function( ) {
				story.saveTiddler( tiddler );
				story.displayTiddler.apply( self, args );
			};
		})( this, t, arguments ) );


		$el  =  $('div.viewer');

		$el.append( input );
		createPlusButtons( $el );
	}

	String.prototype.abbr = function( ) {
		return this.replace( /\s/g, '_' ).replace( /[^\w]/g, '' );
	}

	window.newRecipeTiddler = function( recipeForm, recipeTemplate, tags ) {
		if(!readOnly) {

			tiddlerName = prompt("Please specify a title.", "");

			while (tiddlerName && store.getTiddler(tiddlerName)) {
				tiddlerName = prompt("A tiddler named '"+tiddlerName+"' already exists.\n\n"+"Please specify a different title.", tiddlerName);
			}

			// tiddlerName is either null (user canceled) or a name that is not yet in the store.
			if (tiddlerName) {
				var body = "<<formTiddler [["+recipeForm+"]]>>";
				if ( ! tags ) tags = [];
				tags.push( "formTiddler" );
				store.saveTiddler(tiddlerName,tiddlerName,body,config.options.txtUserName,new Date(),tags,{ "recipeTemplate": recipeTemplate });
				story.displayTiddler(null,tiddlerName,1);
			}
		}
	}

})(jQuery);

//}}}
