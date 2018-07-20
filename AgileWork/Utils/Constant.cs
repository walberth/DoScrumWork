namespace AgileWork.Utils 
{
    public class Constant {
        public const string Url = "FirebaseUrl";
        public const string Token = "FirebaseToken";
        public const string Project = "project";
        public const string UserStory = "userStory";
        public const string UserResponsable = "userResponsable";
        public const string Sprint = "sprint";
        public const string Task = "task";

        #region Task State
        public const string InitialTaskState = "New";
        #endregion

        #region Web Services APIs
        public const string GetFirebaseLoginAsync = "http://agileworkutp.azurewebsites.net/api/getFirebaseLoginAsync/{credentials}";
        public const string CreateProjectAsync = "http://agileworkutp.azurewebsites.net/api/createProjectAsync/{project}";
        public const string ListAllProjectAsync = "http://agileworkutp.azurewebsites.net/api/listAllProjectAsync/{idUser}";
        public const string CreateUserResponsableAsync = "http://agileworkutp.azurewebsites.net/api/createUserResponsableAsync/{userResponsable}";
        public const string GetAllUserResponsableAsync = "http://agileworkutp.azurewebsites.net/api/getAllUserResponsableAsync"; // GET
        public const string CreateUserHistoryAsync = "http://agileworkutp.azurewebsites.net/api/createUserHistoryAsync/{userStories}";
        public const string CreateSprintAsync = "http://agileworkutp.azurewebsites.net/api/createSprintAsync/{sprint}";
        public const string GetAllProjectInformationAsync = "http://agileworkutp.azurewebsites.net/api/getAllProjectInformationAsync/{projectId}";
        public const string CreateTaskAsync = "http://agileworkutp.azurewebsites.net/api/createTaskAsync/{project}";
        public const string UpdateTaskAsync = "http://agileworkutp.azurewebsites.net/api/updateTaskAsync/{updateTask}";
        public const string GetHistoriesAndSprintProjectAsync = "http://agileworkutp.azurewebsites.net/api/getHistoriesAndSprintProjectAsync/{projectId}";
        public const string GetAllSprintAsync = "http://agileworkutp.azurewebsites.net/api/getAllSprintAsync/{projectId}";
        public const string GetAllUserHistoryAsync = "http://agileworkutp.azurewebsites.net/api/getAllUserHistoryAsync/{projectId}";
        public const string SetUserStoriesToSprintAsync = "http://agileworkutp.azurewebsites.net/api/setUserStoriesToSprintAsync/{linkSprint}";
        public const string GetAllSprintInformationAsync = "http://agileworkutp.azurewebsites.net/api/getAllSprintInformationAsync/{sprintInformation}";
        public const string GetUserStorieAsync = "http://agileworkutp.azurewebsites.net/api/getUserStorieAsync/{idUserStory}";
        #endregion
    }
}