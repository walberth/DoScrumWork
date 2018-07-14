using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http.Dependencies;
using AgileWork.Implementation;
using AgileWork.Interface;
using Unity;
using Unity.Exceptions;

namespace AgileWork.Utils
{
    [SuppressMessage("StyleCop.CSharp.DocumentationRules", "SA1600:ElementsMustBeDocumented", Justification = "Reviewed. Suppression is OK here.")]
    public class UnityResolver : IDependencyResolver
    {
        private readonly IUnityContainer container;

        public UnityResolver(IUnityContainer container)
        {
            this.container = container ?? throw new ArgumentNullException(nameof(container));
        }
        
        [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1123:DoNotPlaceRegionsWithinElements", Justification = "Reviewed. Suppression is OK here.")]
        public static IUnityContainer InitializeContainer()
        {
            var container = new UnityContainer();

            #region Dependency Injections Here
            container.RegisterType<ILoginFirebase, LoginFirebase>();
            container.RegisterType<IAgileProject, AgileProject>();
            #endregion

            return container;
        }

        public void Dispose()
        {
            container?.Dispose();
        }

        public object GetService(Type serviceType)
        {
            try
            {
                return this.container.Resolve(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            try
            {
                return this.container.ResolveAll(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return new List<object>();
            }
        }

        public IDependencyScope BeginScope()
        {
            var child = container?.CreateChildContainer();
            return new UnityResolver(child);
        }
    }
}