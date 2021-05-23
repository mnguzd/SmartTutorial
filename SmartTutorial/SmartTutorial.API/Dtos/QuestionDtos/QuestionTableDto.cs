using SmartTutorial.API.Dtos.AnswerDtos;
using System.Collections.Generic;
using SmartTutorial.API.Dtos.TopicDtos;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class QuestionTableDto
    {
        public string Text { get; set; }
        public string Answer { get; set; }
        public int Id { get; set; }
        public TopicWithNoContentDto Topic { get; set; }

        public List<AnswerDto> Answers { get; set; }
    }
}
