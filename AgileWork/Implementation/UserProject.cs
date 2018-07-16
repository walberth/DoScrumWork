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
    public class UserProject : IUserProject 
    {
        public async Task<Response<UserResponsable>> CreateUserResponsableAsync(UserResponsable user) 
        {
            var response = new Response<UserResponsable>();
            
            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var createUserResponsable = await firebase.Child(Constant.UserResponsable).PostAsync(user);

                user.Uid = createUserResponsable.Key;

                if (createUserResponsable.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudeCrearProyecto}";

                    return response;
                }

                await firebase.Child(Constant.UserResponsable).Child(createUserResponsable.Key).PutAsync(user);

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

        public async Task<Response<List<UserResponsable>>> GetAllUserResponsableAsync() {
            var response = new Response<List<UserResponsable>>();

            try 
            {
                var usersResponsable = new List<UserResponsable>();
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseUserResponsable = await firebase.Child(Constant.UserResponsable).OrderByKey().OnceAsync<UserResponsable>();

                if (firebaseUserResponsable.Count == 0) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSeEncontroNingunUsuario}";

                    return response;
                }

                foreach (var firebaseUser in firebaseUserResponsable) 
                {
                    var user = new UserResponsable {
                        Uid = firebaseUser.Object.Uid,
                        Name = firebaseUser.Object.Name
                    };

                    usersResponsable.Add(user);
                }

                response.IsSuccess = true;
                response.Data = usersResponsable;
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