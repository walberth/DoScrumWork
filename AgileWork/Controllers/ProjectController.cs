namespace AgileWork.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;

    using Models;

    using ModelView;

    using Newtonsoft.Json;

    using RestSharp;

    using Utils;

    public class ProjectController : Controller
    {
        public ActionResult Index()
        {
            var client = new RestClient(Constant.ListAllProjectAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Uid", Session["idUser"]);

            var projectViewModel = Mapping.Map<List<Project>, List<ProjectViewModel>>(JsonConvert.DeserializeObject<Response<List<Project>>>(client.Execute(request).Content).Data);

            return View(projectViewModel);
        }

        public ActionResult New()
        {
            var client = new RestClient(Constant.GetAllUserResponsableAsync);
            var request = new RestRequest(Method.GET);
            var response = JsonConvert.DeserializeObject<Response<List<UserResponsable>>>(client.Execute(request).Content).Data;
            var userResponsableViewModel = new UserResponsableViewModel
            {
                UserResponsables = response
            };

            return View(userResponsableViewModel);
        }

        public ActionResult Detail()
        {
            var projectViewModel = TempData["project"];

            return View(projectViewModel);
        }

        [HttpPost]
        public ActionResult CreateSprint(SprintViewModel sprint) 
        {
            //var idProject = 
            var client = new RestClient(Constant.CreateSprintAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Name", sprint.Name)
                .AddParameter("IdProject", Session["idProject"]);
            client.Execute(request);

            return RedirectToAction("ProjectDetail", new { id = Session["idProject"] });
        }

        [HttpPost]
        public ActionResult SaveProject(ProjectViewModel model)
        {
            model.IdUserCreated = Session["idUser"].ToString();
            var project = Mapping.Map<ProjectViewModel, Project>(model);

            // var userStories = Mapping.Map<List<UserStoriesViewModel>, List<UserStories>>(model.UserStoriesViewModel);
            var userStories = new List<UserStories>();

            foreach (var storiesViewModel in model.UserStoriesViewModel)
            {
               var userStorie = new UserStories
                {
                    Uid = storiesViewModel.Uid,
                    Name = storiesViewModel.Name,
                    IdProject = storiesViewModel.IdProject,
                    Description = storiesViewModel.Description,
                    IdUserResponsable = storiesViewModel.IdUserResponsable,
                    UserResponsable = storiesViewModel.UserResponsable,
                    Effort = storiesViewModel.Effort,
                    Priority = storiesViewModel.Priority,
                    AcceptanceCriteria = storiesViewModel.AcceptanceCriteria,
                    IdSprint = storiesViewModel.IdSprint,
                    State = storiesViewModel.State,
                }; 

                userStories.Add(userStorie);
            }

            project.UserStories = userStories;

            var client = new RestClient(Constant.CreateProjectAsync);
            var request = new RestRequest(Method.POST)
            {
                RequestFormat = DataFormat.Json
            };

            request.AddBody(project);

            var success = JsonConvert.DeserializeObject<Response<UserFirebase>>(client.Execute(request).Content).IsSuccess;

            if (success == false)
            {
                return null;
            }

            return RedirectToAction("Index", "Project");
        }

        [HttpPost]
        public ActionResult SaveUserStory(UserStoriesViewModel model)
        {
            var client = new RestClient(Constant.CreateUserHistoryAsync);
            var request = new RestRequest(Method.POST)
            {
                RequestFormat = DataFormat.Json
            };

            var userStories = Mapping.Map<UserStoriesViewModel, UserStories>(model);
            userStories.IdProject = Session["idProject"].ToString();
            request.AddBody(userStories);
            client.Execute(request);
            
            return RedirectToAction("ProjectDetail", new { id = Session["idProject"] });
        }

        public ActionResult ProjectDetail(string id) 
        {
            Session["idProject"] = id;

            var client = new RestClient(Constant.GetAllProjectInformationAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("ProjectId", id);

            var response = JsonConvert.DeserializeObject<Response<Project>>(client.Execute(request).Content).Data;

            var projectViewModel = Mapping.Map<Project, ProjectViewModel>(response);
            var userStoriesViewModel = Mapping.Map<List<UserStories>, List<UserStoriesViewModel>>(response.UserStories);
            var sprintViewModel = Mapping.Map<List<Sprint>, List<SprintViewModel>>(response.Sprints);

            projectViewModel.UserStoriesViewModel = userStoriesViewModel;
            projectViewModel.SprintViewModel = sprintViewModel;

            TempData["project"] = projectViewModel;

            return View("~/Views/Project/Detail.cshtml", model:TempData["project"]);
        }

        public ActionResult ReturnProjectDetail() 
        {
            var client = new RestClient(Constant.GetAllProjectInformationAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("ProjectId", Session["idProject"]);

            var response = JsonConvert.DeserializeObject<Response<Project>>(client.Execute(request).Content).Data;

            var projectViewModel = Mapping.Map<Project, ProjectViewModel>(response);
            var userStoriesViewModel = Mapping.Map<List<UserStories>, List<UserStoriesViewModel>>(response.UserStories);
            var sprintViewModel = Mapping.Map<List<Sprint>, List<SprintViewModel>>(response.Sprints);

            projectViewModel.UserStoriesViewModel = userStoriesViewModel;
            projectViewModel.SprintViewModel = sprintViewModel;

            TempData["project"] = projectViewModel;

            return View("Detail", TempData["project"]);
        }

        [HttpGet]
        public ActionResult GetUserResponsable() 
        {
            var client = new RestClient(Constant.GetAllUserResponsableAsync);
            var request = new RestRequest(Method.GET);
            var response = JsonConvert.DeserializeObject<Response<List<UserResponsable>>>(client.Execute(request).Content).Data;
            var result = JsonConvert.SerializeObject(response);

            return Content(result, "application/json");
        }

        [HttpGet]
        public ActionResult GetUserResponsableSelected() 
        {
            var client = new RestClient(Constant.GetAllUserResponsableAsync);
            var request = new RestRequest(Method.GET);
            var result = client.Execute(request).Content;

            return Content(result, "application/json");
        }

        public ActionResult AttachToSprint() 
        {
            var idProject = Session["idProject"];

            // Get all sprints
            var clientSprint = new RestClient(Constant.GetAllSprintAsync);
            var requestSprint = new RestRequest(Method.POST)
                .AddParameter("ProjectId", idProject);

            var sprintResponse = JsonConvert.DeserializeObject<Response<List<Sprint>>>(clientSprint.Execute(requestSprint).Content).Data;

            // Get all user stories
            var clientUserStory = new RestClient(Constant.GetAllUserHistoryAsync);
            var requestUserStory = new RestRequest(Method.POST)
                .AddParameter("ProjectId", idProject);

            var userStoryResponse = JsonConvert.DeserializeObject<Response<List<UserStories>>>(clientUserStory.Execute(requestUserStory).Content).Data;

            var attachToSprintViewModel = new AttachSprintViewModel {
                IdProject = idProject.ToString(),
                ListSprintViewModel = Mapping.Map<List<Sprint>, List<SprintViewModel>>(sprintResponse),
                ListUserStoriesViewModel = Mapping.Map<List<UserStories>, List<UserStoriesViewModel>>(userStoryResponse)
            };

            return View(attachToSprintViewModel);
        }

        [HttpPost]
        public ActionResult GetSprintAndUserStorie() {
            var idProject = Session["idProject"];

            // Get all sprints
            var clientSprint = new RestClient(Constant.GetHistoriesAndSprintProjectAsync);
            var requestSprint = new RestRequest(Method.POST)
                .AddParameter("ProjectId", idProject);

            var result = clientSprint.Execute(requestSprint).Content;
            
            return Content(result, "application/json");
        }

        [HttpPost]
        public ActionResult ShowUserStoryDetail(string idUserStory)
        {
            var clientUserStory = new RestClient(Constant.GetUserStorieAsync);
            var requestUserStory = new RestRequest(Method.POST)
                .AddParameter("IdUserStorie", idUserStory);

            var response = JsonConvert.DeserializeObject<Response<UserStories>>(clientUserStory.Execute(requestUserStory).Content).Data;
            var result = JsonConvert.SerializeObject(response);

            return Content(result, "application/json");
        }

        [HttpPost]
        public ActionResult SetUserStorieToSprint(SetUserStorieToSprintViewModel model) {
            var client = new RestClient(Constant.SetUserStoriesToSprintAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("IdUserStory", model.IdUserStory)
                .AddParameter("IdSprint", model.IdSprint);
            var response = client.Execute(request).Content;

            return Content(response, "application/json");
        }
    }
}