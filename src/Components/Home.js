import React, { Component } from 'react'
import { Layout, Icon, Menu, Breadcrumb, PageHeader, Carousel, Typography } from 'antd'

const { Header, Content, Sider, Footer } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup
const { Title, Paragraph, Text } = Typography

class Home extends Component {

  render() { 
    return (
      <Layout style={{ background: '#fff', padding: '0 50px', minHeight: 300 }}>
        <Layout style={{ background: '#fff', padding: '0 50px', minHeight: 300 }}>
          <Content>
            <Carousel style={{ height: '300px', lineHeight: 0 }} autoplay={false}>
              <div><img src="/icons/kitty-square.png" alt='Home' style={{ width: 'auto' }} /></div>
              <div><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" alt="" style={{ width: 'auto' }} /></div>
              <div><img src="https://media.altpress.com/uploads/2018/07/Hello_Kitty.jpg" alt="" style={{ width: 'auto' }} /></div>
              <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2fXhYIq9Rk0rRk4Y01nAjM49cON-3aLg9tOice4YFEXilfpFvw" alt="" style={{ width: 'auto' }} /></div>
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
              <h1 style={{ fontSize: "-webkit-xxx-large" }}>The Mum Boutique</h1>
            </div>
        </Content>
      </Layout>
    )
  }
}
 
export default Home;