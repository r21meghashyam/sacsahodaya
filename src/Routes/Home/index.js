import React,{Component} from 'react'
import {
  Button,
  Container,
  Header,
  Segment,
  Image
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

    <Segment style={{ padding: '8em 0em' }} vertical basic>
      <Container text  textAlign='center'>
        <h1>Mr. Rachit Kulshrestha is coming to St. Aloysius College</h1>
          <Image src="/RachitKulshrestha.jpg" alt="RachitKulshrestha.jpg" centered />
          <div>
          <p>33-year-old Rachit Kulshrestha was diagnosed with cancer when he was just five. At the age of six, doctors had to amputate his left arm. Rachit, however, chose not to give up and was determined to live life on his own terms. Today, Rachit plays cricket, chess, and table tennis and has scaled a 13,500-foot mountain twice.</p>
          <p>Rachit's early days — with other children making fun of him and not receiving the same opportunities as those around him — were filled with struggle, but he never let that deter him. In a Facebook post published on the Humans of Bombay page, Rachit said, I was always a huge fan of football, so I would train really hard to be a goal keeper and all that training paid off — I was selected to play at the inter-school level. The first match of that tournament was an unforgettable one for me. When the coach of the opposite team realised that I was the goalkeeper, he declared that his team would win by ‘at least six goals!’ but I didn’t let that bother me. I was so focused on doing my best that we ended up winning the game 4-2! That was a day of validation for me — that if I really try nothing is a limitation."</p>
          <p>Determined to try different things, Rachit has been living life to the fullest. Having worked at different places as a waiter, bartender, hotel manager, and call centre executive, Rachit travels a lot. He also writes poetry, and as an entrepreneur, has started his post film production company ‘Secret Locators’.</p>
          <p>In 2014, Rachit's cancer resurfaced in another form, but Rachit defeated it again. "Or like I usually say — my invisible hand is always showing the invisible finger to cancer!" </p>
          </div>
          <div style={{padding:20}}>
            <Button as={Link} to="/event-register" color="primary">Click here to meet Rachit Kulshrestha</Button>
          </div>
      </Container>
    </Segment>
   
  </ResponsiveContainer>
    );
  }
}