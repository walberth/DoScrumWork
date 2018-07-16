using System;
using System.Configuration;
using System.Threading.Tasks;
using AgileWork.Interface;
using AgileWork.Models;
using AgileWork.Utils;
using Firebase.Database;
using Firebase.Database.Query;

namespace AgileWork.Implementation 
{
    public class TaskProject : ITaskProject
    {
        public async Task<Response<UserTask>> CreateTaskAsync(UserTask userTask) {
            var response = new Response<UserTask>();

            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var createTask = await firebase.Child(Constant.Task).PostAsync(userTask);

                userTask.Uid = createTask.Key;
                userTask.State = Constant.InitialTaskState;

                if (createTask.Key == null) 
                {
                    response.IsSuccess = false;
                    response.Message = $"{Messages.NoSePudoCrearLaTarea}";

                    return response;
                }

                await firebase.Child(Constant.Task).Child(createTask.Key).PutAsync(userTask);

                response.IsSuccess = true;
                response.Data = userTask;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }

        public async Task<Response<UserTask>> UpdateTaskAsync(string idTask, string state) {
            var response = new Response<UserTask>();

            try 
            {
                var firebase = new FirebaseClient(ConfigurationManager.AppSettings[Constant.Url]);
                var firebaseTaskList = await firebase.Child(Constant.Task).OrderByKey().OnceAsync<UserTask>();
                var firebaseTask = new UserTask();

                foreach (var task in firebaseTaskList) 
                {
                    if (task.Object.Uid == idTask) {
                        firebaseTask.Uid = idTask;
                        firebaseTask.Name = task.Object.Name;
                        firebaseTask.IdUserHistories = task.Object.IdUserHistories;
                        firebaseTask.State = state;

                        await firebase.Child(Constant.Task).Child(task.Object.Uid).PutAsync(firebaseTask);
                    }
                }

                response.IsSuccess = true;
                response.Data = firebaseTask;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"{ex.Message}";
            }
            
            return response;
        }
    }
}