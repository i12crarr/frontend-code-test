import { types } from "mobx-state-tree";

const BoxModel = types
  .model("Box", {
    id: types.identifier,
    width: 200,
    height: 100,
    color: "#FFF000",
    left: 200,
    top: 100,
    selected: false,
    previousPosition: types.optional(types.frozen(), { left: 0, top: 0 }),
  })
  .views(self => ({}))
  .actions(self => ({
    changeStateSelected () {
      self.selected = !self.selected
    },
    setSelected (selected) {
      self.selected = selected
    },
    setColor (color) {
      self.color = color
    },
    moveSelected (x, y) {
        self.previousPosition = { left: self.left, top: self.top };
        const newLeft = Math.min (self.left + x, (1200 - 200))
        const newTop = Math.min (self.top + y, (675 - 100))

        self.left = Math.max (0, newLeft)
        self.top = Math.max (0, newTop)  
    },
    setInitialPosition() {
      self.left = self.initialPosition.left;
      self.top = self.initialPosition.top;
    },

  
  }));

export default BoxModel;
