using SmartTutorial.API.Dtos.QuestionDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.TopicDtos
{
    public class TopicWithQuestionsDto
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public string Content { get; set; }
        public int Order { get; set; }
        public SubjectDto Subject { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }
}
