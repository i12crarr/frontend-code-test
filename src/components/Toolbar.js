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

  const handleChangeColor = (e) => {
    store.changeColor(e.target.value);
  }

  const handleUndo = () => {
    store.undo();
  };

  const handleRedo = () => {
    store.redo();
  };

  return (
    <div className="toolbar">
      <button onClick={handleAdd}>Add Box</button>
      <button onClick={handleRemove}>Remove Box</button>
      <button onClick={handleUndo} disabled={store.currentStep <= 0}>
        Undo
      </button>
      <button onClick={handleRedo} disabled={store.currentStep >= store.history.length - 1}>
        Redo
      </button>
      <input type="color" onChange={handleChangeColor}/>
      <span> 
        {
            `${store.arrayBoxes.length} boxes select => `
        }
      </span>
      <br></br>
      <span> 
        {` *Double Click to select or deselect a box*`}
      </span>
    </div>
  );
}

export default observer(Toolbar);
