import React, {Component} from 'react'
import {
Header,
Container,
Segment,
Button,
Icon,
Label
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import firebase from 'firebase/app'

import { Value } from 'slate'
import moment from 'moment';
import Redux from '../../Lib/Redux';



/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Gallery extends Component{ 
  state={
    tab:1,
    articles:[]
  }
  constructor(props){
    super(props);
    this.handleItemClick=this.handleItemClick.bind(this);
    firebase.firestore().collection('articles').onSnapshot(snapshot=>{
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
  componentDidMount(){
    this.checkState();
    Redux.subscribe(()=>{
      this.checkState();
    })
  }
  checkState(){
    let state = Redux.getState();
    if(state.user)
      this.setState({
        userWritable:state.user.role==="Editor"||state.user.role==="Admin"
      })
  }
  handleItemClick(e,d){
    //console.log(d);
    this.setState({tab:d.tab})

  }
  render=()=>(
    <ResponsiveContainer>
      <Container text style={{padding:20,minHeight:700}}>
      <Segment clearing basic>
        <Header as='h1' floated="left">Articles</Header>
        {this.state.userWritable?<Button as={Link} to="/articles/create" floated='right' color="teal" icon><Icon name="write" /> Write an article</Button>:''}
      </Segment>
      {
        this.state.articles.map((article,index)=>
          
          <Segment key={index} basic>
          <Header as='h2'>{article.title}</Header>
          
            {article.document}
            {article.date?(<div><Label floating style={{textAlign:'center'}}>
    <Icon name='calendar alternate' /> {moment(article.date).format('D/M/YYYY')}
      </Label></div>):''}
            <div>
              <Button as={Link}  to={"/articles/"+article.id}>Read Article</Button>
            </div>
          </Segment>
       )
      }
      
      
      </Container>
    </ResponsiveContainer>
  )
}