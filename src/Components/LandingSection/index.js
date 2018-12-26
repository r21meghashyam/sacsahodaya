import PropTypes from 'prop-types'
import React from 'react'
import {
  Container,
  Header,
  Image
} from 'semantic-ui-react'

const LandingSection = ({ mobile }) => (
    <Container text>
            <Image src='/logo.png' style={{ margin:"auto",marginTop: mobile ? '1.5em' : '3em', width:150}} />
        <Header
        as='h1'
        content='SAHODAYA'
        inverted
        style={{
            fontSize: mobile ? '2em' : '4em',
            fontWeight: 'normal',
            marginBottom: 0,
        }}
        />
        <Header
        as='h2'
        content='No act of kindness, no matter how small, is ever wasted.'
        /**
         * Together we can change the world, just one random act of kindness at a time.
         */
        inverted
        style={{
            fontSize: mobile ? '1.5em' : '1.7em',
            fontWeight: 'normal',
            marginTop: mobile ? '0.5em' : '1.5em',
        }}
        />
    </Container>
)

LandingSection.propTypes = {
mobile: PropTypes.bool,
}

export default LandingSection