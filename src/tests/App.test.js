import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import BoxModel from "../stores/models/Box";
import { MainStore } from "../stores/MainStore";

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

  describe("MainStore", () => {
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

  describe("MainStore", () => {
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