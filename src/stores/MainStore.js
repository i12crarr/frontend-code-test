import { types, addMiddleware } from 'mobx-state-tree';
import {toJS} from 'mobx';
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    history: types.array(types.array(BoxModel)),
    currentStep: types.optional(types.number, -1),
  })
  .actions(self => {
    return {
      addBox(box) {
        self.boxes.push(box);
        self.saveToHistory();
      },
      removeBox() {
        self.boxes.length < 1 && alert('No more boxes to delete');
        self.boxes.pop();
        self.saveToHistory();
      },
      changeColor(e) {
        self.arrayBoxes.map(box => box.setColor(e));
        self.saveToHistory();
      },
      moveBoxesSelected(dx, dy) {
        self.arrayBoxes.forEach(box => {
          box.previousPosition = { left: box.left, top: box.top };
          box.moveSelected(dx, dy);
        });
        self.saveToHistory();
      },
      setSelected(selected) {
        self.boxes.forEach(box => {
          box.setSelected(selected);
        });
        self.saveToHistory();
      },
      toggleBoxSelected(box) {
        box.changeStateSelected();
        self.saveToHistory();
      },
      afterCreate() {
        addMiddleware(self, (call, next) => {
          if (call.name === 'move') {
            self.saveToHistory();
          }
          return next(call);
        });
      },
      saveToHistory() {
        self.currentStep++;
        self.history.splice(self.currentStep);
        self.history.push(self.boxes.map(box => toJS(box))); 
      },
      undo() {
        if (self.currentStep > 0 && self.currentStep < self.history.length) {
          self.currentStep--;
          const snapshot = self.history[self.currentStep].map(box => ({
            ...toJS(box),
            left: box.previousPosition.left, 
            top: box.previousPosition.top,
          }));
          self.boxes.replace(snapshot);
        }
      },
  
      redo() {
        if (self.currentStep >= 0 && self.currentStep < self.history.length - 1) {
          self.currentStep++;
          const snapshot = self.history[self.currentStep].map(box => toJS(box)); 
          self.boxes.replace(snapshot); 
        }
      },
    };
  })
  .views(self => {
    return {
        get arrayBoxes () {
            return self.boxes.filter(box => box.selected)
        }
    }
  });

const store = MainStore.create();

const box1 = BoxModel.create({
  id: uuid(),
  color: getRandomColor(),
  left: 0,
  top: 0
});

store.addBox(box1);

export default store;
