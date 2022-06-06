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

## BACKEND FASE 2


### MIDDLEWARES

Se crearon los siguientes autenticadores para el rol de moderador, observador y entrevistador, nos permiten filtrar y proteger los endpoints o rutas de acuerdo al rol.

Las rutas no se han protegido para facilitar las pruebas postman de los nuevos programadores que hereden el proyecto, abajo un ejemplo de cómo utilizarlas en las rutas.

![middlewares](https://user-images.githubusercontent.com/91229815/172081646-d12650da-706e-428b-ab7b-07e06f60cf91.jpg)


##### Ejemplo: 
Filtrar y proteger ruta, sólo pueden acceder Administrador y Moderador.
![ejemplo_middlewares](https://user-images.githubusercontent.com/91229815/172081678-fcdca32e-6352-4a97-bb13-fd0baa86e461.jpg)


### MODELOS DE BASE DATOS

Colecciones creadas y modificadas para las funcionalidades de la Fase 2
En color Rojo los modelos nuevos que se crearon
En color Azul los modelos existentes pero que fueron modificados.

![Modelos_creados_modificados](https://user-images.githubusercontent.com/91229815/172081722-4a46dd82-a786-4bb0-8e86-8143d03023b6.jpg)

### CITACIONES

Este modelo se creó con el fin de crear las reuniones para las diferentes convocatorias y adicionalmente tiene la función de añadir nuevos entrevistadores y observadores en caso de que los existentes no se encuentren disponibles.

![citations_model](https://user-images.githubusercontent.com/91229815/172081744-dff1f40a-1b6d-47a1-8917-18ccca42d7b1.jpg)

Rutas creadas para el modelo Citation.

Para el modelo citation se creó la siguiente ruta que obtiene el listado de todas las citaciones creadas.
![Get_all_citations](https://user-images.githubusercontent.com/91229815/172081778-686624ec-9a4d-47f1-925e-50f95ce3de59.jpg)

### AVAILABILITY

Este modelo fue creado con el fin de determinar la disponibilidad de los entrevistadores y observadores para las diferentes citaciones y asignar un rol de reunión dentro de las diferentes convocatorias, así mismo evitar que se asigne un rol diferente a la misma persona en la misma fecha.
![model_availability](https://user-images.githubusercontent.com/91229815/172081828-20a1fe43-3e4f-4192-9da1-101f32ff804e.jpg)


Rutas creadas para el modelo Availability.
Para el modelo Availability se creó endpoint que crea un arreglo de entrevistadores y observadores disponibles.
![post_new_availability](https://user-images.githubusercontent.com/91229815/172081872-e346f200-0879-400e-a624-abc59e7aa75a.jpg)

Este endpoint nos regresa los observadores y entrevistadores disponibles para la citación en una fecha determinada.
![finding_availability](https://user-images.githubusercontent.com/91229815/172081890-72ab4283-fce8-4224-9ee0-f7118f3bf4e0.jpg)

Endpoint que modifica los observadores y entrevistadores disponibles para una determinada citación.
![update_staff_availability](https://user-images.githubusercontent.com/91229815/172081913-9eee3952-cb7b-4923-a54c-b3e787c6ea99.jpg)

### MEET

Se creó este modelo con el fin de registrar los datos generados en el momento de la creación de salas para entrevistas y assessments, se realizará una asignación aleatoria del staff disponible para dicho día así como también de los aspirantes citados en cada una de las salas.

![meet_model](https://user-images.githubusercontent.com/91229815/172081947-14398d60-43dd-45b8-918f-07bf27375331.jpg)

Rutas creadas para el modelo Meet.

Este endpoint nos devuelve un listado con todas las reuniones creadas.
![get_all_meets](https://user-images.githubusercontent.com/91229815/172081972-0454e507-b751-4320-b658-24e2ea116db6.jpg)


Este endpoint nos crea una nueva reunión.
![post_new_meet](https://user-images.githubusercontent.com/91229815/172082021-aa722b4f-9590-4f7b-bf82-f94e11a427a4.jpg)


Este endpoint nos devuelve una reunión por id citation.
![get_meet_by_id](https://user-images.githubusercontent.com/91229815/172082120-370c5104-d316-4932-a4e2-11c67da7c746.jpg)


Este endpoint nos devuelve una reunión por meetId
![get_meet_by_meetId](https://user-images.githubusercontent.com/91229815/172082135-709f4853-cde9-47e6-83c8-a578f6e8558f.jpg)


Este endpoint nos devuelve una reunión por ID de usuario.
![find_meet_by_userId](https://user-images.githubusercontent.com/91229815/172082173-81ed3e1f-d186-4c11-8367-470c87e97222.jpg)


### QUESTIONARY

Este modelo fue creado para almacenar los cuestionarios/rúbricas del que harán uso los entrevistadores y observadores para calificar a los aplicantes. 
![model_quetionary](https://user-images.githubusercontent.com/91229815/172082190-8be94b1a-36cc-4af1-8a6a-02cb79db20bb.jpg)


Rutas creadas para el modelo Questionary.

Este endpoint me devuelve un listado de los cuestionarios con el que el entrevistador y el observador van a calificar. 
![get_questionarys](https://user-images.githubusercontent.com/91229815/172082206-3d7d566d-6af9-476e-9391-b369cb1dd6f7.jpg)


### INTERVIEWDAY
Este modelo fue creado para almacenar el promedio final de  cada uno de los estudiantes evaluados en la entrevista y en la reunión de assessment, así como también toda la información de la reunión y del staff asignado.
![model_interviewDay](https://user-images.githubusercontent.com/91229815/172082243-a8c4128b-6f9e-49c2-89be-a593250231c1.jpg)


Este es el modelo al cual se le deben hacer las peticiones necesarias para llevar los datos a la landing del admin
Rutas creadas para el modelo Interview Day.
Este endpoint guarda las calificaciones del observador.
![saves_qualifications_by_the observer](https://user-images.githubusercontent.com/91229815/172082317-b4f49104-a3a2-4571-9ef5-120a0d82ef0f.jpg)

Este endpoint guarda las calificaciones del entrevistador.
![save_qualifications_by_interviewer](https://user-images.githubusercontent.com/91229815/172082300-8a3c858b-2f1b-4ea1-974d-5e7ef7b2927f.jpg)

## Despliegue
Link pruebas postman: https://go.postman.co/workspace/My-Workspace~c2d6d132-bf9e-4328-8a66-751e56a0ea2d/collection/20307962-126fb9d3-da5a-4905-9fc7-dec6610ee46d?action=share&creator=20307962

El link despliegue backend dev2: https://legacy-selection-educamas.herokuapp.com

## Colaboradores: 
- Luis Cabal        https://github.com/ElCabal
- Diana Chávez      https://github.com/dianachavezr
- Leandro Gutierrez  https://github.com/leagut
- Carolina Loaiza  https://github.com/carolo180 
- Jymmy Murillo    https://github.com/JymmyMurillo
- Jocelyn Rincón    https://github.com/JocelynRincon
- Doraly Santander  https://github.com/doralysantander

## Formadores: 
- Lorena Guerrero
- Andrés Patiño
- Juliana Fajardo

## Agradecimientos:
- Xiomara Pérez
- Enmanuel Pereira

