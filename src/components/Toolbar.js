import React from "react";
import { observer } from "mobx-react";
import getNewBox from '../utils/getNewBox';

function Toolbar({store}) {

  const handleAdd = () => {
    const addedBox = getNewBox();
    store.addBox(addedBox);
  }

  const handleRemove = () => {
    store.removeBox();
  }

  return (
    <div className="toolbar">
      <button onClick={handleAdd}>Add Box</button>
      <button onClick={handleRemove}>Remove Box</button>
      <input type="color" />
      <span> 
        {
            `${store.arrayBoxes.length} boxes select`
        }
      </span>
    </div>
  );
}

export default observer(Toolbar);
