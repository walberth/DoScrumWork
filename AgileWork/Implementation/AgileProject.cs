namespace AgileWork.Implementation 
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Threading.Tasks;

    using Firebase.Database;
    using Firebase.Database.Query;

    using Interface;

    using Models;

    using Utils;

    public class AgileProject : IAgileProject
    {
        public async Task<Response<Project>> CreateProjectAsync(Project project)
        {
            var response = new Response<Project>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var createProject = await firebase.Child(Constant.Project).PostAsync(project);

                project.Uid = createProject.Key;

                if (createProject.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudeCrearProyecto}";

                    return response;
                }

                await firebase.Child(Constant.Project).Child(createProject.Key).PutAsync(project);

                foreach (var userStorey in project.UserStories)
                {
                    userStorey.IdProject = project.Uid;
                    var createUserStory = await firebase.Child(Constant.UserStory).PostAsync(userStorey);

                    userStorey.Uid = createUserStory.Key;
                    await firebase.Child(Constant.UserStory).Child(createUserStory.Key).PutAsync(userStorey);
                }

                response.IsSuccess = true;
                response.Data = null;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<List<Project>>> ListAllProjectAsync(string idUserCreated)
        {
            var response = new Response<List<Project>>();

            try 
            {
                var projects = new List<Project>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseProjectList = await firebase.Child(Constant.Project).OrderByKey().OnceAsync<Project>();

                foreach (var project in firebaseProjectList) 
                {
                    if (project.Object.IdUserCreated == idUserCreated) 
                    {
                        var firebaseProject = new Project
                        {
                            Uid = project.Object.Uid,
                            Name = project.Object.Name
                        };

                        projects.Add(firebaseProject);
                    }
                }

                response.IsSuccess = true;
                response.Data = projects;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<Sprint>> CreateSprintAsync(Sprint sprint)
        {
            var response = new Response<Sprint>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var createSprint = await firebase.Child(Constant.Sprint).PostAsync(sprint);

                sprint.Uid = createSprint.Key;

                if (createSprint.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudoCrearElSprint}";

                    return response;
                }

                await firebase.Child(Constant.Sprint).Child(createSprint.Key).PutAsync(sprint);

                response.IsSuccess = true;
                response.Data = sprint;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<List<Sprint>>> GetAllSprintAsync(string idProject)
        {
            var response = new Response<List<Sprint>>();

            try 
            {
                var listSprint = new List<Sprint>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseSprint = await firebase.Child(Constant.Sprint).OrderByKey().OnceAsync<Sprint>();

                foreach (var sprint in firebaseSprint) 
                {
                    if (sprint.Object.IdProject == idProject)
                    {
                        var sprintObject = new Sprint
                        {
                            Uid = sprint.Object.Uid,
                            Name = sprint.Object.Name,
                            IdProject = sprint.Object.IdProject,
                            Stories = sprint.Object.Stories,
                            Tasks = sprint.Object.Tasks
                        };

                        listSprint.Add(sprintObject);
                    }
                }

                response.IsSuccess = true;
                response.Data = listSprint;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<Project>> GetAllProjectInformationAsync(string idProject)
        {
            var response = new Response<Project>();

            try 
            {
                var firebaseProject = new Project();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseProjectList = await firebase.Child(Constant.Project).OrderByKey().OnceAsync<Project>();

                foreach (var project in firebaseProjectList) 
                {
                    if (project.Object.Uid == idProject) 
                    {
                        // Informacion del proyecto
                        firebaseProject.Name = project.Object.Name;
                        firebaseProject.Description = project.Object.Description;
                        firebaseProject.StartDate = project.Object.StartDate;
                        firebaseProject.EndDate = project.Object.EndDate;

                        // Informacion de las historias de usuario del proyecto
                        var firebaseUserStory = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();
                        var listUserStory = new List<UserStories>();
                        var listSprint = new List<Sprint>();

                        foreach (var userStory in firebaseUserStory) 
                        {
                            if (userStory.Object.IdProject == idProject) 
                            {
                                var userStories = new UserStories
                                {
                                    Uid = userStory.Object.Uid,
                                    Name = userStory.Object.Name,
                                    IdUserResponsable = userStory.Object.IdUserResponsable,
                                    UserResponsable = userStory.Object.UserResponsable
                                };

                                listUserStory.Add(userStories);
                            }
                        }

                        firebaseProject.UserStories = listUserStory;

                        // Informacion de los Sprint del proyecto
                        var firebaseSprint = await firebase.Child(Constant.Sprint).OrderByKey().OnceAsync<Sprint>();

                        foreach (var sprint in firebaseSprint) 
                        {
                            if (sprint.Object.IdProject == idProject) 
                            {
                                var sprintObject = new Sprint
                                {
                                    Uid = sprint.Object.Uid,
                                    Name = sprint.Object.Name,
                                };

                                listSprint.Add(sprintObject);
                            }
                        }

                        firebaseProject.Sprints = listSprint;
                    }
                }

                response.IsSuccess = true;
                response.Data = firebaseProject;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<Project>> GetHistoriesAndSprintProjectAsync(string idProject) {
            var response = new Response<Project>();

            try 
            {
                var firebaseProject = new Project();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                
                // Informacion de las historias de usuario del proyecto
                var firebaseUserStory = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();
                var listUserStory = new List<UserStories>();
                var listSprint = new List<Sprint>();

                firebaseProject.Uid = idProject;

                foreach (var userStory in firebaseUserStory) 
                {
                    if (userStory.Object.IdProject == idProject) 
                    {
                        var userStories = new UserStories {
                            Uid = userStory.Object.Uid,
                            Name = userStory.Object.Name,
                            IdProject = userStory.Object.IdProject,
                            Description = userStory.Object.Description,
                            IdUserResponsable = userStory.Object.IdUserResponsable,
                            UserResponsable = userStory.Object.UserResponsable,
                            Effort = userStory.Object.Effort,
                            Priority = userStory.Object.Priority,
                            AcceptanceCriteria = userStory.Object.AcceptanceCriteria,
                            IdSprint = userStory.Object.IdSprint,
                            State = userStory.Object.State
                        };

                        listUserStory.Add(userStories);
                    }
                }

                firebaseProject.UserStories = listUserStory;

                // Informacion de los Sprint del proyecto
                var firebaseSprint = await firebase.Child(Constant.Sprint).OrderByKey().OnceAsync<Sprint>();

                foreach (var sprint in firebaseSprint) 
                {
                    if (sprint.Object.IdProject == idProject) 
                    {
                        var sprintObject = new Sprint {
                            Uid = sprint.Object.Uid,
                            Name = sprint.Object.Name,
                        };

                        listSprint.Add(sprintObject);
                    }
                }

                firebaseProject.Sprints = listSprint;

                response.IsSuccess = true;
                response.Data = firebaseProject;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<Sprint>> GetAllSprintInformationAsync(string idProject, string idSprint) {
            var response = new Response<Sprint>();

            try 
            {
                var sprintInfo = new Sprint();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);

                // Informacion de los Sprint del proyecto
                var firebaseSprint = await firebase.Child(Constant.Sprint).OrderByKey().OnceAsync<Sprint>();

                foreach (var sprint in firebaseSprint) 
                {
                    if (sprint.Object.IdProject == idProject) 
                    {
                        sprintInfo.Uid = sprint.Object.Uid;
                        sprintInfo.Name = sprint.Object.Name;
                        sprintInfo.IdProject = sprint.Object.IdProject;
                    }
                }

                // Informacion de las historias de usuario del proyecto
                var userStoriesList = new List<UserStories>();
                var tasksList = new List<UserTask>();
                var firebaseStories = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();

                foreach (var stories in firebaseStories) 
                {
                    if (stories.Object.IdSprint == idSprint) 
                    {
                        var userStories = new UserStories {
                            Uid = stories.Object.Uid,
                            Name = stories.Object.Name,
                            IdProject = stories.Object.IdProject,
                            Description = stories.Object.Description,
                            IdUserResponsable = stories.Object.IdUserResponsable,
                            UserResponsable = stories.Object.UserResponsable,
                            Effort = stories.Object.Effort,
                            Priority = stories.Object.Priority,
                            AcceptanceCriteria = stories.Object.AcceptanceCriteria,
                            IdSprint = stories.Object.IdSprint,
                            State = stories.Object.State,
                        };

                        // Informacion de las tareas asociadas a la historial de usuarios
                        var firebaseTask = await firebase.Child(Constant.Task).OrderByKey().OnceAsync<UserTask>();

                        foreach (var tasks in firebaseTask) 
                        {
                            if (tasks.Object.IdUserHistories == stories.Object.Uid) 
                            {
                                var taskFinded = new UserTask {
                                    Uid = tasks.Object.Uid,
                                    Name = tasks.Object.Name,
                                    IdUserHistories = tasks.Object.IdUserHistories,
                                    State = tasks.Object.State,
                                };

                                tasksList.Add(taskFinded);
                            }
                        }

                        userStoriesList.Add(userStories);
                    }
                }

                sprintInfo.Stories = userStoriesList;
                sprintInfo.Tasks = tasksList;

                response.IsSuccess = true;
                response.Data = sprintInfo;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<List<Project>>> GetAllProjectsAsync() {
            var response = new Response<List<Project>>();

            try 
            {
                var firebaseProjects = new List<Project>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseProjectList = await firebase.Child(Constant.Project).OrderByKey().OnceAsync<Project>();

                foreach (var project in firebaseProjectList) 
                {
                    var firebaseProject = new Project();
                    // Informacion del proyecto
                    firebaseProject.Uid = project.Object.Uid;
                    firebaseProject.Name = project.Object.Name;
                    firebaseProject.UserCreatedEmail = project.Object.UserCreatedEmail;
                    firebaseProject.Description = project.Object.Description;
                    firebaseProject.StartDate = project.Object.StartDate;
                    firebaseProject.EndDate = project.Object.EndDate;

                    // Informacion de las historias de usuario del proyecto
                    var firebaseUserStory = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();
                    var listUserStory = new List<UserStories>();

                    foreach (var userStory in firebaseUserStory) 
                    {
                        if (userStory.Object.IdProject == project.Object.Uid) 
                        {
                            var userStories = new UserStories
                            {
                                Uid = userStory.Object.Uid,
                                Name = userStory.Object.Name,
                                IdProject = userStory.Object.IdProject,
                                Description = userStory.Object.Description,
                                IdUserResponsable = userStory.Object.IdUserResponsable,
                                UserResponsable = userStory.Object.UserResponsable,
                                Effort = userStory.Object.Effort,
                                Priority = userStory.Object.Priority,
                                AcceptanceCriteria = userStory.Object.AcceptanceCriteria,
                                IdSprint = userStory.Object.IdSprint,
                                State = userStory.Object.State
                            };

                            //Informacion de las tareas
                            var firebaseTaskList = await firebase.Child(Constant.Task).OrderByKey().OnceAsync<UserTask>();
                            var firebaseTasks = new List<UserTask>();

                            foreach (var task in firebaseTaskList) 
                            {
                                if (task.Object.IdUserHistories == userStory.Object.Uid) 
                                {
                                    var firebaseTask = new UserTask {
                                        Uid = task.Object.Uid,
                                        Name = task.Object.Name,
                                        IdUserHistories = task.Object.IdUserHistories,
                                        State = task.Object.State
                                    };

                                    firebaseTasks.Add(firebaseTask);
                                }
                            }

                            userStories.Tasks = firebaseTasks;

                            listUserStory.Add(userStories);
                        }
                    }

                    firebaseProject.UserStories = listUserStory;
                    
                    // Informacion de los Sprint del proyecto
                    var firebaseSprint = await firebase.Child(Constant.Sprint).OrderByKey().OnceAsync<Sprint>();
                    var listSprint = new List<Sprint>();

                    foreach (var sprint in firebaseSprint) 
                    {
                        if (sprint.Object.IdProject == project.Object.Uid) 
                        {
                            var sprintObject = new Sprint
                            {
                                Uid = sprint.Object.Uid,
                                Name = sprint.Object.Name,
                            };

                            listSprint.Add(sprintObject);
                        }
                    }

                    firebaseProject.Sprints = listSprint;

                    firebaseProjects.Add(firebaseProject);
                }

                response.IsSuccess = true;
                response.Data = firebaseProjects;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }
    }
}
