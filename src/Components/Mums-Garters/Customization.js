import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Layout, Input, Icon, Select, Checkbox, Button, Tooltip, Divider } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem, faRibbon, faFeatherAlt } from '@fortawesome/free-solid-svg-icons'
import { camelize } from '../Shared'
import icons from '../icons'
import prices from '../../price-list'

const { Header, Content, Footer } = Layout

const colors = [ 'red', 'blue', 'white', 'yellow', 'gold', 'silver', 'maroon', 'black']
const activities = ['Band', 'Choir', 'Cheer', 'Theater', 'FFA', 'ROTC']
const sports = ['Basketball', 'Football', 'Soccer', 'Volleyball', 'Tennis', 'Golf', 'Track', 'Cross Country', 'Baseball', ]
const trinketsAvailable = ['cuteTigerPlush', 'tigerHeadPlush', 'tigerPawPick', 'footballPick', 'dimensionalFootball', 'dimensionalMegaphone']
const dieCutsAvailable = ['First Name', 'School Name', 'Custom Word', 'Mascot Name', 'Mascot Logo', 'Cheer Package', 'Senior Package']
const failsafe = ['school', 'colors', 'names', 'activities', 'extras']
const oneWeek =  7 * 8.64e+7


const additions = ({ extra, id }) => (
  <span className='addition-cost'> + ${!isNaN(extra) ? extra.toFixed(2) : '#.##'}</span>
)

class Customization extends Component {
  constructor(props) {
    super(props)
    window.scrollTo(0, 0)
    const date = new Date().getTime()
    const customStorage = JSON.parse(window.localStorage.getItem('custom')) || { date, details: Object.assign(...failsafe.map(val => ({ [val]: {} }))) }
    const details = (customStorage.date - date) < oneWeek ? customStorage.details : Object.assign(...failsafe.map(val => ({ [val]: {} })))
    const path = props.match.params
    const category = path[0].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    const product = path[1].replace('-', ' ').replace(/\b[\w']+\b/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })

    const prod = product.toLowerCase().replace(' ', '')
    const { loops, boa, bling, extraWidth, dieCuts } = prices.main[prod]
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
        loops: loops ? details.extras.loops : false || false,
        boa: boa ? details.extras.boa : false || false,
        bling: bling ? details.extras.bling : false || false,
        extraWidth: extraWidth ? details.extras.extraWidth : false || false,
        trinkets: details.extras.trinkets || [],
        dieCuts: dieCuts.general.price ? details.extras.dieCuts || [] : [],
      },
    }
  }

  colors = ({ colors, type }) => {
    const array = !type.includes('ary') ? ['None'].concat(colors) : colors
    return (
      <Select value={this.state.colors[type.toLowerCase()] || type} style={{ width: '33.3333%' }} onChange={value => this.handleChange({ category: 'colors', property: type.toLowerCase(), value })}>
        {array.map(option =>
          <Select.Option key={option}>{option !== 'None' && <Icon type="smile" theme="filled" style={{ color: option === 'white' ? 'whitesmoke' : option }} />} {option.charAt(0).toUpperCase() + option.substring(1)}</Select.Option>
        )}
      </Select>
    )
  }

  activities = ({ activities, sports }) => {
    const array = ['None'].concat(activities).concat(sports)
    return (
      Object.keys(this.state.activities).map(activity =>
        <Select key={activity} value={this.state.activities[activity] || `Select Activity`} onChange={value => this.handleChange({ category: 'activities', property: activity, value })} style={{ width: '100%' }}>
          {array.map(option => {
            const activity = option.charAt(0).toUpperCase() + option.substring(1)
            const icon = icons[activity]
           return <Select.Option key={option}>{icon}<span style={{ margin: '0 5px' }}>{activity}</span></Select.Option>
          })}
        </Select>
      )
    )
  }

  trinkets = (trinkets) => {
    const trinketsArray = this.state.extras.trinkets
    const array = Object.assign([], trinketsArray, {[trinketsArray.length]: false})
    return (
      <div>
        {array.map((selected, index) =>
          <div key={`trinket${index}`} style={{ margin: '8px 0' }}>
            {selected && <Button className="remove-trinket" icon="close" shape="circle" type="danger" size="small" onClick={() => this.handleTrinket({ index, value: false })} />}
            <Icon type="thunderbolt" style={{ margin: '10px 10px 0 0', color: selected ? '#68C6BF' : 'inherit' }} />
            <Select value={selected || `Mascots and Premium Trinkets`} onChange={value => this.handleTrinket({ index, value })}>
              {trinketsAvailable.map(option => <Select.Option key={option}>{trinkets[option].name} {!selected && additions({ extra: trinkets[option].price })}</Select.Option>)}
            </Select>
            {selected ? additions({ extra: trinkets[selected].price }) : ''}
          </div>
        )}
        <Divider />
      </div>
    )
  }

