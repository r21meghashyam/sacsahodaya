import React,{Component} from 'react'
import {
  Container,
  Grid,
  Header,
  List,
  Segment,
} from 'semantic-ui-react'
import Menus from '../Menus';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */


export default class Footer extends Component {
  render= () => (
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Links' />
              <List link inverted>
                <Menus/>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Other Links' />
              <List link inverted>
                <List.Item as='a' href="http://staloysiuscollege.co.in/" target="_blank">Aloysius Website</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
             
              <p>
                &copy; {(new Date()).getFullYear()} St. Aloysius College (Autonomous)
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
)

  }
