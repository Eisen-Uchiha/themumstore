import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Layout, Input, Icon, Select, Checkbox, Button, Breadcrumb, Typography } from 'antd'
import config from '../config'
import prices from '../../price-list'

const { Header, Content, Sider } = Layout

const colors = [ 'red', 'blue', 'green', 'yellow', 'purple', 'gold', 'silver', 'white', 'black']
const activities = ['Band', 'Choir', 'Cheer', ]
const sports = ['Basketball', 'Football', 'Soccer', 'Volleyball', 'Tennis']
const failsafe = ['school', 'colors', 'names', 'activities', 'extras']
const oneWeek =  7 * 8.64e+7


const additions = ({ extra, id }) => (
  <span style={{ color: 'green' }}>+ ${!isNaN(extra) ? extra.toFixed(2) : '#.##'}</span>
)
// Set random id to correspond with the order that goes in the cart.
// Pull master object from local storage and add id and specs to the master object for the cart and set

class Customization extends Component {
  constructor(props) {
    super(props)
    const date = new Date().getTime()
    const customStorage = JSON.parse(window.localStorage.getItem('custom')) || { date, details: Object.assign(...failsafe.map(val => ({ [val]: {} }))) }
    const details = (customStorage.date - date) < oneWeek ? customStorage.details : {}
    const path = props.match.params
    const category = path[0].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    const product = path[1].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })

    // Set the state directly. Use props if necessary.
    this.state = {
      toRedirect: null,
      modify: customStorage.modify || null,
      category: category,
      product: product,
      school: {
        name: details.school.name || '',
        mascot: details.school.mascot || '',
      },
      colors: {
        primary: details.colors.primary || null,
        secondary: details.colors.secondary || null,
        accent: details.colors.accent || null,
      },
      names: {
        first: details.names.first || '',
        second: details.names.second || ''
      },
      activities: {
        first: details.activities.first || null,
        second: details.activities.second || null,
        third: details.activities.third || null,
      },
      extras: {
        loops: details.extras.loops || false,
        boa: details.extras.boa || false,
        bling: details.extras.bling || false,
        extraWidth: details.extras.extraWidth || false,
        twoTone: details.extras.twoTone || false,
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
          {activities.concat(sports).map(option => {
            const activity = option.charAt(0).toUpperCase() + option.substring(1)
            const icon = config[activity]
           return <Select.Option key={option}>{icon}<span style={{ margin: '0 5px' }}>{activity}</span></Select.Option>
          })}
        </Select>
      )
    )
  }

  handleChange = ({ category, property, value }) => {
    const newState = { ...this.state[category] }
    newState[property] = value
    this.setState({ [category]: newState }, () => window.localStorage.setItem('custom', JSON.stringify({ date: new Date().getTime(), details: this.state })))
  }

  handleCart = () => {
    const { modify, ...current } = this.state
    const name = `${current.product.replace(' ', '-')}${current.category.replace('s', '')}`
    const date = new Date().getTime()
    let number = 1, id = name + number

    const check = this.inputCheck(current)
    if (check !== true) {
      window.alert(`Fields Required: ${check.join(', ')}`)
      return
    }

    const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date, products: {} }
    const products = (cartStorage.date - date) < oneWeek ? cartStorage.products : {}

    const productCheck = () => {
      if (modify) products[modify] = current
      else if (!products[id]) products[id] = current
      else { number++; id = `${name}${number}`; productCheck() }
    }

    productCheck()
    window.localStorage.setItem('cart', JSON.stringify({ date, products }))
    window.localStorage.removeItem('custom')
    this.props.onCart()
    this.setState({ toRedirect: true })
  }

  inputCheck = (current) => {
    const empty = []
    if (current.school.name.length === 0) empty.push('School Name')
    if (current.school.mascot.length === 0) empty.push('School Mascot')
    if (!current.colors.primary) empty.push('Primary Color')
    if (!current.colors.secondary) empty.push('Secondary Color')
    if (!current.names.first) empty.push('Name 1')
    if (empty.length === 0) return true
    else return empty
  }

  render() {
    const { school, names, extras, category, product, toRedirect, modify } = this.state
    if (toRedirect) return <Redirect to='/cart' />
    const cat = category.toLowerCase()
    const prod = product.toLowerCase().replace(' ', '')
    const { loops, boa, bling, extraWidth, twoTone } = prices.main[prod]
    const xtras = ['loops', 'boa', 'bling', 'extraWidth', 'twoTone']
    const totalCost = prices.main[prod][cat] + xtras.filter(x => extras[x]).reduce((acc, xtra) => acc + prices.main[prod][xtra], 0)
    const totalCostForm = Number(totalCost.toFixed(2))

    return (
      <Layout style={{ minHeight: '100px', background: 'white', padding: '0 4%' }}>
        <Header style={{ textAlign: 'center' }}><span>This is the <b>{product}</b> <b>{category}</b> Order Customization Page</span></Header>
        <Layout style={{ background: 'white' }}>
          <Content style={{ textAlign: 'center', margin: '2%' }}>
            <div><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" alt='' style={{ width: 'auto', padding: '5%' }} /></div>
          </Content>
          <Sider width='35%' style={{ margin: '2%' }}>
            <div><b>School Name</b></div>
            <Input value={school.name} onChange={event => this.handleChange({ category: 'school', property: 'name', value: event.target.value })} placeholder='Rydell, Walkerville, Hogwarts, etc.' />
            <div><b>School Mascot</b></div>
            <Input value={school.mascot} onChange={event => this.handleChange({ category: 'school', property: 'mascot', value: event.target.value })} placeholder='Lions, Tigers, Bears...' />
            <div><b>School Colors</b></div>
            <Input.Group compact>
              {this.colors({ colors, type: 'Primary' })}
              {this.colors({ colors, type: 'Secondary' })}
              {this.colors({ colors, type: 'Accent' })}
            </Input.Group>
            <div><b>Names</b></div>
            <Input.Group compact>
              <Input value={names.first} onChange={event => this.handleChange({ category: 'names', property: 'first', value: event.target.value })} style={{ width: '50%' }} placeholder="Clark Kent" />
              <Input value={names.second} onChange={event => this.handleChange({ category: 'names', property: 'second', value: event.target.value })} style={{ width: '50%' }} placeholder="Lois Lane" />
            </Input.Group>
            <div><b>Activities</b></div>
            {this.activities({ activities, sports })}
            <div style={{ marginTop: 10 }}><b>Additions</b></div>
            <div><Checkbox disabled={loops === null} checked={extras.loops} onChange={() => this.handleChange({ category: 'extras', property: 'loops', value: !extras.loops })}>{product.match(/Spirit|Mini|Small/) ? 'Add Single Color Loops' : 'Upgrade To Decorative Loops'}{loops ? additions({ extra: loops }) : ''}</Checkbox></div>
            <div><Checkbox disabled={boa === null} checked={extras.boa} onChange={() => this.handleChange({ category: 'extras', property: 'boa', value: !extras.boa })}>Add Feather Boa {boa ? additions({ extra: boa }) : ''}</Checkbox></div>
            <div><Checkbox disabled={bling === null} checked={extras.bling} onChange={() => this.handleChange({ category: 'extras', property: 'bling', value: !extras.bling })}>Add Bling Package {bling ? additions({ extra: bling }) : ''}</Checkbox></div>
            <div><Checkbox disabled={extraWidth === null} checked={extras.extraWidth} onChange={() => this.handleChange({ category: 'extras', property: 'extraWidth', value: !extras.extraWidth })}>Add Extra Width {extraWidth ? additions({ extra: extraWidth }) : ''}</Checkbox></div>
            <div><Checkbox disabled={twoTone === null} checked={extras.twoTone} onChange={() => this.handleChange({ category: 'extras', property: 'twoTone', value: !extras.twoTone })}>Add 2-Tone Die Cut {twoTone ? additions({ extra: twoTone }) : ''}</Checkbox></div>
          </Sider>
        </Layout>
          <Content style={{ textAlign: 'center', padding: '1%' }}>
            <h3><b>Total Price:</b> ${totalCostForm}</h3>
            <Button type='primary' onClick={this.handleCart}>{modify ? 'Save Changes' : 'Add To Cart'}</Button>
          </Content>
      </Layout>
    )
  }
}
 
export default Customization



// {
//   "date": 1566687070488,
//   "products": {
//     "MediumMum1": {
//       "category": "Mums",
//       "product": "Medium",
//       "toRedirect": null,
//       "school": {
//         "name": "Hogwarts",
//         "mascot": "Wiz Kids"
//       },
//       "colors": {
//         "primary": "red",
//         "secondary": "gold",
//         "accent": "purple"
//       },
//       "names": {
//         "first": "Hairy Potter",
//         "second": "Professor Xavier"
//       },
//       "activities": {
//         "first": "Cheer",
//         "second": "Soccer",
//         "third": "Choir"
//       },
//       "extras": {
//         "loops": true,
//         "boa": true,
//         "bling": true,
//         "extraWidth": true,
//         "twoTone": true
//       }
//     }
//   }
// }