namespace AgileWork.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;

    using AgileWork.Models;

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

        [HttpPost]
        public ActionResult Index(UserFirebaseViewModel userFirebaseViewModel)
        {


            return View();
        }
    }
}