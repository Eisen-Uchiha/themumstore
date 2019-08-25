import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Layout, Icon, Menu, Badge, Breadcrumb, PageHeader, Carousel, Typography } from 'antd'
import Home from './Components/Home'
import Mums from './Components/Mums-Garters/Mums'
import Garters from './Components/Mums-Garters/Garters'
import Extras1 from './Components/Extras/Extras1'
import Extras2 from './Components/Extras/Extras2'
import Gallery from './Components/Gallery'
import Cart from './Components/Payments/Cart'
import Customization from './Components/Mums-Garters/Customization'
import './App.css'

const { Header, Footer } = Layout
const SubMenu = Menu.SubMenu;
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

  componentDidMount() {
    console.log('We Are Live')
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

  render() {
    const { menu, cartSize } = this.state

    return (
      <Router>
        <Layout className="layout">
          <Header className='menu-header'>
            <div className="logo">
              <Link to="/"><img alt='' src="/icons/kitty-square.png" onClick={() => this.handleMenu([])} /></Link>
            </div>
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={menu}
              style={{ lineHeight: '62px' }}
            >
              <Menu.Item key="mums" onClick={() => this.handleMenu(['mums'])}>
                <Link to="/mums">
                  {/* <Icon type="setting" /> */}
                  Mums
                </Link>
              </Menu.Item>
              <Menu.Item key="garters" onClick={() => this.handleMenu(['garters'])}>
                <Link to="/garters">Garters</Link>
              </Menu.Item>
              <SubMenu title="Extras">
                <MenuItemGroup>
                  <Menu.Item key="extras1" onClick={() => this.handleMenu(['extras1'])}><Link to="/extras1">Extras 1</Link></Menu.Item>
                  <Menu.Item key="extras2" onClick={() => this.handleMenu(['extras2'])}><Link to="/extras2">Extras 2</Link></Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <Menu.Item key="gallery" onClick={() => this.handleMenu(['gallery'])}><Link to="/gallery">Gallery</Link></Menu.Item>
              <Menu.Item key="cart" onClick={() => this.handleMenu(['cart'])}><Link to="/cart">{<Badge count={cartSize}> <Icon type='shopping' /></Badge>}</Link></Menu.Item>
            </Menu>
          </Header>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/mums" component={Mums} />
            <Route exact path="/garters" render={props => <Garters {...props} onCart={this.handleCart} isAuthed={true} />} />
            <Route exact path="/extras1" component={Extras1} />
            <Route exact path="/extras2" component={Extras2} />
            <Route exact path="/cart" render={props => <Cart {...props} onCart={this.handleCart} isAuthed={true} />} />
            <Route path={['/(mums|garters)/(spirit-badge|mini|small|medium|large|extra-large)']} render={props => <Customization {...props} onCart={this.handleCart} isAuthed={true} />} />
            <Route component={NoMatch} />
          </Switch>
          {/* <Layout style={{ background: '#fff', padding: '0 50px', minHeight: 300 }}>
            <Layout style={{ background: '#fff', padding: '0 50px', minHeight: 300 }}>
              <Content>
                <Carousel style={{ height: '300px', lineHeight: 0 }} autoplay={false}>
                  <div><img src="/icons/kitty-square.png" style={{ width: 'auto' }} /></div>
                  <div><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" style={{ width: 'auto' }} /></div>
                  <div><img src="https://media.altpress.com/uploads/2018/07/Hello_Kitty.jpg" style={{ width: 'auto' }} /></div>
                  <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2fXhYIq9Rk0rRk4Y01nAjM49cON-3aLg9tOice4YFEXilfpFvw" style={{ width: 'auto' }} /></div>
                </Carousel>
              </Content>
              <Sider style={{ background: '#FFD4CA', textAlign: "center" }}>
                <Typography>
                  <Title level={3}>About Me</Title>
                  <Paragraph>
                  Centrally located in Arlington, Awesome Mums has been creating beautiful, quality homecoming mums for over 10 years. We create mums of all sizes, from the single more traditional mums to the larger mega and Texas shaped mums and we're well known for our elegant, and comfortable over the shoulder mums! Take a look at our website for descriptions and pricing of all of our mums and garters. then call to order or ask any questions. 
                  </Paragraph>
                </Typography>
              </Sider>
            </Layout>
            <Content>
                <div style={{ textAlign: "center", height: 100 }}>
                  <h1 style={{ fontSize: "-webkit-xxx-large" }}>The Mum Store</h1>
                </div>
            </Content>
          </Layout> */}
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Router>
    )
  }
}

export default App
