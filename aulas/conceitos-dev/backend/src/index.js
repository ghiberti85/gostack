const express = require ('express');
const { uuid, isUuid } = require('uuidv4'); //lib para criação do ID - Universal Unique ID 

const app = express();

app.use(express.json()); //Precisa vir ANTES das rotas.

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 * 
 * OBS:PUT PARA ALTERAR TUDO E PATCH PARA ALTERAÇÃO ESPECÍFICA
 */

/**
 * Parâmetros:
 * Formas do Cliente/Usuário enviar uma informação
 * 
 * Tipos de Parâmetros:
 * Query Params: PRINCIPALMENTE para filtros e  e paginação (listagem)
 * Routes Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo da requisição para criar ou editar um recurso (JSON)
 */

 /**
  * Middleware: Interceptador de Requisições
  * Pode interromper totalmente a requisição ou alterar dados da requisição.
  * 
  * As rotas da aplicação são consideradas Middlewares porque interceptam a 
  * requisição, obtém os dados dela e pode interromper e levar um dado de volta 
  * para o cliente/usuário.
  * 
  * Os Middlewares serão usados quando queremos acionar trechos de código em uma
  * ou mais rotas da minha aplicação.
  */

 const projects = []; //(NUNCA USAR EM PRODUÇÃO | APENAS NO AMBIENTE DEV)

 function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next(); // Habilita o próximo Middlewares/Requisições
                  // Sem o comando, interrompe as próximas requisições
 }

 function validadeProjectId(request, response, next) {
   const { id } = request.params;

   if(!isUuid(id)) {
     return response.status(400).json({ error: 'Invalid project ID.'});
   }
   return next();
 }

app.use(logRequests);
app.use('/projects/:id', validadeProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);


  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
const { id } = request.params;
const { title, owner } = request.body;


const projectIndex = projects.findIndex(project => project.id === id);

if ( projectIndex < 0) {
  return response.status(400).json({ error: 'Project not found!' })
}

const project = { 
  id,
  title,
  owner,
};

projects[projectIndex] = project;

return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if ( projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found!' })
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();

});

app.listen(3333, () => {
  console.log(' 🚀 Back-end started!');
});