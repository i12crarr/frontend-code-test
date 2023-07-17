import uuid from "uuid/v4";
import BoxModel from '../stores/models/Box';
import getRandomColor from './getRandomColor';
import getRandomNumber from './getRandomNumber';

const getNewBox = () => {
  return BoxModel.create({
    id: uuid(),
    color: getRandomColor(),
    left: getRandomNumber(0, 1200 - 200), // 200 is the width of the box, this way we avoid to create the box out of the canvas
    top: getRandomNumber(0, 675 - 100) // 100 is the height of the box, this way we avoid to create the box out of the canvas
  });
};

export default getNewBox;
