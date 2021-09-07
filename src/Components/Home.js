import React, { Component } from 'react'
import { Layout, Carousel, Typography } from 'antd'
import { Helmet } from 'react-helmet'

const { Content } = Layout
const { Title, Paragraph } = Typography

class Home extends Component {
  render() {
    return (
      <Layout style={{ background: '#fff', padding: '0 2%', minHeight: 350 }}>
        <Helmet>
          <title>Custom Mums and Garters</title>
          <meta name="description" content="Hico, TX" />
          <meta name="theme-color" content="#68C6BF" />
        </Helmet>
        <Content>
          <div style={{ textAlign: 'center' }}>
            <h1 className='site-font' style={{ fontSize: '-webkit-xxx-large', margin: '10px 0 0 0' }}>Boutique Mums</h1>
            <h1 className='site-font' style={{ fontSize: '1.25em', margin: '10px 0 0 0', color: 'red' }}>Closed due to COVID</h1>
            {/* <h1 className='site-font' style={{ fontSize: '1.25em', margin: '10px 0 0 0' }}>Available for Online Orders</h1> */}
          </div>
          <div className='cards' style={{ justifyContent: 'center' }}>
              <div className='card' style={{ minWidth: '300px', maxWidth: 450, maxHeight: 350, flex: '1 0 26%', margin: '5% 0' }}>
                <Carousel style={{ height: 'auto', lineHeight: 0 }} autoplay={true}>
                  <div><img src="/media/carousel/carousel-01.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                  <div><img src="/media/carousel/carousel-02.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                  <div><img src="/media/carousel/carousel-03.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                  <div><img src="/media/carousel/carousel-04.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                  <div><img src="/media/carousel/carousel-05.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                  <div><img src="/media/carousel/carousel-06.png" alt="" style={{ width: 'auto', maxHeight: '320px' }} /></div>
                </Carousel>
              </div>
            <div className='card' style={{ minWidth: 300, maxWidth: 500, maxHeight: 415, flex: '1 0 26%', margin: '5% 0' }}>
                <Typography style={{ margin: '8% 0',textAlign: 'center' }}>
                  <Title level={3}>About Me</Title>
                  <Paragraph style={{ padding: '2%' }}>
                    Welcome to Boutique Mums! My name is Kay and my aim at Boutique Mums is to
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