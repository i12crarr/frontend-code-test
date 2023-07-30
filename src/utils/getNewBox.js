import uuid from "uuid/v4";
import BoxModel from '../stores/models/Box';
import getRandomColor from './getRandomColor';


const getNewBox = () => {
  const random = Math.random();
  let randomNum = Math.floor(random * (575 - 10 + 1)) + 10;
  return BoxModel.create({
    id: uuid(),
    color: getRandomColor(),
    left: 0 + randomNum,
    top: 0 + randomNum
  });
};

export default getNewBox;
