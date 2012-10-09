/***
|Name|RecipeTiddlerPlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Requires|MarkitupPlugin|
|Description|Recipe forms for creating tiddler|

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

	Story.prototype.displayTiddler = function( srcElement, tiddler, template, animate, slowly ) {

		display.apply( this, arguments );

		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );

		var identifier  =  title.abbr( ) + "-create-button";
		var modified  =  $("#" + identifier );

		if ( modified.length === 0 && t instanceof Tiddler && t.tags.contains( "systemForm" ) ) {
			$el = $('div.viewer');

			processForm( $el );

			var button = $( "<input/>" );
			button.attr( { "type": "button", "value": "create", "id": identifier } );
			button.click( function( evt ) {
				create( $el, title );
			} );

			$el.append( "<br/>" );
			$el.append( button );
		}
	}


	function processForm( $el ) {

		$el.find("select[foreach='tiddler']").each( function( i, el ) {
			var tags = $(el).attr( "tagged-with" );
			store.forEachTiddler( function(title,tiddler) {
				if ( tiddler.tags.contains( tags ) ) {
					$(el).append( $("<option/>").attr( {"value":title} ).html( title ) );
				}
			});
		});

		$el.find( 'textarea' ).markItUp( mySettings );
		window.MarkitupPlugin.prepareImageUpload( );

		createPlusButtons( $el );
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

	// function editWithForm( srcElement, tiddler, template, animate, slowly ) {

	// 	var title = ( tiddler instanceof Tiddler ) ? tiddler.title : tiddler;
	// 	var t = store.getTiddler( title );
	// 	var formDisplay  =  t.text;
	// 	t.text = editDisplay;
	// 	story.refreshTiddler( title, template, true );

	// 	var identifier  =  title.abbr( ) + "-save-button";
	// 	var input = $( document.createElement( 'input' ) );
	// 	input.attr( { "type": "button", "value": "save", "id": identifier } );

	// 	input.click( ( function( self, t, args ) {
	// 		return function( ) {
	// 			story.saveTiddler( tiddler );
	// 			story.displayTiddler.apply( self, args );
	// 		};
	// 	})( this, t, arguments ) );


	// 	$el  =  $('div.viewer');

	// 	$el.append( input );
	// 	createPlusButtons( $el );
	// }

	String.prototype.abbr = function( ) {
		return this.replace( /\s/g, '_' ).replace( /[^\w]/g, '' );
	}

	function create( $el, formName ) {
		if( !readOnly ) {

			var data = $el.find( "form" ).serializeJSON();
			var tiddlerName = data.name;

			if ( ! tiddlerName ) {
				window.alert("Please select a name.");
				return;
			}

			if ( tiddlerName && store.getTiddler(tiddlerName) ) {
				window.alert("A tiddler named '"+tiddlerName+"' already exists.\n\n"+"Please specify a different name.");
				return;
			}

			var templateName = $el.find( "form" ).attr( "template" );
			var tt = store.getTiddlerText( templateName );

			if ( ! tt ) {
				console.log( "Rendering template " + templateName + " not found for form tiddler." );
				return;
			}

			var temp = new EJS( {"text": tt} );
			var body = temp.render( {"data": data} );
			body += "\n\n<data>" + JSON.stringify( data ) + "</data>";

			var tags = [];
			if ( data.tags ) {
				if ( data.tags instanceof Array ) {
					tags = data.tags;
				}
				else {
					tags.push( data.tags );
				}
			}
			tags.push( "systemFormCreated" );

			store.saveTiddler(tiddlerName,tiddlerName,body,config.options.txtUserName,new Date(),tags,{ "createdByForm": formName });
			story.displayTiddler(null,tiddlerName,1);
		}
	}

	$.fn.serializeJSON = function() {
		var arrayData, objectData;
		arrayData = this.serializeArray();
		objectData = {};

		$.each(arrayData, function() {
			var value;

			if (this.value != null) {
				value = this.value;
			} else {
				value = '';
			}

			if (objectData[this.name] != null) {
				if (!objectData[this.name].push) {
					objectData[this.name] = [objectData[this.name]];
				}

				objectData[this.name].push(value);
			} else {
				objectData[this.name] = value;
			}
		});

		return objectData;
	};

})(jQuery);

//}}}
