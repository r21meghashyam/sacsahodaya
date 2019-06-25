import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './index.css'
//Components
import Articles from './Routes/Articles';
import EditProfile from './Routes/EditProfile';
import CreateAlbum from './Routes/Gallery/Create';
import AddPhoto from './Routes/Gallery/Add';
import CreateArticle from './Routes/Articles/Create';
import Events from './Routes/Events';
import Gallery from './Routes/Gallery';
import Home from './Routes/Home';
import LogIn from './Routes/Login';
import LogOut from './Routes/LogOut';
import Members from './Routes/Members';
import NotFound from './Routes/NotFound';
import Profile from './Routes/Profile';
import Register from './Routes/Register';
import ViewAlbum from './Routes/Gallery/ViewAlbum';
import Convert from './Routes/Gallery/Convert';
import ViewArticle from './Routes/Articles/ViewArticle';
import EditArticle from './Routes/Articles/Edit';
import AddEvent from './Routes/Events/AddEvent';
import About from './Routes/About';
import EventRegister from './Routes/EventRegister';
import EventRegisterSuccess from './Routes/EventRegisterSuccess';
import EventRegisterList from './Routes/EventRegisterList';



class App extends Component {


	render() {
		return (
	 		<div className="App">
				
	  			<Router>
	   				<Switch>
						
		  				<Route path="/" component={Home} exact/>
		  				<Route path="/articles" component={Articles} exact/>
		  				<Route path="/about" component={About} exact/>
		  				<Route path="/articles/create" component={CreateArticle} exact/>
		  				<Route path="/gallery/create" component={CreateAlbum} exact/>
		  				<Route path="/articles/edit/:article_id" component={EditArticle} exact/>
		  				<Route path="/articles/:article_id" component={ViewArticle} exact/>
		  				<Route path="/edit-profile" component={EditProfile} exact/>
		  				<Route path="/events" component={Events} exact/>
		  				<Route path="/events/add-event" component={AddEvent} exact/>
		  				<Route path="/gallery" component={Gallery} exact/>
		  				<Route path="/login" component={LogIn} exact/>
		  				<Route path="/logout" component={LogOut} exact/>
		  				<Route path="/members" component={Members} exact/>
		  				<Route path="/profile" component={Profile} exact/>
		  				<Route path="/register" component={Register} exact/>
		  				<Route path="/gallery/album/:album_id" component={ViewAlbum} exact/>
		  				<Route path="/gallery/album/:album_id/add" component={AddPhoto} exact/>
		  				<Route path="/gallery/convert" component={Convert} exact/>
		  				<Route path="/event-register" component={EventRegister} exact/>
		  				<Route path="/event-register-success" component={EventRegisterSuccess} exact/>
		  				<Route path="/event-register-list" component={EventRegisterList} exact/>

		  				<Route path="/" component={NotFound} />
					</Switch>
				
				</Router>
				
			</div>
		);
  	}
}

export default App;
