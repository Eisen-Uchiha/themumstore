import React, { Component } from 'react'
import { ProductCard, products } from './ProductCard'

const category = 'garters'
const productOrder = [ 'xs', 'mini', 'sm', 'med', 'lg', 'xl' ]

class Garters extends Component {
  render() {
    return (
      <div style={{ background: 'white' }}>
        <h1 style={{ textAlign: 'center' }}>This is Garters Page</h1>
        <div className='cards'>
          {productOrder.map(type => <ProductCard key={type} category={category} name={products[type].name} description={products[type].description} />)}
        </div>
      </div>
    )
  }
}
 
export default Garters;