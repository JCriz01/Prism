//File is injected into the express app to handle routing and middleware
//Used in the bin/www.ts file to create the server
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import usersRouter from './routes/users';
import { PrismaClient } from '@prisma/client';
import passport from './utils/passport';
const app = express();

//custom defined prisma client
export const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//using passport for authentication
app.use(passport.session());
//app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
