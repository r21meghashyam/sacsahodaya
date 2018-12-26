import React, {Component} from 'react'
import {
Segment,
Header,
Container,
Button,
Icon
} from 'semantic-ui-react'
//Components
import ResponsiveContainer from '../../Components/ResponsiveContainer'

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class NotFound extends Component{ 
  render=()=>(
    <ResponsiveContainer>
      <Segment
                inverted
                textAlign='center'
                style={{ minHeight: 700, padding: '1em 0em' }}
                vertical
              >
              <Container text>
          <Header
          as='h1'
          content='Page Not Found'
          inverted
        style={
          {fontSize:'3em',
          marginTop:'100px'
        }
        }
          />
          <Header
          as='h2'
          content='The page you were looking for does not exists'
          inverted
          
          />
          <Button primary onClick={()=>this.props.history.push('/')}>
            <Icon name='home'/>
            Lets Go Home
          </Button>
      </Container>
              </Segment>
    </ResponsiveContainer>
  )
}