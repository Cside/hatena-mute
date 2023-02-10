import { chrome } from 'jest-chrome';
import './runtime';
import './storage';

Object.assign(global, { chrome });
