using System.Collections.Generic;
using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface IUserStory 
    {
        Task<Response<UserStories>> CreateUserHistoryAsync(UserStories userStory);

        Task<Response<List<UserStories>>> GetAllUserHistoryAsync(string idProject);
        
        Task<Response<UserStories>> SetUserStoriesToSprintAsync(string idUserStory, string idSprint);

        Task<Response<UserStories>> GetUserStorieAsync(string idUserStory);
    }
}
