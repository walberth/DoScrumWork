using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Models.Consume;

namespace AgileWork.Controllers.Api
{
    public class ProjectController : ApiController
    {
        private readonly IAgileProject _agileProject;

        public ProjectController()
        {
        }

        public ProjectController(IAgileProject agileProject)
        {
            _agileProject = agileProject;
        }

        //[Route("api/loginValidate/{credentials}")]
        public async Task<IHttpActionResult> CreateProjectAsync(Project project)
        {
            var response = await _agileProject.CreateProject(project);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [Route("api/listAllProjectAsync/{idUser}")]
        public async Task<IHttpActionResult> ListAllProjectAsync(UserCredentials idUser) 
        {
            var response = await _agileProject.ListAllProject(idUser.Uid);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
