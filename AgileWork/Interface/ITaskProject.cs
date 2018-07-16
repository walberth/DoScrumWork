using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface ITaskProject 
    {
        Task<Response<UserTask>> CreateTaskAsync(UserTask userTask);

        Task<Response<UserTask>> UpdateTaskAsync(string idTask, string state);
    }
}
