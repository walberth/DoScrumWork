using System;

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

        public ActionResult NewProject() {
            var client = new RestClient(Constant.GetAllUserResponsableAsync);
            var request = new RestRequest(Method.GET);
            var response = JsonConvert.DeserializeObject<Response<List<UserResponsable>>>(client.Execute(request).Content).Data;
            //var userResponsableViewModel = Mapping.Map<List<UserResponsable>, UserResponsableViewModel>(response);
            var userResponsableViewModel = new UserResponsableViewModel();

            foreach (var userResponsable in response) {
                userResponsableViewModel.UserResponsables.Add(userResponsable);
            }
            

            return View(response);
        }

        [HttpPost]
        public ActionResult SaveProject(ProjectViewModel model) {
            return null;
        }

        [HttpPost]
        public ActionResult ProjectDetail(string id) 
        {
            return null;
        }
    }
}