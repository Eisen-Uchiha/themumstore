import React, { Component } from 'react'
import { Card } from 'antd'
import { Link } from "react-router-dom";
import prices from '../../price-list'

const products = {
  spiritbadge: { name: 'Spirit Badge'},
  mini: { name: 'Mini'},
  small: { name: 'Small'},
  medium: { name: 'Medium'},
  large: { name: 'Large'},
  extralarge: { name: 'Extra Large'},
}

class ProductCard extends Component {
  render() {
    const { name, description, category, price } = this.props
    console.log(this.props)

    return (
      <div className='card'>
        <Link to={`/${category}/${name.replace(' ', '-').toLowerCase()}`}>
          <Card style={{ maxWidth: '350px', maxHeight: '311px', minWidth: '310px', minHeight: '500px', margin: '5px' }}>
              <Card.Grid style={{ minWidth: '50%', textAlign: 'center', height: '-webkit-fill-available' }}>
                <h3>{name}</h3>
                <img alt='' style={{ width: 'inherit', minWidth: '-webkit-fill-available' }} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/200px-Hello_kitty_character_portrait.png" />
                <div style={{ padding: 10 }}><b>${price}</b></div>
              </Card.Grid>
              <Card.Grid style={{ width: 'auto', textAlign: 'center', height: '-webkit-fill-available', maxWidth: '50%' }}>{description}</Card.Grid>
          </Card>
        </Link>
      </div>
    )
  }
}
 
export { ProductCard, products }
