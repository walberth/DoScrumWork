using System.Collections.Generic;
using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface IUserProject 
    {
        Task<Response<UserResponsable>> CreateUserResponsableAsync(UserResponsable user);

        Task<Response<List<UserResponsable>>> GetAllUserResponsableAsync();
    }
}
