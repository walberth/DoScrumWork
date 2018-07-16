using System.Web.Http;
using AgileWork.Utils;
using Newtonsoft.Json.Serialization;

namespace AgileWork
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Initialize Unity Ioc
            config.DependencyResolver = new UnityResolver(UnityResolver.InitializeContainer());

            Mapping.Inicializate();

            // Use camel case for JSON data.
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultWebApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional, action = RouteParameter.Optional }
            );
        }
    }
}
