import uuid from "uuid/v4";
import BoxModel from '../stores/models/Box';
import getRandomColor from './getRandomColor';


const getNewBox = () => {
  return BoxModel.create({
    id: uuid(),
    color: getRandomColor(),
    left: 0,
    top: 0
  });
};

export default getNewBox;
