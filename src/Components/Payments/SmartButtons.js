import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import { Spin } from 'antd'

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
}

console.log(process.env)
// const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
const ENV = 'sandbox'
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
  createOrder = (data, actions) => {
    const { total } = this.props
    return actions.order.create({
      purchase_units: [
        {
          description: "Mum Boutique Custom Order",
          amount: {
            currency_code: "USD",
            value: total
          }
        },
      ]
    })
  }

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      }
      console.log("Payment Approved: ", paymentData)
      console.log(data)
      console.log(details)
      this.props.onPayment({ action: 'clear', id: null })
      this.setState({ showButtons: false, paid: true })
    })
  }

  render() {
    const { showButtons, loading, paid } = this.state;

    return (
      <div className="main">
        {loading && <Spin />}

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