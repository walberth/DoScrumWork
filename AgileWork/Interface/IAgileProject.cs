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

        Task<Response<List<Sprint>>> GetAllSprintAsync(string idProject);
        
        Task<Response<Project>> GetAllProjectInformationAsync(string idProject);

        Task<Response<Project>> GetHistoriesAndSprintProjectAsync(string idProject);

        Task<Response<Sprint>> GetAllSprintInformationAsync(string idProject, string idSprint);
    }
}
