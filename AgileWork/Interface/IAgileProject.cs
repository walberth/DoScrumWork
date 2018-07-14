using System.Collections.Generic;
using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface IAgileProject 
    {
        Task<Response<Project>> CreateProject(Project project);

        Task<Response<List<Project>>> ListAllProject(string idUserCreated);
    }
}
