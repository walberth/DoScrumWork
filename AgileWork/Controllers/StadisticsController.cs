using System.Web.Mvc;
using AgileWork.Utils;
using RestSharp;

namespace AgileWork.Controllers
{
    public class StadisticsController : Controller
    {
        // GET: Stadistics
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetAllData() 
        {
            var client = new RestClient(Constant.GetAllProjectsAsync);
            var request = new RestRequest(Method.GET);
            var result = client.Execute(request).Content;

            return Content(result, "application/json");
        }
    }
}