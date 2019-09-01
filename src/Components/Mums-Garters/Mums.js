import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'

const category = 'mums'
const productOrder = [ 'xs', 'mini', 'sm', 'med', 'lg', 'xl' ]


class Mums extends Component {
  render() {
    return (
      <div style={{ background: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>This is Mums Page</h1>
        <div className='cards'>
          {productOrder.map(type => <ProductCard key={type} category={category} name={products[type].name} description={products[type].description} />)}
        </div>
      </div>
    )
  }
}
 
export default Mums;