import React, {Component} from 'react'
import {
Header,
Container,
Menu,
Segment,
Button,
Icon
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import Albums from './Albums';
import Photos from './Photos';
import Redux from '../../Lib/Redux'

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class Gallery extends Component{ 
  state={
    tab:1,
    userWritable:false
  }
  constructor(props){
    super(props);
    this.handleItemClick=this.handleItemClick.bind(this);
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
      <Container fluid style={{padding:20,minHeight:700}}>
      <Segment clearing basic>
        <Header as='h1' floated="left">Gallery</Header>
        {this.state.userWritable?<Button as={Link} to="/gallery/create" floated='right' color="teal" icon><Icon name="write" /> Create new album</Button>:''}
      </Segment>
      <Menu tabular>
        <Menu.Item name='All Photos' tab={0} active={this.state.tab===0}  onClick={this.handleItemClick} />
        <Menu.Item name='Albums' tab={1} active={this.state.tab===1} onClick={this.handleItemClick} />
      </Menu>
      {
        this.state.tab===0?<Photos/>:<Albums/>
      }
      </Container>
    </ResponsiveContainer>
  )
}