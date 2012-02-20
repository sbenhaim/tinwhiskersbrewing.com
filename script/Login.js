<html>
	<form action="javascript:jQuery.post( '/challenge/cookie_form', { user: this.user.value, password: this.password.value }, function(t,d) { location.reload( true ); } );">
		<label for="user">Username</label><br/>
		<input type="text" id="user" name="user"/><br/>
		<label for="password">Password</password><br/>
		<input type="password" id="password" name="password"/></br>
		<input type="submit" value="Go!"/>
	</form>
</html>
