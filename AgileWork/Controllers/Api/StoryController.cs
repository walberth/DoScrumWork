using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models;

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

        [Route("api/createUserHistoryAsync/{userStories}")]
        public async Task<IHttpActionResult> CreateUserHistory(UserStories userStories) 
        {
            var response = await _userStory.CreateUserHistoryAsync(userStories);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
