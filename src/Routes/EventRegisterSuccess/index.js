import React, {Component} from 'react'
import {
Header,
Container,
Icon,
Button
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'
import {Link} from 'react-router-dom'


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EventRegister extends Component{

  
  render=()=>{
    
  return (
    <ResponsiveContainer>
      <Container text textAlign="center" style={{ marginTop: '7em' ,minHeight:700}}>
      <Header as='h1'><Icon name='check' size='massive' />Event Registration Successful</Header>
      <Button as={Link} to="/"  secondary>Go Home</Button>
      
  
      </Container>
    </ResponsiveContainer>
  )
    }
}