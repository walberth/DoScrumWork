using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using Compartamos.CentralRiesgos.Application.Interface;
using Compartamos.CentralRiesgos.Application.Main;
using Compartamos.CentralRiesgos.Domain.Interfaces;
using Compartamos.CentralRiesgos.Domain.Main;
using Compartamos.CentralRiesgos.Infrastructure.Configuration;
using Compartamos.CentralRiesgos.Infrastructure.Interfaces.Repository;
using Compartamos.CentralRiesgos.Infrastructure.Repository.SqlRepository;
using Compartamos.CentralRiesgos.Infrastructure.Repository.UnitOfWork;
using Compartamos.CentralRiesgos.Interfaces.Configuration;
using Compartamos.CentralRiesgos.Transversal.Common;
using Unity;
using Unity.Exceptions;

namespace Compartamos.CentralRiesgos.Transversal.IoC
{
    public class UnityResolver : IDependencyResolver
    {
        protected IUnityContainer container;

        public UnityResolver(IUnityContainer container)
        {
            if (container == null)
                throw new ArgumentNullException(nameof(container));
            this.container = container;
        }

        public object GetService(Type serviceType)
        {
            try
            {
                return container.Resolve(serviceType);
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
                return container.ResolveAll(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return new List<object>();
            }
        }

        public IDependencyScope BeginScope()
        {
            var child = container.CreateChildContainer();
            return new UnityResolver(child);
        }

        public void Dispose()
        {
            container.Dispose();
        }

        public static IUnityContainer InitializeContainer()
        {
            var container = new UnityContainer();
            container.RegisterType<IUnitOfWork, UnitOfWork>();
            container.RegisterType<ISuppliersApplication, SuppliersApplication>();
            container.RegisterType<ISuppliersDomain, SuppliersDomain>();
            container.RegisterType<IConnectionFactory, ConnectionFactory>();
            container.RegisterType<ISuppliersRepository, SuppliersRepository>();
            return container;
        }
    }
}