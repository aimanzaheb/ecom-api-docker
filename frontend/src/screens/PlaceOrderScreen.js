import React, { useRef } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  //Calculate price
  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 100
  cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2)) //15%
  cart.totalPrice =
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)

  const currency = new Intl.NumberFormat('en-US', {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Browser_compatibility
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const willMount = useRef(true)
  if (willMount.current) {
    dispatch({ type: ORDER_CREATE_RESET }) //dispatch before component mount only once
    willMount.current = false
  }

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      {(!Object.keys(cart.shippingAddress).length || !cart.paymentMethod) && (
        <Redirect to='/shipping' />
      )}
      {success && <Redirect to={`/order/${order._id}`} />}
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroupItem>

            <ListGroupItem>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item) => (
                    <ListGroupItem key={item.productId}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.productId}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {currency.format(item.price)} =
                          {currency.format(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Sumary</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Items</Col>
                  <Col>{currency.format(cart.itemsPrice)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{currency.format(cart.shippingPrice)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>GST</Col>
                  <Col>{currency.format(cart.taxPrice)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total</Col>
                  <Col>{currency.format(cart.totalPrice)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroupItem>
              <ListGroupItem>
                <Button
                  block
                  disabled={!cart.cartItems.length}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
