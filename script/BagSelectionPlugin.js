/***
|Name|BagSelectionPlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Description|Select bag for saving|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{
	
(function($) {


	var data;
	var newBag;


	function M( el, attr ) {
		var el = $( document.createElement( el ) );
		if ( attr ) {
			el.attr( attr );
		}
		return el;
	}

	var display = Story.prototype.displayTiddler;
	Story.prototype.displayTiddler = function( srcElement, tiddler, template, animate, slowly ) {

		display.apply( this, arguments );

		if ( template !== DEFAULT_EDIT_TEMPLATE ) {
			return;
		}

		if ( data ) {
			addSelect( tiddler, data );
		}
		else {
			$.getJSON( "/status", {}, (function( t ) {
				return function( data ) {
					addSelect( t, data );
				}
			})( tiddler ) );
		}

	}

		
	function addSelect( tiddler, data ) {
		if ( ! data ) data = data;
		var bags = data.bags;

		// Only show dropdown if there are actually bags to choose
		// from
		if ( bags.length < 2 ) {
			return;
		}

		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );
		var identifier  =  title.abbr( ) + "bag-select";
		var modified  =  $("#" + identifier );

		if ( modified.length === 0 ) {
			var select = M( 'select', { "id": identifier } );
			for ( var i = 0; i < bags.length; i++ ) {
				var bag = bags[i];
				var option  =  M( 'option', { "value": bag } ).html( bag );
				if ( t && t.fields && bag === t.fields['server.bag'] ) {
					option.attr( { "selected": "selected" } );
				}
				select.append( option );
				select.change( (function( t ) {
					return function( e ) {
						updateTiddler( t, e );
					}
				} )( t ) );
			}

			$( ".edit.title:first" ).append( select );
		}
	}

	function updateTiddler( t, e ) {

		newBag = e.target.value;
	}

	var save = TiddlyWiki.prototype.saveTiddler;

	TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags,fields,clearChangeCount,created,creator) {

		var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
		var t = store.getTiddler( title );

		if ( newBag && fields['server.bag'] !== newBag ) {
			if ( t ) {
				window.config.extensions.ServerSideSavingPlugin.removeTiddler( t );
			}
			fields['server.workspace']  =  "bags/" + newBag;
			fields['server.page.revision'] = 0;
			delete fields['server.etag'];
		}

		save.apply( this, arguments );
	}

	String.prototype.abbr = function( ) {
		return this.replace( /\s/g, '_' ).replace( /[^\w]/g, '' );
	}

})(jQuery);

//}}}
