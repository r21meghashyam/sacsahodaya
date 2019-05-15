import React,{Component} from 'react'
import {
  Menu,
} from 'semantic-ui-react'
import {Link} from 'react-router-dom';

export default class Menus extends Component{
  state={links:[
    {location:'/',text:'Home'},
    {location:'/about',text:'About'},
    {location:'/gallery',text:'Gallery'},
    {location:'/events',text:'Events'},
    {location:'/articles',text:'Articles'},
    {location:'/members',text:'Members'},
  ]}
  render(){
    let links=this.state.links;
    return(<React.Fragment>
      {links.map((link,index)=><Menu.Item key={index} as={Link} to={link.location} active={window.location.pathname===link.location}>{link.text}</Menu.Item>)}
    </React.Fragment>)
  }
}
