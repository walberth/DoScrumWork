using System;
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
    }
}