using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Dtos.ThemeDtos;
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
            CreateMap<AddSubjectDto, Subject>();
            CreateMap<ThemeDto, Theme>();
            CreateMap<Theme, ThemeDto>();

        }
    }
}
