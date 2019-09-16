import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'
import { Icon } from 'antd'
import prices from '../../price-list'

const category = 'mums'
const productOrder = [ 'spiritbadge', 'mini', 'small', 'medium', 'large', 'extralarge' ]


class Mums extends Component {
  render() {
    return (
      <div style={{ background: 'white' }}>
        <h1 style={{ textAlign: 'center', margin: 0, fontSize: 'xx-large' }}>Order Online</h1>
        <h1 style={{ textAlign: 'center', color: '#c94dbd' }}>Our Mums <Icon type="woman" /></h1>
        <div className='cards'>
          {productOrder.map(type =>
            <ProductCard
              key={type}
              category={category}
              name={products[type].name}
              description={prices.main[type][category].description}
              price={prices.main[type][category].price}
            />
          )}
        </div>
      </div>
    )
  }
}
 
export default Mums;