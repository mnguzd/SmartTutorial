﻿using SmartTutorial.API.Dtos.SubjectDtos;

namespace SmartTutorial.API.Dtos.TopicDtos
{
    public class TopicDto
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public string Content { get; set; }
        public int Order { get; set; }
        public SubjectDto Subject { get; set; }
    }
}
