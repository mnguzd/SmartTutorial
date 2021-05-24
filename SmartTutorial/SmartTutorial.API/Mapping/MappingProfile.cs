using AutoMapper;
using SmartTutorial.API.Dtos.AnswerDtos;
using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Dtos.CourseDtod;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.Domain;
using SmartTutorial.Domain.Auth;

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
            CreateMap<Topic, TopicWithNoContentDto>();
            CreateMap<QuestionDto, Question>();
            CreateMap<Question, QuestionDto>();
            CreateMap<QuestionWithAnswersDto, Question>();
            CreateMap<Question, QuestionWithAnswersDto>();
            CreateMap<Question, QuestionTableDto>();
            CreateMap<Answer, AddAnswerDto>();
            CreateMap<Answer, AnswerDto>();
            CreateMap<User, UserTableDto>();
        }
    }
}
