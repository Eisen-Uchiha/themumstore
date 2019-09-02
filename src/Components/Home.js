import React, { Component } from 'react'
import { Layout, Icon, Menu, Breadcrumb, PageHeader, Carousel, Typography } from 'antd'

const { Header, Content, Sider, Footer } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup
const { Title, Paragraph, Text } = Typography

class Home extends Component {
  render() {
    return (
      <Layout style={{ background: '#fff', padding: '0 2%', minHeight: 350 }}>
        <Content>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "-webkit-xxx-large" }}>Boutique Mums</h1>
          </div>
          <div className='cards' style={{ justifyContent: 'center' }}>
              <div className='card' style={{ minWidth: '300px', maxWidth: 450, maxHeight: 350, flex: '1 0 26%', margin: '5% 0' }}>
                <Carousel style={{ height: 'auto', lineHeight: 0 }} autoplay={false}>
                  <div><img src="/icons/kitty-square.png" alt='Home' style={{ width: 'auto' }} /></div>
                  <div><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" alt="" style={{ width: 'auto' }} /></div>
                  <div><img src="https://media.altpress.com/uploads/2018/07/Hello_Kitty.jpg" alt="" style={{ width: 'auto' }} /></div>
                  <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2fXhYIq9Rk0rRk4Y01nAjM49cON-3aLg9tOice4YFEXilfpFvw" alt="" style={{ width: 'auto' }} /></div>
                </Carousel>
              </div>
            <div className='card' style={{ minWidth: 300, maxWidth: 500, maxHeight: 415, flex: '1 0 26%', margin: '5% 0' }}>
                <Typography style={{ margin: '8% 0',textAlign: 'center' }}>
                  <Title level={3}>About Me</Title>
                  <Paragraph style={{ padding: '2%' }}>
                    Welcome to Boutique Mums! My name is Kay Willey and my aim at Boutique Mums is to
                    create fun AND beautiful mums and garters that make your homecoming special.
                    I believe Homecoming mums and garters should reflect creativity and artistry as well as whimsy.
                    All of Boutique Mums creations are made to order. You can go with one of our basic sizes as-is
                    or you can add on as many extras as you like. I specialize in custom die cut images and words.
                    Any mum or garter you order from the basic to the blinged out will be a beautiful artistic creation.
                    Be sure to add any special instructions for me and a reliable phone number.
                    I’m happy to text or call you to answer questions about special requests. Happy Homecoming!!!
                  </Paragraph>
                </Typography>
            </div>
          </div>
        </Content>
      </Layout>
    )
  }
}
 
export default Home;