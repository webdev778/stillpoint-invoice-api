import React from 'react';
import Rating from 'react-rating'
import { constant } from '../../../../shared/index';

export default class JobComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleClick() {
  }

  render() {
    const isSeeker = this.props.role === constant['ROLE']['SEEKER']

    return (
      <div>
        <div className="status-content mt-45">
          {
            isSeeker ?
              'Nice work! You\'ve completed this job.'
            :
              'All milestones for this job have been completed.'
          }
        </div>
        <div className="status-content mt-15">
          Please rate your experience with this
          {isSeeker ? ' candidate' : ' hiring manager'}
        </div>
        <div className='rating-box'>
          <Rating
            className="star-rating ml-10"
            emptySymbol="fa fa-star-o fa-2x"
            fullSymbol="fa fa-star fa-2x"
            stop={4}
            initialRating={3}
          />
          <button type="button" className="btn ml-20 btn-primary" onClick={this.handleClick}>
            Save rating
          </button>
        </div>
      </div>
    );
  }
}
