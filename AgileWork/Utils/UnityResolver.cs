﻿using System;
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
        private readonly IUnityContainer _container;

        public UnityResolver(IUnityContainer container)
        {
            _container = container ?? throw new ArgumentNullException(nameof(container));
        }
        
        [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1123:DoNotPlaceRegionsWithinElements", Justification = "Reviewed. Suppression is OK here.")]
        public static IUnityContainer InitializeContainer()
        {
            var container = new UnityContainer();

            #region Dependency Injections Here
            container.RegisterType<ILoginFirebase, LoginFirebase>();
            container.RegisterType<IAgileProject, AgileProject>();
            container.RegisterType<IUserProject, UserProject>();
            container.RegisterType<IUserStory, UserStory>();
            container.RegisterType<ITaskProject, TaskProject>();
            #endregion

            return container;
        }

        public void Dispose()
        {
            _container?.Dispose();
        }

        public object GetService(Type serviceType)
        {
            try
            {
                return _container.Resolve(serviceType);
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
                return _container.ResolveAll(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return new List<object>();
            }
        }

        public IDependencyScope BeginScope()
        {
            var child = _container?.CreateChildContainer();
            return new UnityResolver(child);
        }
    }
}