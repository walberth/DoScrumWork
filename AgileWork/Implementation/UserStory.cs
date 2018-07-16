using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Utils;
using Firebase.Database;
using Firebase.Database.Query;

namespace AgileWork.Implementation {
    public class UserStory : IUserStory 
    {
        public async Task<Response<UserStories>> CreateUserHistoryAsync(UserStories userStories) 
        {
            var response = new Response<UserStories>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var createUserStory = await firebase.Child(Constant.UserStory).PostAsync(userStories);

                userStories.Uid = createUserStory.Key;

                if (createUserStory.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudoCrearLaHistoriadeUsuario}";

                    return response;
                }

                await firebase.Child(Constant.UserStory).Child(createUserStory.Key).PutAsync(userStories);

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

        public async Task<Response<List<UserStories>>> GetAllUserHistoryAsync(string idProject) {
            var response = new Response<List<UserStories>>();
            
            try 
            {
                var listUserStory = new List<UserStories>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);

                // Informacion de las historias de usuario del proyecto
                var firebaseUserStory = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();

                foreach (var userStory in firebaseUserStory) 
                {
                    if (userStory.Object.IdProject == idProject) 
                    {
                        var userStories = new UserStories {
                            Uid = userStory.Object.Uid,
                            Name = userStory.Object.Name,
                            IdUserResponsable = userStory.Object.IdUserResponsable,
                            UserResponsable = userStory.Object.UserResponsable
                        };

                        listUserStory.Add(userStories);
                    }
                }
                
                response.IsSuccess = true;
                response.Data = listUserStory;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<UserStories>> SetUserStoriesToSprintAsync(string idUserStory, string idSprint) {
            var response = new Response<UserStories>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseUserStory = await firebase.Child(Constant.UserStory).OrderByKey().OnceAsync<UserStories>();

                foreach (var userStory in firebaseUserStory) 
                {
                    if (userStory.Object.Uid == idUserStory) 
                    {
                        var userStories = new UserStories {
                            Uid = userStory.Object.Uid,
                            Name = userStory.Object.Name,
                            IdProject = userStory.Object.IdProject,
                            Description = userStory.Object.Description,
                            UserResponsable = userStory.Object.UserResponsable,
                            Effort = userStory.Object.Effort,
                            Priority = userStory.Object.Priority,
                            AcceptanceCriteria = userStory.Object.AcceptanceCriteria,
                            IdSprint = idSprint,
                            State = userStory.Object.State
                        };

                        await firebase.Child(Constant.UserStory).Child(idUserStory).PutAsync(userStories);

                        response.IsSuccess = true;
                        response.Data = userStories;
                    }
                }
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