import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import { toJS } from 'mobx';
import { BoxModel } from "../stores/models/Box";
import { MainStore } from "../stores/MainStore";
import { getSnapshot } from "mobx-state-tree";

test("Renders correctly the app", () => {
    const div = document.createElement("div");
    ReactDOM.render( <App /> , div);
    ReactDOM.unmountComponentAtNode(div);
});

// TEST ADD BOX
describe('Add a new box inside the canvas', () => {
    test('Should add a new box', () => {
        const store = MainStore.create()
        expect(store.boxes.length).toBe(0)
        const box = BoxModel.create({
            id: "test-box-id",
            color: "#0059FF",
            left: 0,
            top: 0
        });
        store.addBox(box)
        expect(store.boxes.length).toBe(1)
    });
})

// TEST DELETE BOX
describe("Delete the last added box inside the canvas", () => {
    test("should remove a box from the store", () => {
      const store = MainStore.create();
      const box1 = BoxModel.create({
        id: "box-id-1",
        color: "#0059FF",
        left: 100,
        top: 100,
      });
      const box2 = BoxModel.create({
        id: "box-id-2",
        color: "#7FABFF",
        left: 200,
        top: 200,
      });

      store.addBox(box1);
      store.addBox(box2);
  
      const numBoxesInCanvas = store.boxes.length;
  
      store.removeBox();
  
      // Check that the box was removed from the store
      expect(store.boxes.length).toBe(numBoxesInCanvas - 1);
      // Check that the removed box no longer exists in the store
      expect(store.boxes.find((box) => box.id === "box-id-2")).toBeUndefined();
  
    });
  });

  // TEST SELECT AND DESELECT BOX
  describe("Select and Deselect a box", () => {
    test("should select and deselect a box correctly", () => {
      const store = MainStore.create();
  
      const newBox = BoxModel.create({
        id: "test-box-id",
        color: "#0059FF",
        left: 100,
        top: 100,
        selected: false,
      });
      store.addBox(newBox);
    
      // Select the box
      store.changeStateSelected(newBox);
      expect(newBox.selected).toBe(true);
      // Deselect the box
      store.changeStateSelected(newBox);
      expect(newBox.selected).toBe(false);
    });
  });

  // TEST CHANGE COLOR

  describe("Change color of a box", () => {
    test("should change the color of a box", () => {
      const store = MainStore.create();
      const newBox = BoxModel.create({
        id: "test-box-id",
        color: "#0059FF",
        left: 100,
        top: 100,
        selected: true,
      });
  
      store.addBox(newBox);
  
      const initialColor = newBox.color;
  
      store.changeColor('#7FABFF');
      expect(newBox.color).toBe('#7FABFF');
      store.changeColor(initialColor);
      expect(newBox.color).toBe(initialColor);
    });
  });

  // TEST COUNTER SELECTED BOXES

  describe("Show the correct number of selected boxes", () => {
    it("should count the number of selected boxes correctly", () => {
      const store = MainStore.create();
  
      const box1 = BoxModel.create({
        id: "box-1",
        color: "#0059FF",
        left: 100,
        top: 100,
      });
      const box2 = BoxModel.create({
        id: "box-2",
        color: "#7FABFF",
        left: 200,
        top: 200,
      });
  
      store.addBox(box1);
      store.addBox(box2);
  
      // there should be no selected boxes  at the beginning
      expect(store.arrayBoxes.length).toBe(0);
  
      // Selecting boxes
      store.changeStateSelected(box1);
      expect(store.arrayBoxes.length).toBe(1);
      store.changeStateSelected(box2);
      expect(store.arrayBoxes.length).toBe(2);
  
      // Deselect boxes
      store.changeStateSelected(box1);
      expect(store.arrayBoxes.length).toBe(1);
      store.changeStateSelected(box2);
      expect(store.arrayBoxes.length).toBe(0);
    });
  });
  
  // TEST DRAGGING BOXES

  describe("Move selected boxes and change color", () => {
    test("should move and change color of the selected boxes correctly", () => {

      const store = MainStore.create();
  
      const box1 = BoxModel.create({
        id: "box-1",
        color: "#0059FF",
        left: 100,
        top: 100,
      });
      const box2 = BoxModel.create({
        id: "box-2",
        color: "#7FABFF",
        left: 200,
        top: 200,
      });
      const box3 = BoxModel.create({
        id: "box-3",
        color: "#BED4FE",
        left: 300,
        top: 300,
      });

      store.addBox(box1);
      store.addBox(box2);
      store.addBox(box3);
  
 
      store.changeStateSelected(box1);
      store.changeStateSelected(box3);
  
      store.changeColor('#FEEEBE');
      // Move the selected boxes
      store.moveBoxesSelected(80, 80);
  
      // Check that the positions of the first and third boxes are updated correctly
      expect(box1.left).toBe(180);
      expect(box1.top).toBe(180);
      expect(box3.left).toBe(380);
      expect(box3.top).toBe(380);
  
      // Check that color has change for the selected boxes

      expect(box1.color).toBe('#FEEEBE');
      expect(box3.color).toBe('#FEEEBE');

      // Deselect the boxes
      store.changeStateSelected(box1);
      store.changeStateSelected(box3);
  
      // Check that the position and color of the second box is not updated because it's not selected
      expect(box2.left).toBe(200);
      expect(box2.top).toBe(200);
      expect(box2.color).not.toBe('#FEEEBE');
    });
  });

  // TEST SAVE AND RESTORE STATE 

  describe("Save the state of the app locally and restore it when it loads", () => {
    test("should save and restore the state", () => {
      const store = MainStore.create();
  
      const box1 = BoxModel.create({
        id: "box-1",
        color: "#0059FF",
        left: 100,
        top: 100,
      });
  
      store.addBox(box1);
  
      // Save the state
      localStorage.setItem("genially-test", JSON.stringify(getSnapshot(store)));
  
     // Check that the store is not empty
    expect(store.boxes.length).toBe(1);
    expect(store.history.length).toBe(1);
    expect(store.currentStep).toBe(0);

    // Restore the state
    const initialState = JSON.parse(localStorage.getItem("genially-test"));
    const restoredStore = MainStore.create(initialState);

    // Check that the restored store has the same state as the original store
    expect(getSnapshot(restoredStore)).toEqual(getSnapshot(store));
    });
  });

  // TEST UNDO AND REDO FUNCTION
  describe("Save the state of the app locally and restore it when it loads", () => {  
    test('should undo and redo correctly', () => {
      const store = MainStore.create();
      const box1 = BoxModel.create({
        id: "box1",
        color: "#0059FF",
        left: 100,
        top: 100,
      });

      store.addBox(box1);

      
      // A little change to the box
      box1.setColor('#BED4FE');
      store.saveToHistory();
      
      // Save snapshot before changes
      const snapshotAfterChanges = store.history[store.currentStep].map(box => toJS(box));

      // Undo
      store.undo();

      // Check box return to initial state
      const boxAfterUndo = store.boxes.find(box => box.id === 'box1');
      expect(boxAfterUndo.color).toBe('#0059FF'); 

      // Redo
      store.redo();

      // Check the box return to the state of color change
      const boxAfterRedo = store.boxes.find(box => box.id === 'box1');
      expect(boxAfterRedo.color).toBe('#BED4FE'); 

      // Check the state of store after the change and before of redo action
      expect(store.history[store.currentStep].map(box => toJS(box))).toEqual(snapshotAfterChanges);
    });
  });