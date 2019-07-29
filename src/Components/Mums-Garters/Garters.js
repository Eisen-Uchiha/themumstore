import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'

const category = 'garters'
const productOrder = [ 'xs', 'mini', 'sm', 'med', 'lg', 'xl' ]

class Garters extends Component {
  render() {
    return (
      <div style={{ minHeight: '100px', background: 'white' }}>
        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>This is Garters Page</h1>
        {productOrder.map(type => <ProductCard key={type} category={category} name={products[type].name} description={products[type].description} />)}
      </div>
    )
  }
}
 
export default Garters;