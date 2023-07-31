import { onSnapshot, types, addMiddleware } from 'mobx-state-tree';
import { toJS } from 'mobx';
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

export const MainStore = types
    .model("MainStore", {
        boxes: types.array(BoxModel),
        history: types.array(types.array(BoxModel)),
        currentStep: types.optional(types.number, -1),
    })
    .actions(self => {
        return {
            resetState() {
                localStorage.removeItem("genially-test");
                window.location.reload();
            },
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
            setSelected(box)  {
                box.setSelected(true);
                self.saveToHistory();
            },
            changeStateSelected(box) {
                box.selected = !box.selected;
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
            get arrayBoxes() {
                return self.boxes.filter(box => box.selected)
            }
        }
    });


let store = null
if (localStorage.getItem('genially-test')) {
    const initialState = JSON.parse(localStorage.getItem('genially-test'))
    store = MainStore.create(initialState)
} else {
    store = MainStore.create()
    const box1 = BoxModel.create({
        id: uuid(),
        color: getRandomColor(),
        left: 0,
        top: 0
    });
    store.addBox(box1);
}

onSnapshot(store, snapshot => {
    localStorage.setItem('genially-test', JSON.stringify(snapshot))
})

export default store;