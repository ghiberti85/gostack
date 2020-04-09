const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next(); // Habilita o próximo Middlewares/Requisições
                // Sem o comando, interrompe as próximas requisições
}

function validateRepositoryId(request, response, next) {
 const { id } = request.params;

 if(!isUuid(id)) {
   return response.status(400).json({ error: 'Invalid Repository ID.'});
 }
 return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateRepositoryId);
app.use('/repositories/:id/like', validateRepositoryId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
  ? repositories.filter(project => repository.title.includes(title))
  : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;


  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if ( repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }
  if (request.body.likes) return response.json({ likes: repositories[repositoryIndex].likes });


  const repository = { 
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], ...repository };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if ( repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if ( repositoryIndex < 0 ) {
    return response.status(400).json({ error: 'Repository not found!' });
   
  }
  const likes = repositories[repositoryIndex].likes + 1;

  repositories[repositoryIndex] = { 
  ...repositories[repositoryIndex],
  likes,
};
  return response.json({ likes });

});

module.exports = app;
