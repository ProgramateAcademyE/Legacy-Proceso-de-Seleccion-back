# Backend

Se hace conexión con mongoDB con la librería mongoose, se instala como dependencia para así hacer consultas hacia mongoDB. Se hace un llamado a Mongoose y a las variables de entorno en donde se encuentra almacenado los links para la conexión con la base de datos de  MongoDB.

## Dependencias
- **convert-array-to-csv:** se utilizó para descargar las tablas en formato csv.
- **cors:** se utilizó para obtener permisos para acceder a recursos
seleccionados desde un servidor, en un origen distinto al dominio que
pertenece.
-  **cross-env:** se utilizó para que se pueda tener un solo comando sin
preocuparse por configurar o usar la variable de entorno correctamente
para la plataforma.
-  **dotenv:** se utilizó para poder utilizar variables de entorno en el proyecto.
- **express:** se utilizó para crear el servidor y poder crear la API.
-  **nodemailer:** se utiliza para recibir mensajes de un formulario de contacto
o enviar correos de confirmación.
-  **request:** se utilizó para realizar llamadas http a la API de sololearn
-  **googleapis:** biblioteca cliente para utilizar las API de Google. Se incluye
soporte para autorización y autenticación con OAuth 2.0, claves API y
tokens JWT.
-  **morgan:** middleware del registrador de solicitudes HTTP
- **nodemon:** se utiliza para reiniciar automáticamente la aplicación de nodo
cuando se detectan cambios.
- **mongoose:** se utiliza para hacer modelados de objetos de MongoDB.
- **multer:** se utiliza para la carga de archivos.
- **bcrypt:** se utilizó para encriptar las contraseñas.
- **jsonwebtoken:** permite el intercambio seguro de datos entre dos partes que se envían en formato json.
- **mime-types:** se utiliza para especificar que tipo de documento es.
- **node-fetch:** se utiliza para acceder y manipular partes del canal HTTP, tales comopeticiones y respuestas.

## Pruebas en postman
### Algunas vistas en Postman
#### Vista administrador:

- Citación de candidatos(Obtener todos los candidatos):

        adminRouter.get('/citation', async (req, res) => {
            const results = await Citation.find();
            res.send(results)
        });

  ![](https://i.ibb.co/1ZH5mBV/admin-citation.png)

- Convocatorias:

            adminRouter.get("/convocatories", async (req, res) => {
                const results = await Convocatory.find();
                res.send(results);
            });

     ![](https://i.ibb.co/XXWM6Sf/convocatorias-Admin.png)

#### Vista candidato:
- Calificación prueba (SoloLearn) del candidato :

        candidateRouter.get('/calification', async (req, res) => {
                const calification = await Result.find()
                res.send(calification)
        })
![](https://i.ibb.co/M9WQ79z/postman.png)