  dieCuts = (dieCuts) => {
    const dieCutsArray = this.state.extras.dieCuts
    const array = Object.assign([], dieCutsArray, {[dieCutsArray.length]: false})
    const avail = dieCutsAvailable
    return (
      <div>
        {array.map((selected, index) =>
          <div key={`dieCut${index}`} className='die-cuts' style={{ margin: '8px 0' }}>
            {selected !== false &&
              <Button
                className="remove-trinket"
                icon="close"
                shape="circle"
                type="danger"
                size="small"
                onClick={() => this.handleDieCuts({ index, value: false })}
              />
            }
            <Icon type="switcher" style={{ margin: '10px 10px 0 0', color: selected !== false ? '#68C6BF' : 'inherit' }} />
            <Input.Group compact style={{ display: 'initial' }}>
              <Select
                className={selected === 'Custom Word' || !avail.includes(selected) ? 'custom-word' : ''}
                value={selected === false ? `Custom Die Cuts` : !avail.includes(selected) ? 'Custom Word' : selected}
                onChange={value => this.handleDieCuts({ index, value })}
                style={{ width: selected === false && 225 }}
              >
                {avail.map(option => {
                  const cat = option.includes('Package') ? camelize(option) : 'general'
                  return <Select.Option key={option}>{option} {!selected && additions({ extra: dieCuts[cat].price })}</Select.Option>
                })}
              </Select>
              {selected !== false && (selected === 'Custom Word' || !selected.length || !avail.includes(selected)) ?
                <Input
                  required
                  className={selected === 'Custom Word' || !avail.includes(selected) ? 'custom-word' : ''}
                  value={selected === 'Custom Word' ? '' : selected}
                  placeholder='Senior, John 3:16, Stud, etc.'
                  onChange={e => this.handleDieCuts({ index, value: e.target.value })}
                /> : ''
              }
            </Input.Group>
            {selected !== false ? additions({ extra: selected.includes('Package') ? dieCuts[camelize(selected)].price : dieCuts.general.price }) : ''}
          </div>
        )}
        <Divider />
      </div>
    )
  }

  handleChange = ({ category, property, value }) => {
    const newState = { ...this.state[category] }
    newState[property] = value === 'None' ? null : value
    this.setState({ [category]: newState }, () => window.localStorage.setItem('custom', JSON.stringify({ date: new Date().getTime(), details: this.state })))
  }

  handleTrinket = ({ index, value }) => {
    const newState = { ...this.state.extras }
    const newTrinkets = Object.assign([], newState.trinkets, {[index]: value}).filter(item => item)
    newState.trinkets = newTrinkets
    this.setState({ extras: newState }, () => window.localStorage.setItem('custom', JSON.stringify({ date: new Date().getTime(), details: this.state })))
  }

  handleDieCuts = ({ index, value }) => {
    const newState = { ...this.state.extras }
    const newDieCuts = Object.assign([], newState.dieCuts, {[index]: value}).filter(item => item !== false)
    newState.dieCuts = newDieCuts
    this.setState({ extras: newState }, () => window.localStorage.setItem('custom', JSON.stringify({ date: new Date().getTime(), details: this.state })))
  }

