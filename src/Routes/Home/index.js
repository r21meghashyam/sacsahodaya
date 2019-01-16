import React,{Component} from 'react'
import {
  Button,
  Container,
  Grid,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react'
import { Value } from 'slate'
import {Link} from 'react-router-dom'
import AllPhotos from '../Gallery/Photos';

//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class HomepageLayout extends Component{
  state={
    articles:[]
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
  render(){
    let {articles} = this.state;
    return(
<ResponsiveContainer>
    
    <Container>
    <Header as='h3' style={{ fontSize: '2em' }}>
          Photos
        </Header>
    <AllPhotos limit={6}/>
    <Segment textAlign="center" basic>
      <Button as={Link} to="/gallery" style={{magin:20,padding:20}} >View More</Button>
    </Segment>
    </Container>
    
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        {
          articles.map((article,index)=>(
          <React.Fragment>
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
   
  </ResponsiveContainer>
    );
  }
}