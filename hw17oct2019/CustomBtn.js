import React from 'react';
import './CustomBtn.css';
import Moment from 'react-moment';

let saySmth = function(e) {
    alert(123, e);
};
const dateToFormat = new Date();

function CustomBtn() {
  return (
    
      <button className="custom-btn"
      onClick={ saySmth }><Moment date={dateToFormat} /></button>
  );
}

export default CustomBtn;
