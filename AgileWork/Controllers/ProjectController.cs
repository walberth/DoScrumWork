namespace AgileWork.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;

    using Models;

    using ModelView;

    using Newtonsoft.Json;

    using RestSharp;

    using Utils;

    //[RoutePrefix("project")]
    public class ProjectController : Controller
    {
        // GET: Project
        //[Route("index")]
        public ActionResult Index()
        {
            var client = new RestClient(Constant.ListAllProjectAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Uid", Session["idUser"]);

            var projectViewModel = Mapping.Map<List<Project>, List<ProjectViewModel>>(JsonConvert.DeserializeObject<Response<List<Project>>>(client.Execute(request).Content).Data);

            return View(projectViewModel);
        }

        //[Route("new")]
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

        //[Route("detail")]
        public ActionResult Detail()
        {
            var projectViewModel = TempData["project"];

            return View(projectViewModel);
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
            return null;
        }

        //[HttpPost]
        public ActionResult ProjectDetail(string id) 
        {
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

            ModelState.Clear();
            return View("Detail", TempData["project"]);
        }
    }
}