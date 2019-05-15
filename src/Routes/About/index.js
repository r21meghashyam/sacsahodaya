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
    <Segment>
    <Header as='h3' style={{ fontSize: '2em' }}>
      About Sahodaya
    </Header>
    
      Sahodaya, an outreach programme for the empowerment of the Specially abled was started in 2000 to conscientize the staff and the students towards the needs and aspirations of the Specially Abled. The outreach programme has been constantly working with groups and institutions catering to the needs of such people. We are proud to say that the Sahodayans have imbibed the spirit of growing together and lend their mite towards empowering people with disabilities even after completion of their studies.
    </Segment>
    <Segment>
    <h2>Objectives</h2>
    <ul>
      <li>To conscientize the staff and students of the college to the needs of the Differently Challenged </li>
      <li>To conscientize Differently Challenged to the need to grow in self esteem and become self-dependent by organizing programmes in personality development and counseling  </li>
      <li>To create awareness among specific target groups and the general public regarding the concerns of the Differently Challenged. </li>
      <li>To conduct specialized short-term courses in Communicative English for the Visually Impaired and the Hearing Impaired. </li>
      <li>To conduct in –house courses in communicative English in the institutions working for the Differently Challenged.</li>
    </ul>
    </Segment>
    </Container>
   
  </ResponsiveContainer>
    );
  }
}