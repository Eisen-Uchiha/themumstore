import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import { Spin, Input, Tooltip, Icon } from 'antd'
import { camelize } from '../Shared'
import prices from '../../price-list'

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
}

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
const CLIENT_ID = CLIENT[ENV]

let PayPalButton = null;
class PaypalButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false,
      order: null,
      filled: { name: false, cell: false },
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }

  orderItems = () => {
    const { products } = this.props
    const items = Object.keys(products).map(p => {
      const product = products[p]
      const item = {}
      item.name = orderName(product)
      item.unit_amount = { currency_code: 'USD', value: this.totalCost(product) }
      item.quantity = 1
      return item
    })
    return items
  }

  totalCost = item => {
    let total = 0
    const { category, product } = item
    const categoryType = category.match(/Mums|Garters/) ? 'main' : 'extras'
    const currentPrices = prices[categoryType][product.toLowerCase().replace(' ', '')]
    const baseItem = currentPrices[category.toLowerCase().replace(' ', '')].price
    const extrarray = Object.keys(item.extras)
    const totalExtras = extrarray.reduce((acc, curr) => item.extras[curr] === true ? acc + currentPrices[curr] : acc, 0)
    const totalTrinkets = item.extras.trinkets.reduce((acc, tri) => acc + currentPrices.trinkets[tri].price, 0)
    const totalDieCuts = item.extras.dieCuts.reduce((acc, di) => acc + currentPrices.dieCuts[di.includes('Package') ? camelize(di) : 'general'].price, 0)
    total = total + baseItem + totalExtras + totalTrinkets + totalDieCuts
    total = Number(total.toFixed(2))
    return total
  }

  createOrder = (data, actions) => {
    const { total } = this.props

    return actions.order.create({
      purchase_units: [
        {
          description: "Boutique Mums Custom Order",
          amount: {
            currency_code: "USD",
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total,
              },
            }
          },
          items: this.orderItems(),
        },
      ]
    })
  }

  nameFilledCheck = event => {
    const filled = { ...this.state.filled }

    if (event.target.value.length < 2) {
      if (!filled.name) return
      filled.name = false
      this.setState({ filled })
    }

    else if (!filled.name) {
      filled.name = true
      this.setState({ filled })
    }

    else return
  }

  cellFilledCheck = event => {
    const filled = { ...this.state.filled }
    const value = this.cell.input.value
    const match = value.match(/\d+/g)
    if (!match || match.join('').length !== 10) {
      if (!filled.cell) return
      filled.cell = false
      this.setState({ filled })
    }

    else if (!filled.cell) {
      filled.cell = true
      this.setState({ filled })
    }

    else return
  }

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      if (details.status === 'COMPLETED') {
        this.saveOrder({ details })
        this.props.onPayment({ action: 'clear', id: null, paid: true })
        this.setState({ showButtons: false, paid: true, order: details.id })
      }
    })
  }

  saveOrder = ({ details = {} }) => {
    const { products } = this.props

    const orders = Object.keys(products).map(p => {
      const prod = products[p]
      const { product, category, school, activities, colors, extras, names } = prod
      const { trinkets, dieCuts } = extras

      const order = {
        'Customer Name': `${details.payer.name.given_name} ${details.payer.name.surname}`,
        'Customer Email': details.payer.email_address,
        'Customer Address': formatAddress(details.purchase_units[0].shipping.address),
        'Contact Name': this.name.input.value,
        'Contact Phone': formatPhone(this.cell.input.value),
        'Special Instructions': this.special.textAreaRef.value,
        'Order ID': details.id,
        'Item': `${product} ${category.replace('s','')}`,
        'School Name': school.name,
        'School Mascot': school.mascot,
        'Colors': Object.entries(colors).filter(([key, value]) => value).map(([key, value]) => value.charAt(0).toUpperCase() + value.slice(1)),
        'Order Date': getDate(),
        'Name 1': names.first,
        'Name 2': names.second || '',
        'Activities': Object.entries(activities).filter(([key, value]) => value).map(([key, value]) => value),
        'Extras': formatExtras(extras),
        'Trinkets': formatTrinkets({ trinkets, product }),
        'Die Cuts': formatDieCuts({ dieCuts, product }),
        'Status': 'Ordered',
      }
      return order
    })

    const config = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ orders }),
    }

    fetch('/.netlify/functions/order', config)
      .then(response => { console.log(response); return response.json(); })
      .then(json => console.log(json))
  }

  render() {
    const { showButtons, loading, paid, order } = this.state;
    const { filled } = this.state

    return (
      <div className="main">
        {loading && <div style={{ textAlign: 'center' }}><Spin size='large' style={{ width: '2em', height: '2em' }} /></div>}

        {showButtons && (
          <div style={{ textAlign: 'center' }}>
            <div>
              <h1>Checkout</h1>
              <div>
                <div>
                  <h3>Contact</h3>
                  <Input
                    ref={node => this.name = node}
                    // className={!filled.name ? 'required-shadow' : ''}
                    onChange ={this.nameFilledCheck}
                    addonBefore="Name"
                    style={{ maxWidth: '400px' }}
                    placeholder="Enter Name"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      <Tooltip title={!filled.cell ? 'We need a name for this order' : 'Required Field'}>
                        <Icon type="info-circle" style={{ color: !filled.name ? 'red' : '#68C6BF' }} />
                      </Tooltip>
                    }
                  />
                </div>
                <div>
                  <Input
                    ref={node => this.cell = node}
                    onChange={this.cellFilledCheck}
                    // className={!filled.cell ? 'required-shadow' : ''}
                    addonBefore="Cell"
                    style={{ maxWidth: '400px' }}
                    placeholder="(254) 555-8822"
                    prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      <Tooltip title={!filled.cell ? 'Enter a valid cell number' : 'Required Field'}>
                        <Icon type="info-circle" style={{ color: !filled.cell ? 'red' : '#68C6BF' }} />
                      </Tooltip>
                    }
                  />
                </div>
                <br />
                <div>
                  <h3>Special Instructions</h3>
                  <Input.TextArea
                    ref={node => this.special = node}
                    autosize={{ minRows: 2, maxRows: 6 }}
                    style={{ maxWidth: '400px' }}
                    placeholder="Special Instructions"
                  />
                </div>
              </div>
            </div>

            <br />
            <br />
            <div className={!filled.name || !filled.cell ? 'submit-disabled' : ''}>
              <PayPalButton
                createOrder={(data, actions) => this.createOrder(data, actions)}
                onApprove={(data, actions) => this.onApprove(data, actions)}
              />
            </div>
          </div>
        )}

        {paid && (
          <div style={{ textAlign: 'center' }}>
            <div><h2>Congrats! Your order has been submitted!</h2></div>
            <div><h2>Order ID: <span style={{ fontWeight: 'normal' }}>{order}</span></h2></div>
          </div>
        )}
      </div>
    );
  }
}

