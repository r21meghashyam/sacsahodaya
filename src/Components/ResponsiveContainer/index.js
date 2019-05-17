import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Image
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Menus from '../Menus';
import Redux from '../../Lib/Redux';

//Components
import LandingSection from '../../Components/LandingSection'
import Footer from '../Footer';

class DesktopContainer extends Component {
    state = {
      authChecked:false,
      home:false,
      path:'',
      fixed:false
    }
    
    hideFixedMenu = () => this.state.home&&this.setState({ fixed: false })
    showFixedMenu = () => this.state.home&&this.setState({ fixed: true })
    checkRoute(){
      if(this.state.path!==window.location.pathname)
      this.setState({
        home:window.location.pathname==='/',
        path:window.location.pathname,
        fixed:window.location.pathname!=='/'
      })
    }
    componentDidMount(){
      this.checkRoute();
      this.checkAuth();
      this.REDUX_UNSUBSCRIBE = Redux.subscribe(()=>{
        this.checkAuth();
      })
    }
    checkAuth(){
      let state = Redux.getState();
      
      this.setState({
        userLoggedIn:state.loggedIn,
        authChecked:state.authChecked,
        name:state.loggedIn?state.user.firstName:''
      })
    }

    componentWillUnmount(){
      this.REDUX_UNSUBSCRIBE();
    }
    componentDidUpdate(prevProps) {
     this.checkRoute();
     
    }
    render() {
      const { children } = this.props
      const { fixed,userLoggedIn,authChecked,home,name } = this.state
      
      return (
        
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >
            <Segment
              inverted
              textAlign='center'
              style={home?{ minHeight: 700, padding: '1em 0em'}:{padding:'0px'}}
              vertical
            >
            
              <Menu
                fixed={fixed ? 'top' : null}
                inverted={true}
                pointing={!fixed}
                secondary={!fixed}
                size='large'
                
              >
                <Container style={{position:"relative",zIndex:"1000"}}>
                {!this.state.fixed?'':
                <React.Fragment>
                  <Menu.Item as={Link} to="/" header>
                    <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
                    SAHODAYA
                  </Menu.Item>
                </React.Fragment>
              }
                 <Menus/>
                 <Menu.Item position='right'>
                  {
                    authChecked?(userLoggedIn?
                      <React.Fragment>
                        <Link to="/profile"><Button icon> <Icon name="user" color="blue"/> {name}</Button></Link> 
                        <Button as={Link} to="/logout" inverted={true} color="red">
                          Log Out
                        </Button>
                      </React.Fragment>
                      :
                        <React.Fragment>
                          <Button as={Link} to="/login"  primary>
                            Log in
                          </Button>
                          <Button as={Link} to="/register"  color="green" style={{ marginLeft: '0.5em' }}>
                            Register
                          </Button>
                        </React.Fragment>
                      )
                    :<React.Fragment><Icon loading name='spinner' />Checking status</React.Fragment>
                  }
                  </Menu.Item>
                 
                </Container>
              </Menu>
              {this.state.home?<LandingSection />:''}
            </Segment>
          </Visibility>
  
          <div style={{marginTop:50}}>
            {children}
          </div>
        </Responsive>
      )
    }
  }
  
  DesktopContainer.propTypes = {
    children: PropTypes.node,
  }
  
  class MobileContainer extends Component {
    state = {
      authChecked:false,
      home:false,
      path:''
    }
  
    handleSidebarHide = () => this.setState({ sidebarOpened: false })
  
    handleToggle = () => this.setState({ sidebarOpened: true })
    checkRoute(){
      if(this.state.path!==window.location.pathname)
      this.setState({
        home:window.location.pathname==='/',
        path:window.location.pathname,
      })
    }
    componentDidMount(){
      this.checkRoute();
      this.checkAuth();
      this.REDUX_UNSUBSCRIBE = Redux.subscribe(()=>{
        this.checkAuth();
      })
    }
    checkAuth(){
      let state = Redux.getState();
      
      this.setState({
        userLoggedIn:state.loggedIn,
        authChecked:state.authChecked,
        name:state.loggedIn?state.user.firstName:''
      })
    }

    componentWillUnmount(){
      this.REDUX_UNSUBSCRIBE();
    }
    componentDidUpdate(prevProps) {
     this.checkRoute();
     
    }

    render() {
      const { children } = this.props
      const { sidebarOpened,home,userLoggedIn,authChecked,name } = this.state
      //console.log(this.state)
      return (
        <Responsive as={Sidebar.Pushable} maxWidth={Responsive.onlyMobile.maxWidth}>
          <Sidebar
            as={Menu}
            animation='push'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
             <Menus/>
           
          </Sidebar>
  
          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={home?{ minHeight: 350, padding: '1em 0em' }:{}}
              vertical
            >
              <Container style={{position:"relative",zIndex:"1000"}}>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>
                  {
                    authChecked?(userLoggedIn?
                      <React.Fragment>
                         <Link to="/profile"><Button icon> <Icon name="user" color="blue"/> {name}</Button></Link> 
                        <Button as={Link} to="/logout" inverted={true} color="red">
                          Log Out
                        </Button>
                      </React.Fragment>
                      :
                        <React.Fragment>
                          <Button as={Link} to="/login"  primary>
                            Log in
                          </Button>
                          <Button as={Link} to="/register"  color="green" style={{ marginLeft: '0.5em' }}>
                            Register
                          </Button>
                        </React.Fragment>
                      )
                    :<React.Fragment><Icon loading name='spinner' />Checking status</React.Fragment>
                  }
                  </Menu.Item>
                </Menu>
              </Container>
              {home?<LandingSection mobile />:''}
            </Segment>
  
            {children}
          </Sidebar.Pusher>
        </Responsive>
      )
    }
  }
  
  MobileContainer.propTypes = {
    children: PropTypes.node,
  }
  
  const ResponsiveContainer = ({ children }) => (
    <div>
      <DesktopContainer>{children}</DesktopContainer>
      <MobileContainer>{children}</MobileContainer>
      <Footer/>
    </div>
  )
  
  ResponsiveContainer.propTypes = {
    children: PropTypes.node,
  }
export default ResponsiveContainer;  