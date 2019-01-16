import React, {Component} from 'react'
import {
Header,
Container,
Form,
Button,
Icon,
Segment
} from 'semantic-ui-react' 
import { isKeyHotkey } from 'is-hotkey'
import isUrl from 'is-url'


import { Editor, getEventTransfer } from 'slate-react'
import {Link} from 'react-router-dom'

import ResponsiveContainer from '../../../Components/ResponsiveContainer'
import { Value } from 'slate'
import firebase from 'firebase/app'


const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
      },
    ],
  },
})


function unwrapLink(editor) {
  editor.unwrapInline('link')
}
function wrapLink(editor, href) {
  editor.wrapInline({
    type: 'link',
    data: { href },
  })

  editor.moveToEnd()
}
//Components

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */



export default class EditArticle extends Component{ 
	state={
		images:[],
		error:{},
		value: initialValue
	}
	
	close(){
		this.setState({modalOpen:false})
	  }
	  onChange(e){
		this.setState({[e.target.name]:e.target.value});
		}
		onValueChange = ({ value }) => {
			this.setState({ value })
		}
		onKeyDown = (event, editor, next) => {
			let mark
	
			if (isBoldHotkey(event)) {
				mark = 'bold'
			} else if (isItalicHotkey(event)) {
				mark = 'italic'
			} else if (isUnderlinedHotkey(event)) {
				mark = 'underlined'
			} else if (isCodeHotkey(event)) {
				mark = 'code'
			} else {
				return next()
			}
	
			event.preventDefault()
			editor.toggleMark(mark)
		}
	  onSubmit(e){
			e.preventDefault()
			//console.log(this)
			let btn = document.querySelector('#postBtn')
			btn.disabled=true
			btn.innerHTML="Updating..."
			let {error,title} = this.state
			//VALIDATION
			error={};
			if(!title||title.trim()==="")
				error.title="Title is empty";
		
			this.setState({error});
			if(Object.keys(error).length>0)
				return;
			firebase.firestore().collection('articles').doc(this.state.id).set({
				title,
				body:JSON.stringify(this.state.value.toJSON())
			},{merge:true}).then(doc=>{
				
				this.setState({
					completed:true
				})
			})
		}
		ref = editor => {
			this.editor = editor
		}
	
