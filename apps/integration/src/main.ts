/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as cors from 'cors';
import { pageRoute, tableRoute, searchRoute, userRoute } from './app/routes'

const app = express();

app.use(cors())

app.get("/api/page/:pageId", pageRoute)
app.get("/api/table/:pageId", tableRoute)
app.get("/api/search", searchRoute)
app.get("/api/user/:userId", userRoute)
app.get('*', (req, res) => {
    res.status(400).send({ message: 'Message route not found!' });
});


const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
