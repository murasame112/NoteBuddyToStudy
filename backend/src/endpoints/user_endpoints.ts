import { Console } from 'console'
import express from 'express'
import e, { Request, Response } from 'express'
import {User} from '../models/user_model';
import * as global from '../global_functions';

const table_name = 'users';