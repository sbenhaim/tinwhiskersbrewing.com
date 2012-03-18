/***
|Name|IntraTiddlerNavPlugin|
|Source|https://github.com/sbenhaim/Tin-Whiskers-TiddlyWiki-Client-Plugin-Dev/blob/master/BrowserHistoryPlugin.js|
|Documentation|todo|
|Version|0.1.1|
|Author|Selah Ben-Haim|
|License|todo|
|~CoreVersion|todo|
|Type|plugin|
|Description|Dynamically create a nav of headline tags within a tiddler on load.|

!!!!!Documentation
>see [[todo]]

!!!!!Configuration
<<<

<<<
!!! Code
***/

//{{{

version.extensions.IntraTiddlerNavPlugin = {major: 0, minor: 1, revision: 1, date: new Date(2012, 1, 7)};

config.paramifiers.ITN = { onstart: function(v) {
	config.options.chkBrowserHistoryMode=eval(v);
} };

if (config.options.chkBrowserHistoryMode == undefined)
	config.options.chkBrowserHistoryMode = false;

function stackTitles( items, cur ) {
	
	if ( cur === undefined ) {
		cur = 1;
	}

	var next = cur + 1;
	
	return jQuery.map( items, function( elem, index ) {
		
		var children  =  jQuery( elem ).nextUntil( 'h' + cur, 'h' + next );

		var d = {};
		d.title  =  elem.innerHTML;
		d.y  =  jQuery(elem).offset().top
		d.id =  index;

		if ( cur === 1 ) d.style = "top";

		if ( children.length > 0 ) {
			d.children  =  stackTitles( children, next );
		}

		return d;
	} );
}

function highlightNav( ) {
	var pos = jQuery(window).scrollTop( );
	var headlines  =  jQuery('h1, h2, h3, h4, h5');

	var id = null;
	
	for ( var i = 0; i < headlines.length; i++ ) {
		if ( jQuery( headlines[i] ).offset().top + 20 > pos ) {
			id = headlines[i].id;
			break;
		}
	}
	var el = jQuery("#nav-" + id);
	console.log( el );
	// jQuery('nav li, nav a').removeClass( 'active' );
	
	el.siblings( 'li' ).removeClass( 'active' );
	el.parents( 'li' ).last().addClass( 'active' );
	el.addClass( 'active' );
}


var scrollLast = +new Date();

jQuery(window).scroll( function( ) {
    if ((+new Date()) - scrollLast > 50) {
        scrollLast = +new Date();
        highlightNav();
    }
});


function buildNav( ul, items ) {
	jQuery.each( items, function( index, child ) {
		var li = jQuery( document.createElement( "li" ) );
		jQuery( ul ).append( li );
		var a = document.createElement( "a" );
		a.id = "nav-" + child.id;
		a.class = child.style;
		a.onlick = "jQuery( 'html,body' ).animate( {scrollTop: #{child.y}}, 500 );";
		// a.href = 'javscript:void(0);'
		a  =  jQuery( a );
		a.html( child.title );
		
		li.append( a );

		if ( child.children ) {
			var subUl = document.createElement( 'ul' );
			li.append( subUl );
			buildNav( subUl, child.children );
		}
		
	});
}


//hi-jack the displayTiddler prototype from Story.js 
if ( Story.prototype.ITN_coreDisplayTiddler==undefined ) {
	Story.prototype.ITN_coreDisplayTiddler=Story.prototype.displayTiddler;
}

