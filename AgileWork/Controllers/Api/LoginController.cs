using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Models;
using AgileWork.Models.Consume;
using AgileWork.Utils;
using Firebase.Auth;
using Firebase.Database;
using Firebase.Database.Query;

namespace AgileWork.Controllers.Api
{
    public class LoginController : ApiController
    {
        //[Route("api/loginValidate/{credentials}")]
        public async Task<IHttpActionResult> FirebaseLoginAsync(UserCredentials credentials)
        {
            var response = new Response<UserFirebase>();

            try {
                var hola = ConfigurationManager.AppSettings["FirebaseToken"];
                var authProvider = new FirebaseAuthProvider(new FirebaseConfig(ConfigurationManager.AppSettings["FirebaseToken"]));
                var user = await authProvider.SignInWithEmailAndPasswordAsync(credentials.Email, credentials.Password);

                var userFirebase = new UserFirebase {
                    Uid = user.User.LocalId,
                    Email = user.User.Email
                };

                //var firebase = new FirebaseClient("https://consumefirebase.firebaseio.com/");
                
                if (userFirebase.Uid == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSeEncontroUsuario}";

                    return Ok(response);
                }


                response.IsSuccess = true;
                response.Data = userFirebase;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }

            return Ok(response);
        }
    }
}
