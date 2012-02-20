<html>
	<input type="submit" value="logout" onclick="jQuery.post( '/logout', {}, function( d,t ) { location.reload( true ); } );"/>
</html> 
