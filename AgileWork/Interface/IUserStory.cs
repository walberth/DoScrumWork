using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface IUserStory 
    {
        Task<Response<UserStories>> CreateUserHistoryAsync(UserStories userStory);
    }
}
