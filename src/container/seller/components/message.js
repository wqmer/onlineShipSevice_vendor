import React from 'react';
import lifecycle from 'react-pure-lifecycle';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Input, Radio, Select, message } from 'antd';

// create your lifecycle methods
const componentWillReceiveProps = (props) => {
      message.success(props.message)
};

// make them properties on a standard object
const methods = {
      componentWillReceiveProps 
};

const FunctionalComponent = () => {
  return (
    <div> </div>
  );
};

// decorate the component
export default lifecycle(methods)(FunctionalComponent);