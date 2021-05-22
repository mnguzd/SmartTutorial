using SmartTutorial.API.Dtos.AnswerDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class QuestionWithAnswersDto
    {
        public string Text { get; set; }
        public string Answer { get; set; }
        public int Id { get; set; }
        public bool AlreadyAnswered { get; set; }

        public List<AnswerDto> Answers { get; set; }
    }
}