	  constructor(props){
		super(props);
		this.close=this.close.bind(this);
		this.onChange=this.onChange.bind(this);
		this.onSubmit=this.onSubmit.bind(this);
		this.ref=this.ref.bind(this);
	  }
	  componentDidMount(){
		  firebase.firestore().collection('articles').doc(this.props.match.params.article_id).get().then(doc=>{
			  this.setState({
				  id:doc.id,
				  value:Value.fromJSON(JSON.parse(doc.data().body)),
				  title:doc.data().title
			  })
		  })
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
		hasMark = type => {
			const { value } = this.state
			return value.activeMarks.some(mark => mark.type === type)
		}
		onClickMark = (event, type) => {
			event.preventDefault()
			this.editor.toggleMark(type)
		}
		renderMarkButton = (type, icon) => {
			const isActive = this.hasMark(type)
	
			return (
					<Icon name={icon} circular inverted color={isActive?'teal':'black'} bordered
					onMouseDown={event => this.onClickMark(event, type)}
					/>
			)
		}
		hasBlock = type => {
			const { value } = this.state
			return value.blocks.some(node => node.type === type)
		}
		onClickBlock = (event, type) => {
			event.preventDefault()
	
			const { editor } = this
			const { value } = editor
			const { document } = value
	
			// Handle everything but list buttons.
			if (type !== 'bulleted-list' && type !== 'numbered-list') {
				const isActive = this.hasBlock(type)
				const isList = this.hasBlock('list-item')
	
				if (isList) {
					editor
						.setBlocks(isActive ? DEFAULT_NODE : type)
						.unwrapBlock('bulleted-list')
						.unwrapBlock('numbered-list')
				} else {
					editor.setBlocks(isActive ? DEFAULT_NODE : type)
				}
			} else {
				// Handle the extra wrapping required for list buttons.
				const isList = this.hasBlock('list-item')
				const isType = value.blocks.some(block => {
					return !!document.getClosest(block.key, parent => parent.type === type)
				})
	
				if (isList && isType) {
					editor
						.setBlocks(DEFAULT_NODE)
						.unwrapBlock('bulleted-list')
						.unwrapBlock('numbered-list')
				} else if (isList) {
					editor
						.unwrapBlock(
							type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
						)
						.wrapBlock(type)
				} else {
					editor.setBlocks('list-item').wrapBlock(type)
				}
			}
		}
		renderBlockButton = (type, icon,content) => {
			let isActive = this.hasBlock(type)
	
			if (['numbered-list', 'bulleted-list'].includes(type)) {
				const { value: { document, blocks } } = this.state
	
				if (blocks.size > 0) {
					const parent = document.getParent(blocks.first().key)
					isActive = this.hasBlock('list-item') && parent && parent.type === type
				}
			}
	
			return (
				<Icon name={icon} circular inverted color={isActive?'teal':'black'} bordered
					onMouseDown={event => this.onClickBlock(event, type)}
					>{content}</Icon>
			)
		}
		hasLinks = () => {
			const { value } = this.state
			return value.inlines.some(inline => inline.type === 'link')
		}
		onClickLink = event => {
			event.preventDefault()
	
			const { editor } = this
			const { value } = editor
			const hasLinks = this.hasLinks()
	
			if (hasLinks) {
				editor.command(unwrapLink)
			} else if (value.selection.isExpanded) {
				const href = window.prompt('Enter the URL of the link:')
	
				if (href === null) {
					return
				}
	
				editor.command(wrapLink, href)
			} else {
				const href = window.prompt('Enter the URL of the link:')
	
				if (href === null) {
					return
				}
	
				const text = window.prompt('Enter the text for the link:')
	
				if (text === null) {
					return
				}
	
				editor
					.insertText(text)
					.moveFocusBackward(text.length)
					.command(wrapLink, href)
			}
		}
		onPaste = (event, editor, next) => {
			if (editor.value.selection.isCollapsed) return next()
	
			const transfer = getEventTransfer(event)
			const { type, text } = transfer
			if (type !== 'text' && type !== 'html') return next()
			if (!isUrl(text)) return next()
	
			if (this.hasLinks()) {
				editor.command(unwrapLink)
			}
	
			editor.command(wrapLink, text)
		}
		
  render(){
	  let {error,completed,id} = this.state;
	return (
	  
    <ResponsiveContainer>
      <Container text style={{ marginTop: '7em' ,minHeight:700}}>
        <Header as='h1'>Write your article</Header>
        <Form style={{padding:20}} onSubmit={this.onSubmit} error={Object.keys(error).length>0}>
          <Form.Field>
			<Form.Input fluid label='Article Title' value={this.state.title} placeholder='Article Title' error={Boolean(error.title)} name="title" onChange={this.onChange}/>
          </Form.Field>
					
					<Segment className='editor-tools' inverted>
						{this.renderMarkButton('bold', 'bold')}
						{this.renderMarkButton('italic', 'italic')}
						{this.renderMarkButton('underlined', 'underline')}
						{this.renderBlockButton('numbered-list', 'list ol')}
						{this.renderBlockButton('bulleted-list', 'list ul')}
						{this.renderBlockButton('heading-one', 'header',' 1')}
						{this.renderBlockButton('heading-two', 'header',' 2')}
						{this.renderBlockButton('block-quote', 'quote right')}
						{this.renderBlockButton('block-quote', 'quote right')}
						<Icon name='linkify' circular inverted color={this.hasLinks()?'teal':'black'} bordered onMouseDown={this.onClickLink}/>
						{/*this.renderMarkButton('code', 'code')}
						{this.renderBlockButton('heading-one', 'looks_one')}
						{this.renderBlockButton('heading-two', 'looks_two')}
						
						{this.renderBlockButton('numbered-list', 'format_list_numbered')}
						{this.renderBlockButton('bulleted-list', 'format_list_bulleted')
						<Icon name="bold" circular inverted color={this.state.bold?'teal':'black'} bordered/>
						<Icon name="italic"/>
						<Icon name="underline"/>
					
							<Icon name="header"/>
							<Icon name="image"/>
							<Icon name="window minimize outline"/>
						
					
						<Icon name="list ol"/>
							<Icon name="list ul"/>
					
							<Icon name="align left"/>
							<Icon name="align center"/>
	<Icon name="align right"/>*/}
						</Segment>
				
					
					
						

						
				
				<Segment>

					<Editor 
						value={this.state.value} 
						onKeyDown={this.onKeyDown} 
						onChange={this.onValueChange} 
						spellCheck
						autoFocus
						placeholder="Start writing here."
						ref={this.ref}
						renderMark={this.renderMark}
						renderNode={this.renderNode}
						className="editor"
						onPaste={this.onPaste}
					/>

				</Segment>
			
			
		  {completed?'':<Button type='submit' id="postBtn">Update Article</Button>}
		  {completed?<Button as={Link} to={`/articles/${id}`} color="teal">View Article</Button>:''}
		  
        </Form>
      </Container>
    </ResponsiveContainer>
  )
}
}