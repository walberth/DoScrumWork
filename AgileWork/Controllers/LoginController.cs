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
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [SuppressMessage("StyleCop.CSharp.LayoutRules", "SA1500:CurlyBracketsForMultiLineStatementsMustNotShareLine", Justification = "Reviewed. Suppression is OK here.")]
        public ActionResult Login(UserFirebaseViewModel model, string returnUrl)
        {
            var client = new RestClient(Constant.GetFirebaseLoginAsync);
            var request = new RestRequest(Method.POST)
                .AddParameter("Email", model.Email)
                .AddParameter("Password", model.Password);
            
            var userViewModel = Mapping.Map<UserFirebase, UserFirebaseViewModel>(JsonConvert.DeserializeObject<Response<UserFirebase>>(client.Execute(request).Content).Data);

            Session["idUser"] = userViewModel.Uid;

            // client.ExecuteAsync<Response<UserFirebase>>(request, response => 
            // {
            //    userViewModel = Mapping.Map<UserFirebase, UserFirebaseViewModel>(JsonConvert.DeserializeObject<Response<UserFirebase>>(response.Content).Data);
            // });

            return RedirectToAction("Index", "Project");
        }
    }
}