export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton)

function formatAddress(address) {
  const { address_line_1, admin_area_1, admin_area_2, postal_code, country_code } = address
  const line1 = address_line_1
  const line2 = `${admin_area_2}, ${admin_area_1}, ${country_code}  ${postal_code}`
  return `${line1}\n${line2}`
}

function formatExtras(extras) {
  const format = {
    bling: 'Bling Package',
    boa: 'Feather Boa',
    extraWidth: 'Extra Width',
    loops: 'Loops Upgrade',
    twoTone: 'Two Tone Die Cut',
  }

  const formattedExtras = Object.keys(extras).filter(e => extras[e] === true).map(e => format[e])
  return formattedExtras
}

function formatTrinkets({ trinkets, product }) {
  const counter = {}
  const prod = product.toLowerCase().replace(' ', '')
  trinkets.forEach(tri => {
    if (!counter[tri]) counter[tri] = 0
    counter[tri] = counter[tri] + 1
  })
  const formattedTrinkets = Object.keys(counter).map(tri => `${counter[tri]} ${prices.main[prod].trinkets[tri].name}${counter[tri] > 1 ? 's' : ''}`).join(', ')
  return formattedTrinkets
}

function formatDieCuts({ dieCuts, product }) {
  const counter = {}
  dieCuts.forEach(tri => {
    if (!counter[tri]) counter[tri] = 0
    counter[tri] = counter[tri] + 1
  })
  const formattedDieCuts = Object.keys(counter).map(tri => `${counter[tri]} ${tri}${counter[tri] > 1 ? 's' : ''}`).join(', ')
  return formattedDieCuts
}

function formatPhone(value) {
  const first = value.match(/\d{3}/g)[0]
  const second = value.match(/\d{3}/g)[1]
  const third = value.match(/\d{4}\b/g)[0]
  const number = `(${first}) ${second}-${third}`
  return number
}

function getDate() {
  const date = new Date()
  return date.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0]
}

function orderName(product) {
  const keys = Object.keys(product.extras)
  let addons = false
  for (let i = 0; i < keys.length; i++) {
    const extra = keys[i]

    if (typeof extra === 'boolean') {
      if (extra) addons = true
    }

    else if (extra.length > 0) addons = true
  }

  if (addons) return `${product.product} ${product.category.replace('s', '')} w/ Extras`
  return `${product.product} ${product.category.replace('s', '')}`
}