using System;
using System.Configuration;
using System.Threading.Tasks;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Utils;
using Firebase.Auth;

namespace AgileWork.Implementation 
{
    public class LoginFirebase : ILoginFirebase 
    {
        public async Task<Response<UserFirebase>> GetFirebaseLogin(string email, string password) 
        {
            var response = new Response<UserFirebase>();

            try 
            {
                var authProvider = new FirebaseAuthProvider(new FirebaseConfig(ConfigurationManager.AppSettings["FirebaseToken"]));
                var user = await authProvider.SignInWithEmailAndPasswordAsync(email, password);

                var userFirebase = new UserFirebase {
                    Uid = user.User.LocalId,
                    Email = user.User.Email
                };

                if (userFirebase.Uid == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSeEncontroUsuario}";

                    return response;
                }
            
                response.IsSuccess = true;
                response.Data = userFirebase;
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