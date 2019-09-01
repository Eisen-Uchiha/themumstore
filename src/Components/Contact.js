import React, { Component } from 'react'
import { Input, Button, Checkbox, Icon, Tooltip, Content, Layout } from 'antd'

class Contact extends Component {
  state = {
    fields: {
      name: { formatted: false, value:'' },
      email: { formatted: false, value:'' },
      message: { formatted: false, value:'' },
      sendCart: {formatted: true, value: false },
    },
    sent: false,
  }

  handleSubmit = event => {
    const { name, email, message, sendCart } = this.state.fields
    const formatted = name.formatted && email.formatted && email.formatted

    if (formatted) {
      console.log(name.value)
      console.log(email.value)
      console.log(message.value)
      console.log(sendCart.value)
    }
  }

  handleChange = (event) => {
    const fields = { ...this.state.fields }
    const { target } = event
    const { id, type } = target
    const value = type.includes('text') ? target.value : target.checked
    const formatted = this.formatCheck({ id, value })
    fields[id] = { value, formatted }
    this.setState({ fields })
  }

  formatCheck = ({id, value }) => {
    if (id === 'sendCart') return nameCheck(value)
    else if (id === 'name') return nameCheck(value)
    else if (id === 'email') return emailCheck(value)
    else if (id === 'message') return messageCheck(value)
  }

  render() {
    const { name, email, message, sendCart } = this.state.fields
  
    return (
      <div style={{ padding: '1% 2%', background: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>This is the Contact Page</h1>
        <div className='contact-wrap cards'>
          <div className='contact-left card' style={{ flex: '1 1 26%' }}>
            <form ref={node => this.form = node}>
              <div>
                <Input
                  className='contact-field'
                  ref={node => this.name = node}
                  id='name'
                  size='large'
                  placeholder='Name'
                  value={name.value}
                  onChange={this.handleChange}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    <Tooltip title={name.value.length < 2 ? 'Enter your name' : 'Required Field'}>
                      <Icon type="info-circle" style={{ color: name.value.length < 2 ? 'red' : '#68C6BF' }} />
                    </Tooltip>
                  }
                />
              </div>
              <div>
                <Input
                  className='contact-field'
                  ref={node => this.email = node}
                  id='email'
                  size='large'
                  placeholder='Email'
                  value={email.value}
                  onChange={this.handleChange}
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    <Tooltip title={email.value.length < 10 ? 'Enter a valid email' : 'Required Field'}>
                      <Icon type="info-circle" style={{ color: email.value.length < 10 ? 'red' : '#68C6BF' }} />
                    </Tooltip>
                  }
                />
              </div>
              <div>
                <Input.TextArea
                  className='contact-field'
                  ref={node => this.message = node}
                  id='message'
                  placeholder='Message Required'
                  value={message.value}
                  autosize={{ minRows: 2, maxRows: 4 }}
                  onChange={this.handleChange}
                />
              </div>
              <div className='contact-field'>Send Cart Information <Checkbox ref={node => this.sendCart = node} id='sendCart' checked={sendCart.value} onChange={this.handleChange} /></div>
              <div>
              <Button className={!name.formatted || !email.formatted || !message.formatted ? 'submit-disabled' : ''} onClick={this.handleSubmit}>Submit</Button>
              </div>
            </form>
          </div>
          <div className='contact-right card'>
            <h2>Connect with us:</h2>
            <div><Icon type="facebook" style={{ fontSize: 'xx-large', backgroundColor: 'white', color: '#3b5998' }}/></div>
            <div style={{ marginTop: '10px' }}>For support or any questions:</div>
            <div>Email us at {<a href="mailto:support@pixpa.com" target="_blank" rel="noopener noreferrer">support@boutiquemums.com</a>}</div>
          </div>
        </div>
      </div>
    )
  }
}
 
export default Contact

function nameCheck(value) {
  return value.length > 2
}

function emailCheck(value) {
  return value.match(/(.+)(@)(.+)(\.\w{2,})/) ? true : false
}

function messageCheck(value) {
  return value.length > 10
}