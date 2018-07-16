using System.Threading.Tasks;
using AgileWork.Models;
using AgileWork.Utils;

namespace AgileWork.Interface 
{
    public interface ILoginFirebase 
    {
        Task<Response<UserFirebase>> GetFirebaseLoginAsync(string email, string password);
    }
}
