import React from "react";
import ReactDom from "react-dom";


var FileUpload = React.createClass({

  handleFile: function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file) return;

    reader.onload = function(img) {
      ReactDom.findDOMNode(this.refs.in).value = '';
      console.log("img.target : ",img.target);
      this.props.handleFileChange(img.target.result, file);
    }.bind(this);
   // console.log("File : ",file)
    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input ref="in" type="file" accept="image/jpeg, image/png" onChange={this.handleFile} title=" " />
    );
  }
});

module.exports = FileUpload;