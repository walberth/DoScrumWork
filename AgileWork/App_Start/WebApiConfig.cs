using System.Web.Http;
using AgileWork.Utils;

namespace AgileWork
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Initialize Unity Ioc
            config.DependencyResolver = new UnityResolver(UnityResolver.InitializeContainer());

            Mapping.Inicializate();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
