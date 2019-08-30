import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import { Spin } from 'antd'
import prices from '../../price-list'

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
}

console.log(process.env)
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
// const ENV = 'sandbox'
console.log(ENV)
const CLIENT_ID = CLIENT[ENV]

let PayPalButton = null;
class PaypalButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false
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
      item.name = `${product.product} ${product.category.replace('s', '')}`
      item.unit_amount = { currency_code: 'USD', value: this.totalCost(product) }
      item.quantity = 1
      return item
    })
    console.log(items)
    return items
  }

  totalCost = item => {
    let total = 0
    const { category, product } = item
    const categoryType = category.match(/Mums|Garters/) ? 'main' : 'extras'
    const currentPrices = prices[categoryType][product.toLowerCase().replace(' ', '')]
    const baseItem = currentPrices[category.toLowerCase().replace(' ', '')]
    const extrarray = Object.keys(item.extras)
    const totalExtras = extrarray.reduce((acc, curr) => item.extras[curr] === true ? acc + currentPrices[curr] : acc, 0)
    total = total + baseItem + totalExtras
    total = Number(total.toFixed(2))
    return total
  }

  createOrder = (data, actions) => {
    const { total, products } = this.props
    console.log(total)
    console.log(products)
    // Create Order array of items
    // Add sales tax
    // Figure out Netlify's AWS Lambda functions to make serverless back end calls to store order information or send emails or manipulate Google Sheets
    return actions.order.create({
      purchase_units: [
        {
          description: "Mum Boutique Custom Order",
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

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      if (details.status === 'COMPLETED') {
        const payment = data
        console.log("Payment Approved: ", payment)
        console.log(details)
        this.saveOrder({ payment, details })
        // this.props.onPayment({ action: 'clear', id: null })
        this.setState({ showButtons: false, paid: true })
      }
    })
  }

  saveOrder = ({ payment = {}, details = {} }) => {
    const { REACT_APP_AT_API_KEY, REACT_APP_AT_BASE, REACT_APP_MG_API_KEY, REACT_APP_MG_DOMAIN } = process.env
    const data = { REACT_APP_AT_API_KEY, REACT_APP_AT_BASE, REACT_APP_MG_API_KEY, REACT_APP_MG_DOMAIN } // Temporary for testing on local server
    const { products } = this.props

    const orders = Object.keys(products).map(p => {
      const prod = products[p]
      const { product, category, school, activities, colors, extras, names } = prod

      const order = {
        'Customer Name': `${details.payer.name.given_name} ${details.payer.name.surname}`,
        'Customer Email': details.payer.email_address,
        'Customer Address': formatAddress(details.purchase_units[0].shipping.address),
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
        'Status': 'Ordered',
      }
      return order
    })


    const config = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ orders, data }),
    }

    // Now set up to run on local and Netlify backend
    // Proxy is probably interfering with netlify functions' ability to see environment variables
    fetch('/.netlify/functions/order', config)
      .then(response => { console.log(response); return response.json(); })
      .then(json => console.log(json))
  }

  render() {
    const { showButtons, loading, paid } = this.state;
    console.log(this.props)

    return (
      <div className="main">
        {loading && <div style={{ textAlign: 'center' }}><Spin size='large' style={{ width: '2em', height: '2em' }} /></div>}

        {showButtons && (
          <div style={{ textAlign: 'center' }}>
            <div>
              <h2>Checkout</h2>
              <button onClick={this.saveOrder}>Test Order</button>
            </div>

            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
            />
          </div>
        )}

        {paid && (
          <div className="main">
            <h2>
              Congrats! Your order has been submitted!
              <span role="img" aria-label="emoji">
                {" "}
                😉
              </span>
            </h2>
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

function getDate() {
  const date = new Date()
  return date.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0]
}