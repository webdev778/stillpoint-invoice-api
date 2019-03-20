import React from 'react';
import Rating from 'react-rating';
import { constant } from '../../../../shared/index';

export default class JobComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfoHovered: true
    };

    this.hoverOnInfo = this.hoverOnInfo.bind(this);
    this.hoverOffInfo = this.hoverOffInfo.bind(this);
  }

  handleClick() {}

  hoverOnInfo() {
    console.log('hovered');
    this.setState({
      isInfoHovered: true
    });
  }

  hoverOffInfo() {
    this.setState({
      isInfoHovered: false
    });
  }

  showStarGroup(fullStar) {
    const stars = [];

    for (let i = 1; i <= 4; i++) {
      let element = null;

      if (i <= fullStar) {
        element = <i key={i} className="fa fa-star fa-2x" aria-hidden="true" />;
      } else {
        element = <i key={i} className="fa fa-star-o fa-2x" aria-hidden="true" />;
      }

      stars.push(element);
    }

    return stars;
  }

  render() {
    const isSeeker = this.props.role === constant['ROLE']['SEEKER'];
    const { isInfoHovered } = this.state;

    return (
      <div>
        <div className="status-content mt-45">
          {isSeeker ? "Nice work! You've completed this job." : 'All milestones for this job have been completed.'}
        </div>
        <div className="status-content mt-15">
          Please rate your experience with this
          {isSeeker ? ' candidate' : ' hiring manager'}
          <span className="rating-info-icon">
            <i onMouseEnter={this.hoverOnInfo} onMouseLeave={this.hoverOffInfo} className="fa fa-question-circle-o ml-5" aria-hidden="true" />
            {isInfoHovered && (
              <div className="rating-info-box pl-10">
                <div className="each-detail">
                  {this.showStarGroup(1)}
                  <span>
                    <h5> Would never work with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(2)}
                  <span>
                    <h5> Would consider working with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(3)}
                  <span>
                    <h5> Would want to work with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(4)}
                  <span>
                    <h5> Would definitely want to work with them again</h5>
                  </span>
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="rating-box mt-20 ml-10">
          <Rating className="star-rating ml-10" emptySymbol="fa fa-star-o fa-2x" fullSymbol="fa fa-star fa-2x" stop={4} initialRating={3} />
          <button type="button" className="btn ml-30 btn-primary" onClick={this.handleClick}>
            Save rating
          </button>
        </div>
      </div>
    );
  }
}
