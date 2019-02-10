import { createStore } from 'redux'
import firebase from 'firebase/app'

const Redux = createStore((state = {}, action)=> {
  state.type=action.type
  // eslint-disable-next-line
    switch (action.type) {
      case 'AUTH_CHANGED':{
        let user = firebase.auth().currentUser;
        state.loggedIn=Boolean(user)
        state.authChecked=true
        if(user){
          state.user=user;
          state.user.firstName=user.displayName.split(" ").shift()
        }
      }
      break;
      case 'USER_UPDATED':{
        console.log(action)
       state.user=action.user;
       console.log(state.user);
       if(state.user&&!state.user.role)
        state.user.role="Subscriber"
      }
    }
    return state
}
)

Redux.subscribe(()=>{
  let state = Redux.getState()
  // eslint-disable-next-line
  switch(state.type){
    case 'AUTH_CHANGED': {
      if(state.user) 
      firebase.firestore().doc(`users/${state.user.uid}`).get().then(doc=>{
        Redux.dispatch({type:'USER_UPDATED',user:doc.data()})
      })
    }
  }
})
export default Redux;