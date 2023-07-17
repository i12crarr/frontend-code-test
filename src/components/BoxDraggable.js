import React, {useRef, useEffect} from "react";
import { observer } from "mobx-react";
import interact from "interactjs";


function BoxDraggable(props) {

  const boxRef = useRef(null)
  useEffect (() => {
        interact (boxRef.current).draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],

        listeners: {
          move (event) {
            dragListener(event)
            props.box.setSelected(true)
          }
        }
      }).on ('tap', props.box.changeStateSelected)

      function dragListener (event) {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || props.left) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || props.top) + event.dy
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }
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
        border: props.box.selected ? 'dashed 4px white' : 'none',
        fontWeight: props.box.selected ? 'bold' : 'inherit',
        color: props.box.selected ? 'white' : 'black'
      }}
      ref={boxRef}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);
