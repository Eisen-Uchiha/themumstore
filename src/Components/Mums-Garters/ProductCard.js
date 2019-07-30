import React, { Component } from 'react'
import { Card } from 'antd'
import { Link } from "react-router-dom";

const products = {
  xs: {
    name: 'Spirit Badge',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
  
  mini: {
    name: 'Mini',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
  
  sm: {
    name: 'Small',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
  
  med: {
    name: 'Medium',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
  
  lg: {
    name: 'Large',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
  
  xl: {
    name: 'Extra Large',
    description: 'Placeholder description about the product, including price, customization options, and sizes available',
  },
}

class ProductCard extends Component {
  render() {
    const { name, description, category } = this.props

    return (
      <div>
        <Link to={`/${category}/${name.replace(' ', '-').toLowerCase()}`}>
          <Card style={{ maxWidth: '300px', maxHeight: '311px', minWidth: '290px', float: 'left', margin: '5px' }}>
              <Card.Grid style={{ width: '65%', textAlign: 'center', height: '-webkit-fill-available' }}>
                <h3>{name}</h3>
                <img alt='' style={{ width: 'inherit', minWidth: '-webkit-fill-available' }} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" />
              </Card.Grid>
              <Card.Grid style={{ width: 'auto', textAlign: 'center', height: '-webkit-fill-available', maxWidth: '35%' }}>{description}</Card.Grid>
          </Card>
        </Link>
      </div>
    )
  }
}
 
export { ProductCard, products }
