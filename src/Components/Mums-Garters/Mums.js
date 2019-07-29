import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'

const category = 'mums'
const productOrder = [ 'xs', 'mini', 'sm', 'med', 'lg', 'xl' ]


class Mums extends Component {
  render() {
    return (
      <div style={{ minHeight: '100px', background: 'white' }}>
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>This is Mums Page</h1>
        {productOrder.map(type => <ProductCard key={type} category={category} name={products[type].name} description={products[type].description} />)}
      </div>
    )
  }
}
 
export default Mums;