using Services.Utils;

namespace Services.Controllers
{
    using System;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Firebase.Database;
    using Firebase.Auth;

    using Models;
    using Firebase.Database.Query;

    public class LoginController : ApiController
    {
        [Route("api/loginValidate/{credentials}")]
        public async Task<IHttpActionResult> FirebaseLoginAsync(UserCredentials credentials)
        {
            var response = new Response<string>();

            try
            {
                var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyBOd-nsvRz_PLSvzFRfAdLbIkGkDltwIRc"));
                var auth = await authProvider.SignInWithEmailAndPasswordAsync(credentials.Email, credentials.Password);
                
                var firebase = new FirebaseClient("https://consumefirebase.firebaseio.com/");

                var dino = await firebase
                    .Child("dinosaurs")
                    .PostAsync(new Dinosaur {
                        Name = "hola",
                        Raza = "de prueba"
                    });

                if (auth.User.LocalId == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSeEncontroUsuario}";

                    return Ok(response);
                }

                response.IsSuccess = true;
                response.Data = auth.User.LocalId;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }

            return Ok(response);
        }

        public class Dinosaur {
            public Dinosaur() {
                
            }

            public string Name { get; set; }
            public string Raza { get; set; }
        }
    }
}
