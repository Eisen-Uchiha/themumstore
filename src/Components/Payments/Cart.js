import React, { Component } from 'react'
import { List, Button, Divider, Icon } from 'antd'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem, faRibbon, faFeatherAlt } from '@fortawesome/free-solid-svg-icons'
import { camelize } from '../Shared'
import SmartButtons from './SmartButtons'
import prices from '../../price-list'
import icons from '../icons'

const oneWeek =  7 * 8.64e+7

const schoolDetails = ({ name, mascot }) => (
  <span>
    <span style={{ fontSize: '1.2em' }}>{name}</span>
    <Divider type="vertical" />
    <span style={{ fontSize: '1.2em' }}>{mascot}</span>
  </span>
)

const dots = ({ colors }) => (
  Object.keys(colors).map(c => colors[c] && <span key={c} className={`cart-item-colors ${colors[c].match(/silver/) ? 'silver-color' : ''}`} style={{ backgroundColor: colors[c] }}></span>)
)

const activityIcons = ({ activities, color }) => (
  Object.keys(activities).map(a => activities[a] && <span key={a} style={{ padding: 5, fontSize: 20, color: color.match(/white/) ? 'inherit' : color }}>{icons[activities[a]]}</span>)
)

const addonStyle = ({ color, present }) => {
  const style = {
    padding: '3px',
    margin: '3px',
    color: 'gainsboro'
  }

  if (present) {
    const fill = color === 'white' ? 'inherit' : color
    style.color = fill
  }

  return style
}

class Cart extends Component {
  constructor(props) {
    super(props)
    const date = new Date()
    const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date, products: {} }
    const products = (cartStorage.date - date) < oneWeek ? cartStorage.products : {}
    this.state = { data: this.dataPush(products), products, toRedirect: null, paid: false }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  dataPush = (products) => {
    return Object.keys(products).map(p => ({ id: p, ...products[p] }))
  }

  itemDetails = (item) => {
    const { activities, school, colors, extras, id, product } = item
    const array = []
    if (activities.first || activities.second || activities.third) array.push(activityIcons({ activities, color: colors.primary }))
    array.push(schoolDetails(school))
    array.push(dots({ colors }))
    array.push(this.addons({ id, extras, color: colors.primary, size: product.match(/\w+/g).join('').toLowerCase() }))

    return array
  }

  title = ({ product, category, names, id, colors }) => {
    const title = `${product} ${category.replace('s', '')}`
    return(
      <div>
        <div style={{ marginBottom: '10px' }}>
          <span className='cart-item-title'>{title}</span>
          <span style={{ verticalAlign: 'super' }}>
            <Button className='cart-item-mod' size="small" icon="edit" onClick={() => this.handleCart({ action: 'edit', id })} />
            <Button className='cart-item-mod' size="small" icon="close" type='danger' onClick={() => this.handleCart({ action: 'delete', id })} />
          </span>
        </div>
        {names.second ?
          <h3 className={`${colors.primary.match(/silver|white/) && 'silver-text'}`} style={{ color: colors.primary }}>{names.first.toUpperCase()} <Divider type='vertical' /> {names.second.toUpperCase()}</h3> :
          <h3 className={`${colors.primary.match(/silver|white/) && 'silver-text'}`} style={{ color: colors.primary }}>{names.first.toUpperCase()}</h3>
        }
      </div>
    )
  }

  addons = ({ extras, id, color, size }) => {
    const { loops, boa, bling, extraWidth, trinkets, dieCuts } = prices.main[size]
    return (
      <span style={{ padding: '5px', fontSize: '20px' }}>
        {loops !== null && <span style={addonStyle({ present: extras.loops, color })} onClick={() => this.handleAddons({ key: 'loops', id })}><FontAwesomeIcon icon={faRibbon} /></span>}
        {boa !== null && <span style={addonStyle({ present: extras.boa, color })} onClick={() => this.handleAddons({ key: 'boa', id })}><FontAwesomeIcon icon={faFeatherAlt} /></span>}
        {bling !== null && <span style={addonStyle({ present: extras.bling, color })} onClick={() => this.handleAddons({ key: 'bling', id })}><FontAwesomeIcon icon={faGem} /></span>}
        {extraWidth !== null && <span style={addonStyle({ present: extras.extraWidth, color })} onClick={() => this.handleAddons({ key: 'extraWidth', id })}><Icon type='column-width' /></span>}
        {trinkets !== null && <span style={addonStyle({ present: extras.trinkets.length, color })} onClick={null}><Icon type='thunderbolt' theme='filled' /></span>}
        {dieCuts !== null && <span style={addonStyle({ present: extras.dieCuts, color })} ><Icon type='switcher' theme={extras.dieCuts && 'filled'} twoToneColor={extras.dieCuts && color} /></span>}
      </span>
    )
  }

