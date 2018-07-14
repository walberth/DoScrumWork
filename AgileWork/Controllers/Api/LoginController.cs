using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models.Consume;
using Firebase.Auth;
using Firebase.Database;
using Firebase.Database.Query;

namespace AgileWork.Controllers.Api
{
    public class LoginController : ApiController
    {
        private readonly ILoginFirebase _loginFirebase;

        public LoginController()
        {
        }

        public LoginController(ILoginFirebase loginFirebase)
        {
            _loginFirebase = loginFirebase;
        }

        //[Route("api/loginValidate/{credentials}")]
        public async Task<IHttpActionResult> FirebaseLoginAsync(UserCredentials credentials)
        {
            var response = await _loginFirebase.GetFirebaseLogin(credentials.Email, credentials.Password);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
