import PropTypes from 'prop-types'
import React from 'react'
import {
  Container,
  Header,
  Image
} from 'semantic-ui-react'
import 'particles.js'


const properties = {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "bounce",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }

class LandingSection extends React.Component{
    componentDidMount(){
        let particles = document.querySelector("#particles");
        
        window.particlesJS('particles',properties);
    }
    render(){
        let { mobile } = this.props;
        return(
            <Container text>
            <div id="particles" style={{position:"absolute",width:"100%",height:"100%",left:0,top:0}}>
            
            </div>
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
    }
}

LandingSection.propTypes = {
mobile: PropTypes.bool,
}

export default LandingSection