// displayTiddler replacement
// choose new name for original and redefine original to minimize interference with other plugins
Story.prototype.displayTiddler = function( srcElement, tiddler, template, animate, slowly )
{
	this.ITN_coreDisplayTiddler.apply( this, arguments ); // let CORE render tiddler
	div  =  jQuery( 'div.tiddlerBody div.content' );
	var titles = stackTitles( div.find( 'h1' ) );
	if ( titles.length > 0 ) {
		
		jQuery.each( jQuery('h1,h2,h3,h4,h5'), function( i, e ) {
			e.id = i;
		});
		
		var nav = document.createElement( 'nav' );
		nav.id = "tiddler_nav";
		var ul = document.createElement( 'ul' );
		jQuery( nav ).append( ul );
		div.append( nav );
		buildNav( ul, titles );
	}
	
	// var title = ( tiddler instanceof Tiddler )?tiddler.title:tiddler;
	// var text  =  store.getTiddlerText( title );
	// var div  =  document.createElement( 'div' );
	// var html = wikify( text, div );
	// var titles  =  stackTitles( div );
	// console.log( titles );

	
	// var tiddlerElem = story.getTiddler( title ); //  =  = null unless tiddler is already displayed
	// var opt = config.options;
	// var single = opt.chkBrowserHistoryMode && !startingUp;
	
	// if ( single ) {
	// 	story.forEachTiddler( function( tid, elem ) {
	// 		// skip current tiddler and, optionally, tiddlers that are folded.
	// 		if ( 	tid==title
	// 			|| ( opt.chkBrowserHistoryKeepFoldedTiddlers && elem.getAttribute( "folded" )=="true" ) )
	// 			return;
	// 		// if a tiddler is being edited, ask before closing
	// 		if ( elem.getAttribute( "dirty" )=="true" ) {
	// 			if ( opt.chkBrowserHistoryKeepEditedTiddlers ) return;
	// 			// if tiddler to be displayed is already shown, then leave active tiddler editor as is
	// 			// ( occurs when switching between view and edit modes )
	// 			if ( tiddlerElem ) return;
	// 			// otherwise, ask for permission
	// 			var msg="'"+tid+"' is currently being edited.\n\n";
	// 			msg+="Press OK to save and close this tiddler\nor press Cancel to leave it opened";
	// 			if ( !confirm( msg ) ) return; else story.saveTiddler( tid );
	// 		}
	// 		story.closeTiddler( tid );
	// 	} );
		
	// 	if (  popped  ) {
	// 		popped = false;
	// 	}
	// 	else {
	// 		var url = encodeURIComponent( String.encodeTiddlyLink( title ) );
	// 		var docTitle = wikifyPlain( "SiteTitle" ) + " - " + title;
	// 		document.title = docTitle;
	// 		history.pushState(  {}, docTitle, '#' + url  );
	// 	}
	// }
	
	// if ( tiddlerElem && tiddlerElem.getAttribute( "dirty" )=="true" ) { // editing... move tiddler without re-rendering
	// 	var isTopTiddler=( tiddlerElem.previousSibling==null );
	// 	if ( !isTopTiddler && ( single || top ) )
	// 		tiddlerElem.parentNode.insertBefore( tiddlerElem, tiddlerElem.parentNode.firstChild );
	// 	else if ( bottom )
	// 		tiddlerElem.parentNode.insertBefore( tiddlerElem, null );
	// 	else this.BHP_coreDisplayTiddler.apply( this, arguments ); // let CORE render tiddler
	// } else {
	// 	this.BHP_coreDisplayTiddler.apply( this, arguments ); // let CORE render tiddler
	// }
	
	// var tiddlerElem=story.getTiddler( title );
	
	// if ( tiddlerElem && opt.chkBrowserHistoryScrollTopTiddler ) {
	// 	// scroll to top of page or top of tiddler
	// 	var isTopTiddler=( tiddlerElem.previousSibling==null ); // what is this for?
	// 	var yPos=isTopTiddler?0:ensureVisible( tiddlerElem );
	// 	// if animating, defer scroll until after animation completes
	// 	var delay=opt.chkAnimate?config.animDuration+10:0;
	// 	setTimeout( "window.scrollTo( 0, 0 )", 0); 
	// 	//setTimeout( "window.scrollTo( 0, "+ yPos +" )", delay ); 
	// }
	// else if ( tiddlerElem && opt.chkBrowserHistoryScrollTopWindow ) {
	// 	setTimeout( "window.scrollTo( 0, 0 )", 0); 
	// }
}

if ( Story.prototype.ITN_coreDisplayTiddlers==undefined )
	Story.prototype.ITN_coreDisplayTiddlers=Story.prototype.displayTiddlers;

Story.prototype.displayTiddlers = function(  ) {
	
	var opt     = config.options;
	var saveITN = opt.chkBrowserHistoryMode; opt.chkBrowserHistoryMode = false;
	
	this.ITN_coreDisplayTiddlers.apply( this, arguments );
	
	opt.chkBrowserHistoryMode = saveITN;
}


//}}}
