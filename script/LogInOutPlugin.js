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
	
jQuery(function() {
	
	var plugin = window.LogInOutPlugin = {};
	
	plugin.attemptLogin = function( el ) {
		var form = el.form;
		
		jQuery.ajax({
			url: '/challenge/cookie_form',
			type: "POST",
			data: { user: form.user.value, password: form.password.value },
			statusCode: { 401: function() { window.alert( "Invalid username or password." ); } },
			success: function( ) {
				window.alert( 'Logged in as "' + form.user.value + '".' );
				location.reload( true );
			}
		});
	}

	plugin.attemptJoin = function( el ) {
		var form = el.form;

		if ( ! form.user.value || ! form.password.value ) {
			return window.alert( "All fields are required." );
		}
		
		if ( form.password.value !== form.confirm_password.value ) {
			return window.alert( "Passwords do not match." );
		}
		
		jQuery.ajax({
			url: '/users',
			type: "POST",
			processData: false,
			contentType: 'application/json',
			data: JSON.stringify( { username: form.user.value, password: form.password.value } ),
			statusCode: { 409: function() { window.alert( "Username taken." ); } },
			success: function( ) {
				window.alert( 'Logged in as "' + form.user.value + '".' );
				location.reload( true );
			}
		});
	}

	plugin.logout = function() {
		jQuery.ajax({
			url: '/logout',
			type: "POST",
			error: function( ) { window.alert( "Logged out." ); location.reload( true ); },
			success: function( ) { window.alert( "Logged out." ); location.reload( true ); }
		});
	}
	
});

//}}}
