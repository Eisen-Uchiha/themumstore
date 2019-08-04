import React, { Component } from 'react'
import { List, Button, Divider, Avatar, Icon, Typography } from 'antd'
// import ExpressCheckout from './ExpressCheckout'
import SmartButtons from './SmartButtons'
import prices from '../../price-list'
import config from '../config'

const { Title } = Typography
const oneWeek =  7 * 8.64e+7

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

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

const icons = ({ activities }) => (
  Object.keys(activities).map(a => activities[a] && <span key={a} style={{ padding: 5, fontSize: 20 }}>{config[activities[a]]}</span>)
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
    this.state = { data: this.dataPush(products), products }
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

  handleCart = ({ action, id }) => {
    if (action === 'edit') {
      console.log(action)
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
      this.setState({ data: this.dataPush(products), products })
      this.props.onCart()
    }
  }

  totalCost = data => {
    let total = 0
    for (let i = 0; i < data.length; i++) {
      const obj = data[i]
      const { category, product } = obj
      const categoryType = category.match(/Mums|Garters/) ? 'main' : 'extras'
      const currentPrices = prices[categoryType][product.toLowerCase().replace(' ', '')]
      const baseItem = currentPrices[category.toLowerCase().replace(' ', '')]
      const extrarray = Object.keys(obj.extras)
      const totalExtras = extrarray.reduce((acc, curr) => obj.extras[curr] === true ? acc + currentPrices[curr] : acc, 0)
      total = total + baseItem + totalExtras
    }

    return total
  }

  render() {
    console.log(this.state)
    const { products, data } = this.state
    const totalCost = this.totalCost(data)
    const totalCostForm = Number(totalCost.toFixed(2))

    return (
      <div style={{ margin: '2%', background: 'white', padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>Shopping Cart</h1>
        <List
          itemLayout="vertical"
          // size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={data}
          footer={
            <div>
              <h3><b>Total Amount:</b> ${totalCostForm.toFixed(2)}</h3>
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.title}
              style={{ border: '1px solid #F7DC99', padding: '20px' }}
              actions={[
                item.activities.first ? icons({ activities: item.activities }) : config.Star,
                <span style={{ fontSize: '1.2em' }}>{item.school.name}</span>,
                <span style={{ fontSize: '1.2em' }}>{item.school.mascot}</span>,
                dots({ colors: item.colors }),
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
        <SmartButtons total={totalCostForm} onPayment={this.props.handleCart} />
      </div>
    )
  }
}
 
export default Cart