  handleCart = ({ action, id, paid }) => {
    if (action === 'edit') {
      const product = { ...this.state.products[id] }
      window.localStorage.setItem('custom', JSON.stringify({ date: new Date().getTime(), details: product, modify: id }))
      this.setState({ toRedirect: `/${product.category.toLowerCase()}/${product.product.replace(' ', '-').toLowerCase()}` })
    }

    if (action === 'delete') {
      const old = { ...this.state.products }
      const date = new Date().getTime()
      delete old[id]
      const cart = { date, products: old}
      window.localStorage.setItem('cart', JSON.stringify(cart))
      const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date }
      const products =  cartStorage.products || {}
      this.setState({ data: this.dataPush(products), products })
      this.props.onCart()
    }

    if (action === 'clear') {
      const date = new Date().getTime()
      const cart = { date, products: {} }
      window.localStorage.setItem('cart', JSON.stringify(cart))
      const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date }
      const products =  cartStorage.products || {}
      this.setState({ data: this.dataPush(products), paid, products })
      this.props.onCart()
    }
  }

  handleAddons = ({ id, key }) => {
    const cart = JSON.parse(window.localStorage.getItem('cart'))
    const { products } = cart
    const { extras } = products[id]
    extras[key] = !extras[key]
    this.setState({ data: this.dataPush(cart.products), products })
    window.localStorage.setItem('cart', JSON.stringify({ date: new Date().getTime(), products }))
  }

  totalCost = data => {
    let total = 0
    for (let i = 0; i < data.length; i++) {
      const obj = data[i]
      const { category, product } = obj
      const categoryType = category.match(/Mums|Garters/) ? 'main' : 'extras'
      const currentPrices = prices[categoryType][product.toLowerCase().replace(' ', '')]
      const baseItem = currentPrices[category.toLowerCase().replace(' ', '')].price
      const extrarray = Object.keys(obj.extras)
      const totalExtras = extrarray.reduce((acc, curr) => obj.extras[curr] === true ? acc + currentPrices[curr] : acc, 0)
      const totalTrinkets = obj.extras.trinkets.reduce((acc, tri) => acc + currentPrices.trinkets[tri].price, 0)
      const totalDieCuts = obj.extras.dieCuts.reduce((acc, di) => acc + currentPrices.dieCuts[di.includes('Package') ? camelize(di) : 'general'].price, 0)
      total = total + baseItem + totalExtras + totalTrinkets + totalDieCuts
      total = Number(total.toFixed(2))
    }

    return total
  }

  render() {
    const { products, data, toRedirect, paid } = this.state
    if (toRedirect) return <Redirect to={toRedirect} />
    const total = this.totalCost(data)

    return (
      <div style={{ margin: '2%', background: 'white', padding: 20 }}>
        <h1 className='cart'>Shopping Cart</h1>
        <List
          className='cart-list'
          itemLayout='vertical'
          // size="large"
          pagination={{
            onChange: page => { return null },
            pageSize: 5,
          }}
          dataSource={data}
          locale={{ emptyText: 'Your cart is empty' }}
          footer={
            <div>
              {total > 0 && <h3><b>Total Amount:</b> ${total.toFixed(2)}</h3>}
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.title}
              style={{ border: '1px solid #F7DC99', padding: '20px' }}
              actions={this.itemDetails(item)}
              extra={
                <img
                  width={150}
                  alt="logo"
                  src={`/media/current-models/${item.category.replace('s','')}-${item.product.replace(' ', '-').toLowerCase()}.jpeg`}
                  onError={e => { e.target.onerror = null; e.target.src="https://via.placeholder.com/225x225.png?text=Boutique+Mums" }}
                />
              }
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.avatar} />}
                title={''}
                // description={item.description}
                description={this.title(item)}
              />
            </List.Item>
          )}
        />
        {(total > 0 || paid) && <SmartButtons total={total} products={products} onPayment={this.handleCart} />}
      </div>
    )
  }
}
 
export default Cart
