using System.Collections.Generic;
using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface IAgileProject 
    {
        Task<Response<Project>> CreateProjectAsync(Project project);

        Task<Response<List<Project>>> ListAllProjectAsync(string idUserCreated);

        Task<Response<Sprint>> CreateSprintAsync(Sprint sprint);

        Task<Response<Project>> GetAllProjectInformationAsync(string idProject);
    }
}