  handleCart = () => {
    ReactGA.event({ category: 'Customization', action: 'Add To Cart' })
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

  totalCost = () => {
    const { extras, category, product } = this.state
    const cat = category.toLowerCase()
    const prod = product.toLowerCase().replace(' ', '')
    const { trinkets, dieCuts } = prices.main[prod]
    const xtras = ['loops', 'boa', 'bling', 'extraWidth']
    const baseItem = prices.main[prod][cat].price
    const totalExtras = xtras.filter(x => extras[x]).reduce((acc, xtra) => acc + prices.main[prod][xtra], 0)
    const totalTrinkets = extras.trinkets.reduce((acc, tri) => acc + trinkets[tri].price, 0)
    const totalDieCuts = extras.dieCuts.reduce((acc, di) => acc + dieCuts[di.includes('Package') ? camelize(di) : 'general'].price, 0)
    const totalCost = baseItem + totalExtras + totalTrinkets + totalDieCuts
    const total = Number(totalCost.toFixed(2))

    return total
  }

  render() {
    const { school, names, extras, category, product, toRedirect, modify } = this.state
    if (toRedirect) return <Redirect to='/cart' />
    const prod = product.toLowerCase().replace(' ', '')
    const { loops, boa, bling, extraWidth, dieCuts, trinkets } = prices.main[prod]
    const total = this.totalCost()

    return (
      <Layout style={{ background: 'white', padding: '0 4%' }}>
        <Header style={{ textAlign: 'center' }}><h1>{product} {category.replace('s','')} Customization</h1></Header>
        <Content style={{ background: 'white' }}>
          <div className='cards' style={{ justifyContent: 'center' }}>
            <div className='card customization-image' style={{  }}>
              <img
                src={`/media/current-models/${product.replace(' ', '-').toLowerCase()}-${category.replace('s','')}.png`}
                onError={e => { e.target.onerror = null; e.target.src="https://via.placeholder.com/225x225.png?text=Boutique+Mums" }}
                alt=''
              />
            </div>
            <div className='card customization-details'>
              <div><b>School Name</b></div>
              <Input
                value={school.name}
                onChange={event => this.handleChange({ category: 'school', property: 'name', value: event.target.value })}
                placeholder='Rydell, Walkerville, Hogwarts, etc.'
                suffix={
                  <Tooltip title={'Required Field'}>
                    <Icon type="info-circle" style={{ color: 'gray' }} />
                  </Tooltip>
                }
              />
              <div><b>School Mascot</b></div>
              <Input
                value={school.mascot}
                onChange={event => this.handleChange({ category: 'school', property: 'mascot', value: event.target.value })}
                placeholder='Lions, Tigers, Bears...'
                suffix={<Tooltip title={'Required Field'}><Icon type="info-circle" style={{ color: 'gray' }} /></Tooltip>}
              />
              <div><b>School Colors</b></div>
              <Input.Group compact>
                {this.colors({ colors, type: 'Primary' })}
                {this.colors({ colors, type: 'Secondary' })}
                {this.colors({ colors, type: 'Accent' })}
              </Input.Group>
              <div><b>Names</b></div>
              <Input.Group compact>
                <Input
                  value={names.first}
                  onChange={event => this.handleChange({ category: 'names', property: 'first', value: event.target.value })}
                  style={{ width: '50%' }}
                  placeholder="Clark Kent"
                  suffix={<Tooltip title={'Required Field'}><Icon type="info-circle" style={{ color: 'gray' }} /></Tooltip>}
                />
                <Input
                  value={names.second}
                  onChange={event => this.handleChange({ category: 'names', property: 'second', value: event.target.value })}
                  style={{ width: '50%' }}
                  placeholder="Lois Lane"
                />
              </Input.Group>
              <div><b>Activities</b></div>
              {this.activities({ activities, sports })}
              <div style={{ marginTop: 10 }}><b>Additions</b></div>
              <div>{this.trinkets(trinkets)}</div>
              {dieCuts.general.price && <div>{this.dieCuts(dieCuts)}</div>}
              <div><Checkbox disabled={loops === null} checked={extras.loops} onChange={() => this.handleChange({ category: 'extras', property: 'loops', value: !extras.loops })}><FontAwesomeIcon icon={faRibbon} style={{ color: extras.loops ? '#68C6BF' : 'inherit' }} /> {product.match(/Spirit|Mini|Small/) ? 'Add Single Color Loops' : 'Upgrade To Decorative Loops'}{loops ? additions({ extra: loops }) : ''}</Checkbox></div>
              <div><Checkbox disabled={boa === null} checked={extras.boa} onChange={() => this.handleChange({ category: 'extras', property: 'boa', value: !extras.boa })}><FontAwesomeIcon icon={faFeatherAlt} style={{ color: extras.boa ? '#68C6BF' : 'inherit' }} /> Add Feather Boa {boa ? additions({ extra: boa }) : ''}</Checkbox></div>
              <div><Checkbox disabled={bling === null} checked={extras.bling} onChange={() => this.handleChange({ category: 'extras', property: 'bling', value: !extras.bling })}><FontAwesomeIcon icon={faGem} style={{ color: extras.bling ? '#68C6BF' : 'inherit' }} /> Add Bling Package {bling ? additions({ extra: bling }) : ''}</Checkbox></div>
              <div><Checkbox disabled={extraWidth === null} checked={extras.extraWidth} onChange={() => this.handleChange({ category: 'extras', property: 'extraWidth', value: !extras.extraWidth })}><Icon type='column-width' style={{ color: extras.extraWidth ? '#68C6BF' : 'inherit' }} /> Add Extra Width {extraWidth ? additions({ extra: extraWidth }) : ''}</Checkbox></div>
              {/* <div><Checkbox disabled={twoTone === null} checked={extras.twoTone} onChange={() => this.handleChange({ category: 'extras', property: 'twoTone', value: !extras.twoTone })}>Add 2-Tone Die Cut {twoTone ? additions({ extra: twoTone }) : ''}</Checkbox></div> */}
              <br />
              <div><i style={{ fontSize: '1.15em' }}>Special instructions can be added on checkout page</i></div>
            </div>

          </div>
        </Content>
          <Footer style={{ background: 'white', textAlign: 'center', padding: '1%', margin: '2% 0 5% 0' }}>
            <h3><b>Total Price:</b> ${total}</h3>
            {/* COVID - Hidden Cart Button */}
            {/* <Button type='primary' onClick={this.handleCart}>{modify ? 'Save Changes' : 'Add To Cart'}</Button> */}
          </Footer>
      </Layout>
    )
  }
}
 
export default Customization
