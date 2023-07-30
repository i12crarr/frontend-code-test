import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import BoxModel from "../stores/models/Box";
import { getSnapshot } from 'mobx-state-tree';
import { MainStore } from "../stores/MainStore";

test("Renders correctly the app", () => {
    const div = document.createElement("div");
    ReactDOM.render( <App /> , div);
    ReactDOM.unmountComponentAtNode(div);
});

describe('Add a new box inside the canvas', () => {
    test('Should add a new box', () => {
        const store = MainStore.create()
        expect(store.boxes.length).toBe(0)
        const box = BoxModel.create({
            id: "test-box-id",
            color: "#FF0000",
            left: 0,
            top: 0
        });
        store.addBox(box)
        expect(store.boxes.length).toBe(1)
    });
})

describe("Delete the last added box inside the canvas", () => {
    test("should remove a box from the store", () => {
      const store = MainStore.create();
      const box1 = BoxModel.create({
        id: "box-id-1",
        color: "#FF0000",
        left: 100,
        top: 100,
      });
      const box2 = BoxModel.create({
        id: "box-id-2",
        color: "#00FF00",
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

  describe("Select and Deselect a box", () => {
    test("should select and deselect a box correctly", () => {
      const store = MainStore.create();
  
      const newBox = BoxModel.create({
        id: "test-box-id",
        color: "#FF0000",
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