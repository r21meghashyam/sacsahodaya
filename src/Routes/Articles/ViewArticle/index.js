import React, {Component} from 'react'
import {
Header,
Container,
Segment,
Button,
Icon,
Label
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
//Components
import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import firebase from 'firebase/app'

import { Editor } from 'slate-react'
import { Value } from 'slate'
import moment from 'moment'
import Redux from '../../../Lib/Redux';



/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class ViewArticle extends Component{ 
  state={
  }
  constructor(props){
    super(props);
    this.handleItemClick=this.handleItemClick.bind(this);
    firebase.firestore().collection('articles').doc(this.props.match.params.article_id).get().then(doc=>{
      let data = doc.data();
      data.id=doc.id;
      data.document = Value.fromJSON(JSON.parse(data.body))
      this.setState(data)
    })
  }
  componentDidMount(){
    this.checkState();
    Redux.subscribe(()=>{
      this.checkState();
    })
  }
  checkState(){
    let state = Redux.getState();
    if(state.user)
      this.setState({
        userWritable:state.user.role==="Editor"||state.user.role==="Admin"
      })
  }
  handleItemClick(e,d){
    //console.log(d);
    this.setState({tab:d.tab})

  }
  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }
  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'link': {
        const { data } = node
        const href = data.get('href')
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        )
      }
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }
  render=()=>(
    <ResponsiveContainer>
      <Container text style={{padding:20,minHeight:700}}>
      <Segment clearing basic>
        <Header as='h1' floated="left">{this.state.title}</Header>
        {this.state.userWritable?<Button as={Link} to={'/articles/edit/'+this.state.id} floated='right' color="teal" icon><Icon name="write" /> Edit</Button>:''}
      </Segment>
      {this.state.date?(<Label>
    <Icon name='calendar alternate' /> {moment(this.state.date).format('D/M/YYYY')}
      </Label>):''}
      {this.state.document?<Editor 
            value={this.state.document} 
            className='editor'
            readOnly
						renderMark={this.renderMark}
						renderNode={this.renderNode}
					/>:''}
      </Container>
    </ResponsiveContainer>
  )
}