using System.Threading.Tasks;
using System.Web.Http;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Models.Consume;

namespace AgileWork.Controllers.Api
{
    public class TaskController : ApiController
    {
        private readonly ITaskProject _task;

        public TaskController()
        {
        }

        public TaskController(ITaskProject task)
        {
            _task = task;
        }

        [HttpPost]
        [Route("api/createTaskAsync/{project}")]
        public async Task<IHttpActionResult> CreateTaskAsync(UserTask userTask)
        {
            var response = await _task.CreateTaskAsync(userTask);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }

        [HttpPost]
        [Route("api/updateTaskAsync/{updateTask}")]
        public async Task<IHttpActionResult> UpdateTaskAsync(UpdateTask updateTask)
        {
            var response = await _task.UpdateTaskAsync(updateTask.IdTask, updateTask.State);

            if (response.IsSuccess)
                return Ok(response);
               
            return BadRequest(response.Message);
        }
    }
}
