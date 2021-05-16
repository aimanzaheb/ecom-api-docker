import React from 'react'
import PropTypes from 'prop-types'

const Rating = ({ value, text, color }) => {
  const getStar = (index) => {
    const star =
      value >= index
        ? 'fas fa-star'
        : value >= index - 0.5
        ? 'fas fa-star-half-alt'
        : 'far fa-star'
    return star
  }

  return (
    <div className='rating'>
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          <i style={{ color: color }} className={getStar(index)}></i>
        </span>
      ))}
      <span>{text ? text : ''}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#f8e825',
  value: 0, //otherwise will get undefined error because useEffect gets called after rendering component
}

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
}

export default Rating
