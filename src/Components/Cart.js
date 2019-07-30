import React, { Component } from 'react'
import { List, Button, Divider, Avatar, Icon, Typography } from 'antd'
import config from './config'

const { Title } = Typography

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
    const products = JSON.parse(window.localStorage.getItem('cart')) || {}
    this.state = { data: this.dataPush(products), products }
  }

  dataPush = (products) => {
    return Object.keys(products).map(p => ({ id: p, ...products[p] }))
  }

  cartButtons = ({ id }) => {
    return (
      <span style={{ verticalAlign: 'super' }}>
        <Button style={{ margin: '0 2px' }} size="small" icon="edit" onClick={() => this.handleCart({ press: 'edit', id })} />
        <Button style={{ margin: '0 2px' }} size="small" icon="close" onClick={() => this.handleCart({ press: 'delete', id })} />
      </span>
    )
  }

  handleCart = ({ press, id }) => {
    if (press === 'edit') {
      console.log(press)
    }

    if (press === 'delete') {
      const old = { ...this.state.products }
      delete old[id]
      window.localStorage.setItem('cart', JSON.stringify(old))
      const products = JSON.parse(window.localStorage.getItem('cart')) || {}
      this.setState({ data: this.dataPush(products), products })
      this.props.onCart()
    }
  }

  render() {
    console.log(this.state)
    const { products, data } = this.state
    const totalCost = data.reduce((acc, obj) => { return acc + obj.Approved + obj.Paid }, 0)

    return (
      <div style={{ margin: '2%', background: 'white', padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>This is Cart Page</h1>
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
              <b>Total Amount:</b> [Placeholder]
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
      </div>
    )
  }
}
 
export default Cart;
