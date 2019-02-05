import React from 'react';
import { Link, browserHistory } from 'react-router';

	class ImageContainer extends React.Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  };
	  this.goToHomePage = this.goToHomePage.bind(this);
  
  }

	goToHomePage(){
    browserHistory.push("/");
  }

	render(){
    return (
      <section className="sign-up-banner pull-left">
		     <div>
		       <img onClick={this.goToHomePage} src='./images/logo@2x.png' alt='legably-white-logo' className='img-responsive logo' width='180' height="47" />
		       <h3>Find the best legal job </h3>
		       <h3>Hire the best attorney</h3>
		       <p>Legably is the modern online legal staffing platform that connects attorneys seeking work with other attorneys and firms in need of their services.</p>
		     </div>
		   </section>
    );
  }
}

export default ImageContainer;
