using SmartTutorial.API.Dtos.QuestionDtos;

namespace SmartTutorial.API.Dtos.AnswerDtos
{
    public class AnswerDto
    {
        public string Text { get; set; }
        public bool IsTrue { get; set; }

        public QuestionDto Question { get; set; }
    }
}
