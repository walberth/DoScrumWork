using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Utils;
using Firebase.Database;
using Firebase.Database.Query;

namespace AgileWork.Implementation 
{
    public class AgileProject : IAgileProject
    {
        public async Task<Response<Project>> CreateProject(Project project) {
            var response = new Response<Project>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings["FirebaseUrl"]);
                var createProject = await firebase.Child("project").PostAsync(project);

                project.Uid = createProject.Key;

                if (createProject.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudeCrearProyecto}";

                    return response;
                }

                await firebase.Child("project").Child(createProject.Key).PutAsync(project);

                foreach (var userStorey in project.UserStories) {
                    userStorey.IdProject = project.Uid;
                    var createUserStory = await firebase.Child("userStory").PostAsync(userStorey);

                    userStorey.Uid = createUserStory.Key;
                    await firebase.Child("userStory").Child(createUserStory.Key).PutAsync(userStorey);
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

        public async Task<Response<List<Project>>> ListAllProject(string idUserCreated) {
            var response = new Response<List<Project>>();

            try {
                var projects = new List<Project>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings["FirebaseUrl"]);
                var firebaseProjectList = await firebase.Child("project").OrderByKey().OnceAsync<Project>();

                foreach (var project in firebaseProjectList) 
                {
                    if (project.Object.IdUserCreated == idUserCreated) 
                    {
                        var firebaseProject = new Project {
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
    }
}
