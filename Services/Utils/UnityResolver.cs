namespace Services.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Http.Dependencies;

    using Unity;
    using Unity.Exceptions;

    [SuppressMessage("StyleCop.CSharp.DocumentationRules", "SA1600:ElementsMustBeDocumented", Justification = "Reviewed. Suppression is OK here.")]
    public class UnityResolver : IDependencyResolver
    {
        private readonly IUnityContainer container;

        public UnityResolver(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException(nameof(container));
            }

            this.container = container;
        }
        
        [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1123:DoNotPlaceRegionsWithinElements", Justification = "Reviewed. Suppression is OK here.")]
        public static IUnityContainer InitializeContainer()
        {
            var container = new UnityContainer();

            #region Dependency Injections Here
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