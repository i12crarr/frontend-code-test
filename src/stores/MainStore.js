import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel)
  })
  .actions(self => {
    return {
      addBox(box) {
        self.boxes.push(box);
      },
      removeBox() {
        self.boxes.length < 1 && alert('No more boxes to delete');
        self.boxes.pop();
      },
      changeColor(e) {
        self.arrayBoxes.map(box => box.setColor(e));
      },
      moveBoxesSelected(dx, dy) {
        self.arrayBoxes.map(box => box.moveSelected(dx, dy))
      }
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
