import React,{Component} from 'react'
import {
  Container,
  Header,
  Segment,
} from 'semantic-ui-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import ResponsiveContainer from '../../Components/ResponsiveContainer'


export default class About extends Component{

  render(){
    return(
<ResponsiveContainer>
    
    <Container style={{minHeight:800,marginTop:100}}>
    <Header as='h3' style={{ fontSize: '2em' }}>
      About Sahodaya
    </Header>
    <Segment>
      Content Missing
    </Segment>
    </Container>
   
  </ResponsiveContainer>
    );
  }
}