import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import 'semantic-ui-css/semantic.min.css'
import Redux from './Lib/Redux';  

// Initialize Firebase
var config = {
apiKey: "AIzaSyDWUlD7yY7eTndRatrsWbnnrbob5IlKS4Y",
authDomain: "sac-sahodaya.firebaseapp.com",
databaseURL: "https://sac-sahodaya.firebaseio.com",
projectId: "sac-sahodaya",
storageBucket: "sac-sahodaya.appspot.com",
messagingSenderId: "1010182875716"
};


firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

firebase.auth().onAuthStateChanged(user=>{
  Redux.dispatch({type:'AUTH_CHANGED'})
})

console.log(firebase);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
