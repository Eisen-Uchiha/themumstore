import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDrum, faMicrophone, faBullhorn, faBasketballBall, faFootballBall, faFutbol, faVolleyballBall, faBaseballBall, faStar } from '@fortawesome/free-solid-svg-icons'

const config = {
  Star: <FontAwesomeIcon icon={faStar} />,
  Band: <FontAwesomeIcon icon={faDrum} />,
  Choir: <FontAwesomeIcon icon={faMicrophone} />,
  Cheer: <FontAwesomeIcon icon={faBullhorn} />,
  Basketball: <FontAwesomeIcon icon={faBasketballBall} />,
  Football: <FontAwesomeIcon icon={faFootballBall} />,
  Soccer: <FontAwesomeIcon icon={faFutbol} />,
  Volleyball: <FontAwesomeIcon icon={faVolleyballBall} />,
  Tennis: <FontAwesomeIcon icon={faBaseballBall} />,
}

export default config