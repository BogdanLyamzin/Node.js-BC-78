import express from "express";
import cors from "cors";
import pino from "pino-http";

const app = express(); // app - web-server

app.use(cors());
app.use(express.json());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// const corsMiddleware = cors();
// app.use(corsMiddleware);

// const cors = options => {
//   return (req, res, next)=> {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
//     next();
//   }
// }

// app.use((req, res, next)=> {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  // next();
// })

// app.use((req, res, next)=> {
//   console.log("First middleware");
//   next();
// })

// app.use((req, res, next)=> {
//   console.log("Second middleware");
//   next();
// })

// app.set("json spaces", 4);
/* request - об'єкт, що містить всі дані про запит:
- адреса запиту;
- метод запиту;
- параметри;
- динамічна частина адреси;
- тіло запиту (body) (для POST, PUT, PATCH запитів)
- заголовки (headers)
- cookies
*/
/*
response - об'єкт, що дозволяє налаштувати і віправити відповідь. Він визначає:
- тіло відповіді (HTML чи JSON)
- статус відповіді (200, 400 - помилка, 404 помилка, 500 - помилка)
*/
app.get("/", (req, res)=> {
  console.log(req.method);
  console.log(req.url);
  res.send("<h1>Home page</h1>");
})

app.get("/contacts", (req, res)=> {
  // const databaseResponse = null;
  // res.json(databaseResponse);
  // res.send(databaseResponse);
  res.json({
    message: "Get all contacts"
  });
  // res.send([]);
})

app.get("/contacts/:id", (req, res)=> {
  const {id} = req.params;
  res.json({
    message: `Get contact with id=${id}`
  })
})

app.get("/users", (req, res)=> {
  throw new Error("Not found users");
})

// Якщо запит прийщов на адресу якої немає
app.use((req, res)=> {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`
  })
})
// якщо в middleware або controller вилетіла помилка
app.use((error, req, res, next)=> {
  res.status(500).json({
    message: error.message
  })
})

app.listen(3030, ()=> console.log("Server running on 3030 port"));
