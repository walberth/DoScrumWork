using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Models.Consume;

namespace AgileWork.Controllers.Api
{
    public class StoryController : ApiController
    {
        private readonly IUserStory _userStory;

        public StoryController()
        {
        }

        public StoryController(IUserStory userStory)
        {
            _userStory = userStory;
        }

        [HttpPost]
        [Route("api/createUserHistoryAsync/{userStories}")]
        public async Task<IHttpActionResult> CreateUserHistory(UserStories userStories) 
        {
            var response = await _userStory.CreateUserHistoryAsync(userStories);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("api/getAllUserHistoryAsync/{projectId}")]
        public async Task<IHttpActionResult> GetAllUserHistoryAsync(IdProject projectId) 
        {
            var response = await _userStory.GetAllUserHistoryAsync(projectId.ProjectId);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("api/setUserStoriesToSprintAsync/{linkSprint}")]
        public async Task<IHttpActionResult> SetUserStoriesToSprintAsync(LinkSprint linkSprint) 
        {
            var response = await _userStory.SetUserStoriesToSprintAsync(linkSprint.IdUserStory, linkSprint.IdSprint);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("api/getUserStorieAsync/{idUserStory}")]
        public async Task<IHttpActionResult> GetUserStorieAsync(IdUserStory idUserStory)
        {
            var response = await _userStory.GetUserStorieAsync(idUserStory.IdUserStorie);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
