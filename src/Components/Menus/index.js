import React from 'react'
import {
  Menu,
} from 'semantic-ui-react'
import {Link} from 'react-router-dom';

const Menus=(e)=>{
  const links=[
    {location:'/',text:'Home'},
    {location:'/gallery',text:'Gallery'},
    {location:'/articles',text:'Articles'},
    {location:'/members',text:'Members'},
    {location:'/about',text:'About'}
  ];
  return (<React.Fragment>
    {links.map((link,index)=><Menu.Item key={index} as={Link} to={link.location} active={window.location.pathname===link.location}>{link.text}</Menu.Item>)}
  </React.Fragment>)
}
export default Menus;