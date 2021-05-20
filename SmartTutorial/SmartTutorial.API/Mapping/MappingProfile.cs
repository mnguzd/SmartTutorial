using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Dtos.TopicDtos;
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
            CreateMap<CourseDto, Course>();
            CreateMap<Course, CourseDto>();
            CreateMap<CourseWithSubjectsDto, Course>();
            CreateMap<Topic, TopicDto>();
            CreateMap<TopicDto, Topic>();
            CreateMap<Course, CourseWithSubjectsDto>();
            CreateMap<Subject, SubjectWithTopicsDto>();
            CreateMap<Topic, TopicDto>();
            CreateMap<TopicDto, Topic>();
            CreateMap<Topic, TopicWithQuestionsDto>();
            CreateMap<TopicWithQuestionsDto, Topic>();
        }
    }
}
