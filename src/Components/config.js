import React from 'react'
import { Icon } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDrum, faMicrophone, faBullhorn, faBasketballBall, faFootballBall,
  faFutbol, faVolleyballBall, faBaseballBall, faGolfBall, faStar, faRunning,
  faShoePrints, faTheaterMasks, faTractor, faFlagUsa,
} from '@fortawesome/free-solid-svg-icons'

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
  Golf: <FontAwesomeIcon icon={faGolfBall} />,
  Track: <FontAwesomeIcon icon={faRunning} />,
  'Cross Country': <FontAwesomeIcon icon={faShoePrints} />,
  Theater: <FontAwesomeIcon icon={faTheaterMasks} />,
  FFA: <FontAwesomeIcon icon={faTractor} />,
  ROTC: <FontAwesomeIcon icon={faFlagUsa} />,
  Baseball: <FontAwesomeIcon icon={faBaseballBall} />,
}

export default config