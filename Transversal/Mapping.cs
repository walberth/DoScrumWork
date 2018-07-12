using Compartamos.CentralRiesgos.Application.DTO;
using Compartamos.CentralRiesgos.Domain.Entities;

namespace Compartamos.CentralRiesgos.Transversal.Mapper
{
    public static class Mapping
    {
        public static void Inicializate()
        {
            AutoMapper.Mapper.Initialize(x => x.CreateMap<Suppliers, SuppliersDto>().ReverseMap());
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