import React from 'react'
import { Link } from 'react-router-dom' //Use instead anchor tag to prevent page reload
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p3 rounded'>
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>&#8377;{product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

//const ProductWithRouter = withRouter(Product) //if want to access props such as history, match etc in this component
export default Product
