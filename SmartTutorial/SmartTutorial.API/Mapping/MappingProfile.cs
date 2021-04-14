using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Subject, SubjectDto>();
            CreateMap<SubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();
        }
    }
}
