let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');
let uuid = require('uuid');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static('public'));

app.use(morgan("dev"));

let blogposts = [{
          id: uuid.v4(),
          title: "Vocalizando",
          content: "Cómo prepararse para mejorar",
          author: "Daniela Garcia",
          publishDate: Date.now()
        },
        {
          id: uuid.v4(),
          title: "Inicializando",
          content: "Cómo comenzar el proceso",
          author: "Carlos Pérez",
          publishDate: Date.now()
        },
        {
          id: uuid.v4(),
          title: "Finalizando",
          content: "Cómo terminar el proceso",
          author: "Carlos Pérez",
          publishDate: Date.now()
        },
        {
          id: uuid.v4(),
          title: "Twitter",
          content: "Lo que tienes que saber de la plataforma",
          author: "Marisol Paipilla",
          publishDate: Date.now()
        }];

app.get("/api/blog-posts", (req, res, next) =>{
  return res.status(200).json( blogposts );
});

app.get("/api/blog-post", (req, res, next) =>{
  let author = req.query.author;

  if (!author) {
    res.statusMessage = "Missing author in parameter!";
    return res.status(406).json({
      message : "Missing author in parameter!",
      status : 406
    });
  }

  let posts = blogposts.filter(post => {
    console.log(post.author + " === " + author);
    return post.author === author;
  });

  if (posts.length === 0) {
    res.statusMessage = " Author not found on the list";
    return res.status(404).json({
      message: "Auhor not found on the list",
      status: 404
    });
  } else {
    return res.status(200).json( posts );
  }

});

app.post("/api/blog-posts", jsonParser, (req, res) =>{
  let author = req.body.author;
  let title = req.body.title;
  let content = req.body.content;
  let publishDate = req.body.publishDate;

  if ( ! author || ! title || ! content || ! publishDate){
    res.statusMessage = "Missing at least one field in body!";
    return res.status(406).json({
      message : "Missing at least one field in body!",
      status : 406
    });
  }
  let post = {
    id: uuid.v4(),
    title: title,
    content: content,
    author: author,
    publishDate: publishDate
  }

  blogposts.push(post);
  return res.status(201).json( post );
});

app.delete("/api/blog-posts/:id", (req, res, next) => {
    let id = req.params.id;
    let post = blogposts[0];


    // if an id is found
    for (var i = 0; i < blogposts.length; i++) {

      if (id == blogposts[i].id) {
        post = blogposts[i];
        blogposts.splice(i, 1);
        res.statusMessage = "Post succesfully deleted";
        return res.status(200).json(post);
      }
    }

    //if id is not found
    res.statusMessage = "ID not found on the list";
    return res.status(404).json({
      message : "ID not found on the list",
      status : 404
    });
});


app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
    let id = req.params.id;
    let bodyID = req.body.id;
    let author = req.body.author;
    let title = req.body.title;
    let content = req.body.content;
    let publishDate = req.body.publishDate;

    if ( ! bodyID ){
      res.statusMessage = "Missing id in body!";
      return res.status(406).json({
        message : "Missing id in body!",
        status : 406
      });
    }

    if ( id != bodyID ){
      res.statusMessage = "Bad request id in params do not match with body";
      return res.status(409).json({
        message : "Bad request id in params do not match with body",
        status : 409
      });
    }

    let post = blogposts[0];
    // to check if id exists
    for (var i = 0; i < blogposts.length; i++) {

      if (id == blogposts[i].id) {
        post = blogposts[i];

        if ( title ) {
          post.title = title;
        }
        if ( publishDate ) {
          post.publishDate = publishDate;
        }
        if ( content ) {
          post.content = content;
        }
        if ( author ) {
          post.author = author;
        }
        res.statusMessage = "Post succesfully updated";
        return res.status(202).json( post );
      }
    }

    // if id not found
    res.statusMessage = "post with specified id not found";
    return res.status(404).json({
      message : "post with specified id not found",
      status : 404
    });
});

app.listen("8080", () => {
  console.log("App is running on port 8080");
});
