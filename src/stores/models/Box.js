import { types } from "mobx-state-tree";

export const BoxModel = types
    .model("Box", {
        id: types.identifier,
        width: 200,
        height: 100,
        color: "#FFF000",
        left: 200,
        top: 100,
        selected: false,
    })
    .views(self => ({}))
    .actions(self => ({
        changeStateSelected() {
            self.selected = !self.selected
        },
        setSelected() {
            self.selected = true;
        },
        setColor(color) {
            self.color = color
        },
        moveSelected(x, y) {
            const newLeft = Math.min(self.left + x, (1200 - 200))
            const newTop = Math.min(self.top + y, (675 - 100))

            self.left = Math.max(0, newLeft)
            self.top = Math.max(0, newTop)
        },
    }));

export default BoxModel;