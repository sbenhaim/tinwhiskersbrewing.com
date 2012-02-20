<html>
	<form action="javascript:jQuery.ajax( '/users', { type: 'POST', processData: false, contentType: 'application/json', 'data': JSON.stringify( { username: this.user.value, password: this.password.value } ), success: function(t,d) { console.log( t ); } } );">
		<label for="user">Username</label><br/>
		<input type="text" id="user" name="user"/><br/>
		<label for="password">Password</password><br/>
		<input type="password" id="password" name="password"/></br>
		<input type="submit" value="Go!"/>
	</form>
</html>
