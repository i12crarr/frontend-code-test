import React, {useRef, useEffect} from "react";
import { observer } from "mobx-react";
import interact from "interactjs";
import store from '../stores/MainStore';


function BoxDraggable(props) {

  const boxRef = useRef(null)
  useEffect (() => {
        let isMoved = false;
        let currentRef = boxRef.current;
        interact (boxRef.current).draggable({
        listeners: {
          move (event) {
            isMoved = true;
            store.setSelected(props.box)
            store.moveBoxesSelected(event.dx, event.dy)
          }
        }
      })
      const handleMouseUp = () => {
        isMoved = false; 
      };
      const handleMouseDown = () => {
        if (!isMoved) {
          store.changeStateSelected(props.box); 
        }
      };
      currentRef.addEventListener("dblclick", handleMouseDown);
      currentRef.addEventListener("mouseup", handleMouseUp);
      return () => {
        currentRef.removeEventListener("dblclick", handleMouseDown);
        currentRef.removeEventListener("mouseup", handleMouseUp);
      };
  }, [props])
    
  return (
    <div
      id={props.id}
      className="box"
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        boxShadow: props.box.selected ? "0 0 4pt 4pt rgb(60, 60, 60)" : 'none',
        fontWeight: props.box.selected ? 'bold' : 'inherit',
        color: props.box.selected ? 'rgb(60, 60, 60)' : 'black'
      }}
      ref={boxRef}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
