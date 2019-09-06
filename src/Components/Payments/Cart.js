import React, { Component } from 'react'
import { List, Button, Divider, Icon } from 'antd'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem, faRibbon, faFeatherAlt } from '@fortawesome/free-solid-svg-icons'
import SmartButtons from './SmartButtons'
import prices from '../../price-list'
import icons from '../icons'

const oneWeek =  7 * 8.64e+7

const dotStyle = ({ color }) => {
  return {
    height: '20px',
    width: '20px',
    padding: 5,
    margin: '0 2px',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'baseline',
  }
}

const dots = ({ colors }) => (
  Object.keys(colors).map(c => colors[c] && <span key={c} style={dotStyle({ color: colors[c] })}></span>)
)

const activityIcons = ({ activities, color }) => (
  Object.keys(activities).map(a => activities[a] && <span key={a} style={{ padding: 5, fontSize: 20, color }}>{icons[activities[a]]}</span>)
)

const title = ({ item }) => {
  const title = `${item.product} ${item.category.replace('s', '')}`
  return(
    <div>
      <h2>{title}</h2>
      {item.names.second ? <h3>{item.names.first} <Divider type='vertical' /> {item.names.second}</h3> : <h3>{item.names.first}</h3>}
    </div>
  )
}

class Cart extends Component {
  constructor(props) {
    super(props)
    const date = new Date()
    const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date, products: {} }
    const products = (cartStorage.date - date) < oneWeek ? cartStorage.products : {}
    this.state = { data: this.dataPush(products), products, toRedirect: null, paid: false }
  }

  dataPush = (products) => {
    return Object.keys(products).map(p => ({ id: p, ...products[p] }))
  }

  cartButtons = ({ id }) => {
    return (
      <span style={{ verticalAlign: 'super' }}>
        <Button style={{ margin: '0 2px' }} size="small" icon="edit" onClick={() => this.handleCart({ action: 'edit', id })} />
        <Button style={{ margin: '0 2px' }} size="small" icon="close" onClick={() => this.handleCart({ action: 'delete', id })} />
      </span>
    )
  }

  addons = ({ extras, id, color, size }) => {
    const { loops, boa, bling, extraWidth, trinkets, twoTone } = prices.main[size]
    return (
      <span style={{ padding: '5px', fontSize: '20px' }}>
        {loops !== null && <span style={{ padding: '5px', color: extras.loops && color }} onClick={() => this.handleAddons({ key: 'loops', id })}><FontAwesomeIcon icon={faRibbon} /></span>}
        {boa !== null && <span style={{ padding: '5px', color: extras.boa && color }} onClick={() => this.handleAddons({ key: 'boa', id })}><FontAwesomeIcon icon={faFeatherAlt} /></span>}
        {bling !== null && <span style={{ padding: '5px', color: extras.bling && color }} onClick={() => this.handleAddons({ key: 'bling', id })}><FontAwesomeIcon icon={faGem} /></span>}
        {extraWidth !== null && <span style={{ padding: '5px', color: extras.extraWidth && color }} onClick={() => this.handleAddons({ key: 'extraWidth', id })}><Icon type='column-width' /></span>}
        {trinkets !== null && <span style={{ padding: '5px', color: extras.trinkets.length && color }} onClick={null}><Icon type='thunderbolt' /></span>}
        {/* {twoTone !== null && <span style={{ padding: '5px' }} onClick={() => this.handleAddons({ key: 'twoTone', id })}><Icon type='switcher' theme={extras.twoTone && 'twoTone'} twoToneColor={extras.twoTone && color} /></span>} */}
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
      const totalTrinkets = obj.extras.trinkets.length * currentPrices.trinkets
      total = total + baseItem + totalExtras + totalTrinkets
    }

    return total
  }

  render() {
    const { products, data, toRedirect, paid } = this.state
    if (toRedirect) return <Redirect to={toRedirect} />
    const totalCost = this.totalCost(data)
    const totalCostForm = Number(totalCost.toFixed(2))

    return (
      <div style={{ margin: '2%', background: 'white', padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>Shopping Cart</h1>
        <List
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
              {totalCost > 0 && <h3><b>Total Amount:</b> ${totalCostForm.toFixed(2)}</h3>}
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.title}
              style={{ border: '1px solid #F7DC99', padding: '20px' }}
              actions={[
                item.activities.first ? activityIcons({ activities: item.activities, color: item.colors.primary }) : icons.Star,
                <span style={{ fontSize: '1.2em' }}>{item.school.name}</span>,
                <span style={{ fontSize: '1.2em' }}>{item.school.mascot}</span>,
                dots({ colors: item.colors }),
                this.addons({ id: item.id, extras: item.extras, color: item.colors.primary, size: item.product.match(/\w+/g).join('').toLowerCase() }),
                this.cartButtons({ id: item.id }),
              ]}
              extra={
                <img
                  width={150}
                  alt="logo"
                  src="https://media.altpress.com/uploads/2018/07/Hello_Kitty.jpg"
                />
              }
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.avatar} />}
                title={''}
                // description={item.description}
                description={title({ item })}
              />
            </List.Item>
          )}
        />
        {(totalCost > 0 || paid) && <SmartButtons total={totalCostForm} products={products} onPayment={this.handleCart} />}
      </div>
    )
  }
}
 
export default Cart
