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
        // GET: Project
        public ActionResult Index()
        {
            var client = new RestClient(Constant.ListAllProjectAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Uid", Session["idUser"]);

            var projectViewModel = Mapping.Map<List<Project>, List<ProjectViewModel>>(JsonConvert.DeserializeObject<Response<List<Project>>>(client.Execute(request).Content).Data);

            return View(projectViewModel);
        }

        public ActionResult NewProject()
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

        [HttpPost]
        public ActionResult SaveProject(ProjectViewModel model)
        {
            model.IdUserCreated = Session["idUser"].ToString();
            var project = Mapping.Map<ProjectViewModel, Project>(model);
            var userStories = Mapping.Map<List<UserStoriesViewModel>, List<UserStories>>(model.UserStoriesViewModel);

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
        public ActionResult ProjectDetail(string id) 
        {
            var client = new RestClient(Constant.GetAllProjectInformationAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("ProjectId", id);

            var response = JsonConvert.DeserializeObject<Response<Project>>(client.Execute(request).Content).Data;

            var projectViewModel = Mapping.Map<Project, ProjectViewModel>(response);
            var userStoriesViewModel = Mapping.Map<List<UserStories>, List<UserStoriesViewModel>>(response.UserStories);

            projectViewModel.UserStoriesViewModel = userStoriesViewModel;

            return RedirectToAction("ShowDetail", "Project", projectViewModel);
        }

        public ActionResult ShowDetail(ProjectViewModel model)
        {
            return null;
        }
    }
}