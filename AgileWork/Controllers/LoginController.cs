namespace AgileWork.Controllers
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;

    using Models;

    using ModelView;

    using Newtonsoft.Json;

    using RestSharp;

    using Utils;

    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login(UserFirebaseViewModel model)
        {
            var client = new RestClient(Constant.GetFirebaseLoginAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Email", model.Email)
                .AddParameter("Password", model.Password);
            
            var userViewModel = Mapping.Map<UserFirebase, UserFirebaseViewModel>(JsonConvert.DeserializeObject<Response<UserFirebase>>(client.Execute(request).Content).Data);

            Session["idUser"] = userViewModel.Uid;

            return RedirectToAction("Index", "Project");
        }
    }
}