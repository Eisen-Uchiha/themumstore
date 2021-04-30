import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Layout, Icon, Menu, Badge, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import ReactGA from 'react-ga'
import Home from './Components/Home'
import Mums from './Components/Mums-Garters/Mums'
import Garters from './Components/Mums-Garters/Garters'
// import Gallery from './Components/Gallery'
import Contact from './Components/Contact'
// import Extras1 from './Components/Extras/Extras1'
// import Extras2 from './Components/Extras/Extras2'
import Cart from './Components/Payments/Cart'
import Customization from './Components/Mums-Garters/Customization'
// import icons from './Components/icons'
import './App.css'
import Privacy from './Components/Privacy'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)

const trackPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
  return null
}

const { Header, Content, Footer } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const oneWeek =  7 * 8.64e+7

const NoMatch = () => {
  const [redirect, setredirect] = useState(false)

  useEffect(() => {
    setTimeout(() => setredirect(true), 8000)
  })

  if (redirect) return <Redirect to='/' />
  
  return (
    <div style={{ background: 'white', textAlign: 'center', padding: '5%' }}>
      <Helmet>
        <meta name="description" content="Page Not Found" />
        <meta name="theme-color" content="#68C6BF" />
      </Helmet>
      <h1>Sorry, we couldn’t find that page</h1>
      <h3>You'll be redirected back to the home page</h3>
  </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    const date = new Date()
    const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date, products: {} }
    const products = (cartStorage.date - date) < oneWeek ? cartStorage.products : {}
    const cartSize = Object.keys(products).length

    this.state = {
      menu: [ window.location.pathname.split('/')[1] ], cartSize
    }
  }

  handleMenu = setting => {
    this.setState({ menu: setting })
  }

  handleCart = () => {
    const date = new Date()
    const cartStorage = JSON.parse(window.localStorage.getItem('cart')) || { date, products: {} }
    const products = (cartStorage.date - date) < oneWeek ? cartStorage.products : {}
    const cartSize = Object.keys(products).length
    this.setState({ cartSize })
  }

  DeskMenu = ({ menu, cartSize }) => {
    return (
      <Menu
        className='nav'
        theme="light"
        mode="horizontal"
        selectedKeys={menu}
        style={{ lineHeight: '62px' }}
        // overflowedIndicator={<Icon type="menu" />}
      >
        <Menu.Item key="home" onClick={() => this.handleMenu(['home'])}>
          <Link to="/"><Icon type="home" /></Link>
        </Menu.Item>
        <Menu.Item key="mums" onClick={() => this.handleMenu(['mums'])}>
          <Link to="/mums" style={{ color: '#c94dbd' }}><Icon type="woman" />Mums</Link>
        </Menu.Item>
        <Menu.Item key="garters" onClick={() => this.handleMenu(['garters'])}>
          <Link to="/garters" style={{ color: '#507bcc' }}><Icon type="man" />Garters</Link>
        </Menu.Item>
        <Menu.Item key="contact" onClick={() => this.handleMenu(['contact'])}><Link to="/contact"><Icon type="mail" /> Contact</Link></Menu.Item>
        <Menu.Item key="cart" onClick={() => this.handleMenu(['cart'])}><Link to="/cart">{<Badge count={cartSize}><Icon type='shopping' />Cart</Badge>}</Link></Menu.Item>
      </Menu>
    )
  }

  MobileMenu = ({ menu, cartSize }) => {
    return (
      <Menu
        className='mobile-nav'
        theme="light"
        mode="horizontal"
        selectedKeys={menu}
        style={{ lineHeight: '62px' }}
      >
        <SubMenu title={<Icon type="menu" />}>
          <MenuItemGroup>
            <Menu.Item key="home" onClick={() => this.handleMenu(['home'])}>
              <Link to="/"><Icon type="home" />Home</Link>
            </Menu.Item>
            <Menu.Item key="mums" onClick={() => this.handleMenu(['mums'])}>
              <Link to="/mums" style={{ color: '#c94dbd' }}><Icon type="woman" />Mums</Link>
            </Menu.Item>
            <Menu.Item key="garters" onClick={() => this.handleMenu(['garters'])}>
              <Link to="/garters" style={{ color: '#507bcc' }}><Icon type="man" />Garters</Link>
            </Menu.Item>
            <Menu.Item key="contact" onClick={() => this.handleMenu(['contact'])}><Link to="/contact"><Icon type="mail" /> Contact</Link></Menu.Item>
            <Menu.Item key="cart" onClick={() => this.handleMenu(['cart'])}><Link to="/cart">{<Badge count={cartSize}><Icon type='shopping' /> Cart</Badge>}</Link></Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>
    )
  }

  render() {
    const { menu, cartSize } = this.state

    return (
      <Router>
        <Layout className="layout">
          <Header className='menu-header'>
            <Row type="flex" justify="start">
              <Col span={7}>
                <div className="site-header site-font">Boutique Mums</div>
              </Col>
              <Col span={17}>
                {this.DeskMenu({ menu, cartSize })}
                {this.MobileMenu({ menu, cartSize })}
              </Col>
            </Row>
          </Header>
          {/* <div className='caution-banner'>Currently serving <b>Hico, Iredell, Cranfills Gap, and Hamilton</b> cities</div> */}
          {/* <div className='danger-banner'>We've reached our capacity for <b>Hico and Cranfills Gap</b> orders. See you next year, <b>Homecoming 2020!</b></div> */}
          {/* <div className='danger-banner'><b>Sorry, no 2020 orders due to COVID-19</b></div> */}
          <Content>
            <Route path="/" component={trackPageView} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/mums" component={Mums} />
              <Route exact path="/garters" component={Garters} />
              {/* <Route exact path="/gallery" component={Gallery} /> */}
              <Route exact path="/contact" component={Contact} />
              {/* <Route exact path="/extras1" component={Extras1} />
              <Route exact path="/extras2" component={Extras2} /> */}
              <Route exact path="/cart" render={props => <Cart {...props} onCart={this.handleCart} isAuthed={true} />} />
              <Route path={['/(mums|garters)/(spirit-badge|mini|small|medium|large|extra-large)']} render={props => <Customization {...props} onCart={this.handleCart} isAuthed={true} />} />
              <Route exact path="/privacy" component={Privacy} />
              <Route component={NoMatch} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <Link to="/privacy">Privacy Policy</Link>
          </Footer>
        </Layout>
      </Router>
    )
  }
}

export default App
