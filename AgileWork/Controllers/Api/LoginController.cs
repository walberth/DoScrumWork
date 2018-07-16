using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models.Consume;

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

        [HttpPost]
        [Route("api/getFirebaseLoginAsync/{credentials}")]
        public async Task<IHttpActionResult> GetFirebaseLoginAsync(UserCredentials credentials)
        {
            var response = await _loginFirebase.GetFirebaseLoginAsync(credentials.Email, credentials.Password);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
