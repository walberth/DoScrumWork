using System.Diagnostics.CodeAnalysis;

namespace AgileWork.Utils
{
    [SuppressMessage("StyleCop.CSharp.DocumentationRules", "SA1600:ElementsMustBeDocumented", Justification = "Reviewed. Suppression is OK here.")]
    public class Mapping
    {
        public static void Inicializate()
        {
            // AutoMapper.Mapper.Initialize(x => x.CreateMap<Suppliers, SuppliersDto>().ReverseMap());
        }

        public static TDestino Map<TSource, TDestino>(TSource source, TDestino destino)
        {
            return AutoMapper.Mapper.Map(source, destino);
        }

        public static TDestino Map<TSource, TDestino>(TSource source)
        {
            return AutoMapper.Mapper.Map<TSource, TDestino>(source);
        }
    }
}