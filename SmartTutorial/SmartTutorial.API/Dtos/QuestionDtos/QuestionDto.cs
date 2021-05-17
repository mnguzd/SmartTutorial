using SmartTutorial.API.Dtos.TopicDtos;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class QuestionDto
    {
        public string Text { get; set; }
        public string Answer { get; set; }

        public TopicDto Topic { get; set; }
    }
}
