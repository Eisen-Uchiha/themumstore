import React, { Component } from 'react'
import { Layout, Input, Icon, Select, Checkbox, Button, Menu, Breadcrumb, Typography } from 'antd'

const { Header, Content, Sider, Footer } = Layout

const colors = [ 'red', 'blue', 'green', 'yellow', 'purple', 'gold', 'silver', 'white', 'black']
const activities = ['Band', 'Choir', 'Cheer', ]
const sports = ['Basketball', 'Football', 'Soccer', 'Volleyball', 'Tennis']
// Set random id to correspond with the order that goes in the cart.
// Pull master object from local storage and add id and specs to the master object for the cart and set
// Pull item amount from local storage and add number to badge on menu

class Customization extends Component {
  constructor(props) {
    super(props)
    const custom = JSON.parse(window.localStorage.getItem('custom'))
    console.log(custom)

    // Set the state directly. Use props if necessary.
    this.state = {
      school: {
        name: custom.school.name || '',
        mascot: custom.school.mascot || '',
      },
      colors: {
        primary: custom.colors.primary || null,
        secondary: custom.colors.secondary || null,
        accent: custom.colors.accent || null,
      },
      names: {
        first: custom.names.first || '',
        second: custom.names.second || ''
      },
      activities: {
        first: custom.activities.first || null,
        second: custom.activities.second || null,
        third: custom.activities.third || null,
      },
      extras: {
        loops: custom.extras.loops || false,
        boa: custom.extras.boa || false,
        bling: custom.extras.bling || false,
        extraWidth: custom.extras.extraWidth || false,
        twoTone: custom.extras.twoTone || false,
      },
    }
  }

  colors = ({ colors, type }) => {
    return (
      <Select value={this.state.colors[type.toLowerCase()] || type} style={{ width: '33.3333%' }} onChange={value => this.handleChange({ category: 'colors', property: type.toLowerCase(), value: value })}>
        {colors.map(option =>
          <Select.Option key={option}><Icon type="smile" theme="filled" style={{ color: option === 'white' ? 'whitesmoke' : option }} /> {option.charAt(0).toUpperCase() + option.substring(1)}</Select.Option>
        )}
      </Select>
    )
  }

  activities = ({ activities, sports }) => {
    return (
      Object.keys(this.state.activities).map(activity =>
        <Select key={activity} value={this.state.activities[activity] || `Select Activity`} onChange={value => this.handleChange({ category: 'activities', property: activity, value: value })} style={{ width: '100%' }}>
          {activities.concat(sports).map(option =>
            <Select.Option key={option}>{option.charAt(0).toUpperCase() + option.substring(1)}</Select.Option>
          )}
        </Select>
      )
    )
  }

  handleChange = ({ category, property, value }) => {
    console.log(category, property, value)
    const newState = { ...this.state[category] }
    newState[property] = value
    this.setState({ [category]: newState }, () => window.localStorage.setItem('custom', JSON.stringify(this.state)))
  }

  handleCart = () => {
    console.log(this.state)
    window.localStorage.setItem('cart', JSON.stringify(this.state))
    window.localStorage.removeItem('custom')
    console.log(JSON.parse(window.localStorage.getItem('cart')))
  }

  render() {
    console.log(JSON.parse(window.localStorage.getItem('custom')))
    console.log(JSON.parse(window.localStorage.getItem('cart')))
    const path = this.props.match.params
    const category = path[0].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    const product = path[1].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })

    return (
      <Layout style={{ minHeight: '100px', background: 'white', padding: '0 4%' }}>
        <Header style={{ textAlign: 'center' }}><span>This is the <b>{product}</b> <b>{category}</b> Order Customization Page</span></Header>
        <Layout style={{ background: 'white' }}>
          <Content style={{ textAlign: 'center', margin: '2%' }}>
            <div><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" alt='' style={{ width: 'auto', padding: '5%' }} /></div>
          </Content>
          <Sider width='35%' style={{ margin: '2%' }}>
            <div><b>School Name</b></div>
            <Input value={this.state.school.name} onChange={event => this.handleChange({ category: 'school', property: 'name', value: event.target.value })} placeholder='Rydell, Walkerville, Hogwarts, etc.' />
            <div><b>School Mascot</b></div>
            <Input value={this.state.school.mascot} onChange={event => this.handleChange({ category: 'school', property: 'mascot', value: event.target.value })} placeholder='Lions, Tigers, Bears...' />
            <div><b>School Colors</b></div>
            <Input.Group compact>
              {this.colors({ colors, type: 'Primary' })}
              {this.colors({ colors, type: 'Secondary' })}
              {this.colors({ colors, type: 'Accent' })}
            </Input.Group>
            <div><b>Names</b></div>
            <Input.Group compact>
              <Input value={this.state.names.first} onChange={event => this.handleChange({ category: 'names', property: 'first', value: event.target.value })} style={{ width: '50%' }} placeholder="Clark Kent" />
              <Input value={this.state.names.second} onChange={event => this.handleChange({ category: 'names', property: 'second', value: event.target.value })} style={{ width: '50%' }} placeholder="Lois Lane" />
            </Input.Group>
            <div><b>Activities</b></div>
            {this.activities({ activities, sports })}
            <div style={{ marginTop: 10 }}><b>Additions</b></div>
            <div><Checkbox checked={this.state.extras.loops} onChange={() => this.handleChange({ category: 'extras', property: 'loops', value: !this.state.extras.loops })}>{product.includes('Spirit') || product.includes('Mini') || product.includes('Small') ? 'Add Single Color Loops (Extra Charge)' : 'Upgrade To Decorative Loops (Extra Charge)'}</Checkbox></div>
            <div><Checkbox checked={this.state.extras.boa} onChange={() => this.handleChange({ category: 'extras', property: 'boa', value: !this.state.extras.boa })}>Add Feather Boa</Checkbox></div>
            <div><Checkbox checked={this.state.extras.bling} onChange={() => this.handleChange({ category: 'extras', property: 'bling', value: !this.state.extras.bling })}>Add Bling Package</Checkbox></div>
            <div><Checkbox checked={this.state.extras.extraWidth} onChange={() => this.handleChange({ category: 'extras', property: 'extraWidth', value: !this.state.extras.extraWidth })}>Add Extra Width</Checkbox></div>
            <div><Checkbox checked={this.state.extras.twoTone} onChange={() => this.handleChange({ category: 'extras', property: 'twoTone', value: !this.state.extras.twoTone })}>Add 2-Tone Die Cut</Checkbox></div>
          </Sider>
        </Layout>
          <Content style={{ textAlign: 'center', padding: '1%' }}>
            <Button type='primary' onClick={this.handleCart}>Add To Cart</Button>
          </Content>
      </Layout>
    )
  }
}
 
export default Customization;