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
    console.log(total)
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
        this.props.onPayment({ action: 'clear', id: null })
        this.setState({ showButtons: false, paid: true })
      }
    })
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


export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);