import context from './context/index.js';
import images from './images/index.js';
import mod from './mod/index.js';
import others from './others/index.js';
import Commands from '../utils/Commands.js';

export default Commands.fromCommands([context(), images(), mod(), others()]);
