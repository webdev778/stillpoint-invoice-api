import React from 'react';
import ReactDOM from 'react-dom'
export default class MaskedInput extends React.Component {
  constructor(props) {
     super(props);
    

     this.state = {
      valor : this.props.phonevalue ? this.props.phonevalue : ''
     };
   this.handleChange = this.handleChange.bind(this);
   this.handleBlur = this.handleBlur.bind(this);
   }
  handleChange(e){
    
    this.setState({valor : e.target.value},function(){
      this.props.getvalue(this.state.valor);
    });
    
   
  }
  handleBlur(e){
   this.props.onblur(e);

  }
  componentWillReceiveProps(nextProps) {
     
    this.setState({
     valor : nextProps.phonevalue
    });
  }
  componentDidMount() {
    var $elem = $(ReactDOM.findDOMNode(this.refs.maskedInput));    
    var reverse = {reverse: false};
    
    if(this.props.isReverse){
      reverse = {reverse: true};
    }
    
    $elem.mask(this.props.mask, reverse);

  }
  render(){
    return (<div><input type="text" value={this.state.valor} name="phone_number" className="form-control" onBlur={this.handleBlur} placeholder="Phone Number" onChange={this.handleChange} ref="maskedInput"></input></div>);
  }
};