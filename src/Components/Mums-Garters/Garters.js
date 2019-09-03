import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'
import prices from '../../price-list'

const category = 'garters'
const productOrder = [ 'spiritbadge', 'mini', 'small', 'medium', 'large', 'extralarge' ]

class Garters extends Component {
  render() {
    return (
      <div style={{ background: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>Our Garters</h1>
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
 
export default Garters;