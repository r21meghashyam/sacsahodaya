import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

//Components
import EditProfile from './Routes/EditProfile';
import Gallery from './Routes/Gallery';
import Home from './Routes/Home';
import LogIn from './Routes/Login';
import LogOut from './Routes/LogOut';
import NotFound from './Routes/NotFound';
import Profile from './Routes/Profile';
import Register from './Routes/Register';


class App extends Component {
	
	render() {
		return (
	 		<div className="App">
				
	  			<Router>
	   				<Switch>
						
		  				<Route path="/" component={Home} exact/>
		  				<Route path="/edit-profile" component={EditProfile} exact/>
		  				<Route path="/gallery" component={Gallery} exact/>
		  				<Route path="/login" component={LogIn} exact/>
		  				<Route path="/logout" component={LogOut} exact/>
		  				<Route path="/profile" component={Profile} exact/>
		  				<Route path="/register" component={Register} exact/>
		  				<Route path="/" component={NotFound} />
					</Switch>
				
				</Router>
				
			</div>
		);
  	}
}

export default App;
