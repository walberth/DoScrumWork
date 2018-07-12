using System;
using System.Threading.Tasks;
using System.Web.Http;
using DoScrumWork.Models;
using Firebase.Auth;

namespace DoScrumWork.Controllers
{
    public class LoginController : ApiController
    {
        [Route("api/loginValidate/{credentials}")]
        public async Task<IHttpActionResult> FirebaseLoginAsync(UserCredentials credentials) {
            try {
                var authProvider = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyBOd-nsvRz_PLSvzFRfAdLbIkGkDltwIRc"));
                var auth = await authProvider.SignInWithEmailAndPasswordAsync(credentials.Email, credentials.Password);
                
                return Ok(auth.User.LocalId);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
            
            return NotFound();
        }
    }
}
