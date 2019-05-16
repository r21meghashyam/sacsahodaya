import React,{Component} from 'react'
import {
  Button,
  Container,
  Header,
  Segment,
} from 'semantic-ui-react'
import { Slide } from 'react-slideshow-image';


import { Value } from 'slate'
import {Link} from 'react-router-dom'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app';

const localizer = BigCalendar.momentLocalizer(moment) 

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
}
//Components

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class HomepageLayout extends Component{
  state={
    articles:[],
    events:[],
    images:[]
  }
  constructor(props){
    super(props);
    firebase.firestore().collection('articles').limit(3).get().then(snapshot=>{
      let articles=[];
        snapshot.docs.forEach(doc=>{
          let data = doc.data();
          data.document = Value.fromJSON(JSON.parse(data.body)).texts.get(0).getText().substr(0,250)+'...'
          //console.log(data)
          data.id = doc.id
          articles.push(data)
          this.setState({articles})
        })
    })
  }
  componentWillMount(){
    firebase.firestore().collection('images').where("album","==","eIaBAhTYCcIntDLj9Ima").get().then(snapshot=>{
      let images = [];
      snapshot.forEach(doc=>{
        images.push(doc.data().url);
      });
      console.log(images);
      this.setState({images})
    });
    firebase.firestore().collection('events').get().then(snapshot=>{
      let events=[];
      snapshot.docs.forEach(doc=>{
        events.push(doc.data());
      });
      this.setState({events});
    });
  }
  render(){
    let {articles} = this.state;
    return(
<ResponsiveContainer>
    
    <Container>
    <Header as='h3' style={{ fontSize: '2em' }}>
          Photos
        </Header>
        <Slide {...properties}>
        {this.state.images.map((url,index)=>
          <div key={index} className="each-slide">
            <img src={url} alt="slider"/>
          </div>
          )}
        
      </Slide>
    <Segment textAlign="center" basic>
      <Button as={Link} to="/gallery" style={{margin:20,padding:20}} >View More</Button>
    </Segment>
    </Container>
    
    <Segment style={{ padding: '8em 0em' }} vertical basic>
      <Container text>
        {
          articles.map((article,index)=>(
          <React.Fragment key={index}>
          <Header as='h3' style={{ fontSize: '2em' }}>
          {article.title}
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          {article.document}
        </p>
        <Button as={Link} to={'/articles/'+article.id} size='large'>
          Read More
        </Button>
        {articles.length-1===index?'':<hr/>}
        </React.Fragment>
        ))
        }
      </Container>
    </Segment>

    <Container>
      <Header as='h3' style={{ fontSize: '2em' }}>
        Events
      </Header>
      <Container style={{padding:10}}>
        <BigCalendar
          localizer={localizer}
          events={this.state.events}
          
          defaultView={BigCalendar.Views.AGENDA}
        />
      </Container>
      
    </Container>
   
  </ResponsiveContainer>
    );
  }
}