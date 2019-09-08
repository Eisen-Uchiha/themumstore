import React, { Component } from 'react'
import { Card } from 'antd'
import { Link } from "react-router-dom";

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

    return (
      <div className='card'>
        <Link to={`/${category}/${name.replace(' ', '-').toLowerCase()}`}>
          <Card className='product-card'>
              <Card.Grid className='product-card-image'>
                <h3>{name}</h3>
                <img
                  alt=''
                  src={`/media/current-models/${category.replace('s','')}-${name.replace(' ', '-').toLowerCase()}.jpeg`}
                  onError={e => { e.target.onerror = null; e.target.src="https://via.placeholder.com/225x225.png?text=Boutique+Mums" }}
                />
                <div style={{ padding: 10 }}><b>${price}</b></div>
              </Card.Grid>
              <Card.Grid className='product-card-desc' style={{ width: 'auto', textAlign: 'center', height: '-webkit-fill-available', maxWidth: '50%' }}>{description}</Card.Grid>
          </Card>
        </Link>
      </div>
    )
  }
}
 
export { ProductCard, products }
