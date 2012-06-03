// -------------------------------------------------------------------
// markItUp!
// -------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// -------------------------------------------------------------------
// Mediawiki Wiki tags example
// -------------------------------------------------------------------
// Feel free to add more tags
// -------------------------------------------------------------------
mySettings = {
	previewParserPath:	'', // path to your Wiki parser
	onShiftEnter:		{keepDefault:false, replaceWith:'\n\n'},
	markupSet: [
		{name:'Heading 1', key:'1', openWith:'! ',       placeHolder:'Heading 1', className: "heading1" },
		{name:'Heading 2', key:'2', openWith:'!! ',      placeHolder:'Heading 2', className: "heading2" },
		{name:'Heading 3', key:'3', openWith:'!!! ',     placeHolder:'Heading 3', className: "heading3" },
		{name:'Heading 4', key:'4', openWith:'!!!! ',    placeHolder:'Heading 4', className: "heading4" },
		{name:'Heading 5', key:'5', openWith:'!!!!! ',   placeHolder:'Heading 5', className: "heading5" },
		{name:'Heading 6', key:'6', openWith:'!!!!!!  ',  placeHolder:'Heading 6', className: "heading6" },
		{separator:'---------------' },		
		{name:'Bold', key:'B', openWith:"''", closeWith:"''", className: "bold"}, 
		{name:'Italic', key:'I', openWith:"//", closeWith:"//", className: "italic"}, 
		{name:'Underline', key:'U', openWith:"__", closeWith:"__", className: "underline"}, 
		{name:'Stroke through', key:'S', openWith:'--', closeWith:'--', className: "stroke-through"}, 
		{separator:'---------------'},
		{name:'Bulleted list', openWith:'(!(* |!|*)!)', className: "bulleted-list"}, 
		{name:'Numeric list', openWith:'(!(# |!|#)!)', className: "numeric-list"}, 
		{separator:'---------------'},
		// {name:'Picture', key:"P", replaceWith:'[[img:[![Url:!:http://]!]|[![name]!]]]', className: "image"}, 
		{name:'Picture', key:"P", call:'', className: "image"}, 
		{name:'Link', key:"L", openWith:"[[", closeWith:']]', placeHolder:'link text', className: "link"},
		{name:'Url', openWith:"[[[![Link text:!:]!]|", closeWith:']]', placeHolder:'http://' , className: "url"},
		{separator:'---------------'},
		{name:'Quotes', openWith:'(!(> |!|>)!)', placeHolder:'', className: "quote"},
		{name:'Code', openWith:'{{{', closeWith:'}}}', className: "code"}
		// {name:'Code', openWith:'(!(<source lang="[![Language:!:php]!]">|!|<pre>)!)', closeWith:'(!(</source>|!|</pre>)!)', className=""}, 
		// {separator:'---------------'},
		// {name:'Preview', call:'preview', className:'preview'}
	]
}
