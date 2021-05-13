﻿using System.Collections.Generic;
using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Infrastucture;
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
            CreateMap<ThemeWithSubjectsDto, Theme>();
            CreateMap<Topic, TopicDto>();
            CreateMap<TopicDto, Topic>();
            CreateMap<Theme, ThemeWithSubjectsDto>();
            CreateMap<Subject, SubjectWithTopicsDto>();
            CreateMap<PagedList<Subject>, PagedList<SubjectDto>>();
        }
    }
}
