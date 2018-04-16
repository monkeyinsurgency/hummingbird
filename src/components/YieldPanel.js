import React from 'react';
import CropSelector from './CropSelector';
import Loading from './Loading';

const YieldPanel = props => (
    <div>
      <h2>{props.currentField ? props.currentField : `Please select a field.`}</h2>
      {!props.currentField ? (
        <Loading />
      ) : (
        <CropSelector
          currentField={props.currentField}
        />
      )}
    </div>
);

export default YieldPanel;
