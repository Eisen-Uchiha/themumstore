import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDrum, faMicrophone, faBullhorn, faBasketballBall, faFootballBall,
  faFutbol, faVolleyballBall, faBaseballBall, faGolfBall, faStar, faRunning,
  faShoePrints, faTheaterMasks, faTractor, faFlagUsa, faMale, faFemale,
} from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as Man } from './custom-icons/man.svg'
import { ReactComponent as Woman } from './custom-icons/woman.svg'

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
  Male: <FontAwesomeIcon icon={faMale} />,
  Female: <FontAwesomeIcon icon={faFemale} />,
  Man: <Man style={{ width: '1em', height: '1em', fill: 'currentColor' }} />,
  Woman: <Woman style={{ width: '1em', height: '1em', fill: 'currentColor' }} />,
}

export default config