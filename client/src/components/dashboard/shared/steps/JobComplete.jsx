import React from 'react';

import { constant } from '../../../../shared/index';

export default class JobComplete extends React.Component {
  render() {
    return (
      <div>
        <div className="status-content mt-45">
          {
            this.props.role === constant['ROLE']['SEEKER'] ?
              'Nice work! You\'ve completed this job.'
            :
              'All milestones for this job have been completed.'
          }
        </div>
      </div>
    );
  }
}
