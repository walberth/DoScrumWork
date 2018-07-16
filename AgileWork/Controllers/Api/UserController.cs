using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models;

namespace AgileWork.Controllers.Api
{
    public class UserController : ApiController
    {
        private readonly IUserProject _userProject;

        public UserController()
        {
        }

        public UserController(IUserProject userProject)
        {
            _userProject = userProject;
        }

        [HttpPost]
        [Route("api/createUserResponsableAsync/{userResponsable}")]
        public async Task<IHttpActionResult> CreateUserResponsable(UserResponsable userResponsable) 
        {
            var response = await _userProject.CreateUserResponsableAsync(userResponsable);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [HttpGet]
        [Route("api/getAllUserResponsableAsync")]
        public async Task<IHttpActionResult> GetAllUserResponsable() 
        {
            var response = await _userProject.GetAllUserResponsableAsync();

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
