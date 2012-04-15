/***
|Name|TiddlerFormPlugin|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Description|Log in, and out!|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{
	
jQuery(function() {
	var $ = jQuery;
	window.config.macros.forms  =  {};
	window.config.macros.forms.handler = function(place,macroName,params,wikifier,paramString,tiddler) {

		var title = params[0];
		var template  =  store.getTiddlerText( title );
		var config  =  JSON.parse( template );

		place = $(place);

		var form = make( "form" ).attr( 'action', 'javascript:void(0)' );
		form.append( make( "h1" ).html( "Make new " + config.type ) )

		var p = make( "p" ).append(
			make( 'label' ).html( "Title " ).append( 
				make( 'input' ).attr( { "name":"title", "type": "text" } )
			)
		);

		$(form).append( p );

		for ( var i = 0; i < config.fields.length; i++ ) {

			var def = config.fields[i];
			var type = def.type;

			$( form ).append( addField( def ) );
		}

		var submit = make( 'button' ).html( 'Create ' + config.type );
		submit.click( function( ) { makeTiddler( form.serializeArray() ); } );
		$( form ).append( make( 'p' ).append( submit ) );
		place.append( form );
						 
	}

	function make( what ) {
		return $( document.createElement( what ) );
	}

	function addField( def ) {
		var el;
		switch (def.type) {
		case 'select':
			el = make( 'select' );
			for ( var i = 0; i < def.values.length; i++ ) {
				var value = def.values[i];
				el.append( make( 'option' ).attr( 'value', value ).html( value ) );
			}
			break;
		case 'textarea':
			el = make( 'textarea' );
		}

		el.attr( 'name', def.name );
		return make( 'p' ).append( 'label' ).html( def.name.toTitleCase( ) + " " ).append( el );
	}

	function makeTiddler( params ) {
		var conf = {};
		for ( var i = 0; i < params.length; i++ ) {
			conf[ params[i].name ] = params[i].value;
		}

		if ( store.tiddlerExists( conf.title ) || store.isShadowTiddler( conf.title ) ) {
			window.alert( 'Sorry, "' + conf.title + '" is taken.' );
		}
		else {
			var newTiddler = store.createTiddler( conf.title );
			store.saveTiddler( newTiddler );
		}
	}
		

	String.prototype.toTitleCase = function ( ) {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
});

//}}}
