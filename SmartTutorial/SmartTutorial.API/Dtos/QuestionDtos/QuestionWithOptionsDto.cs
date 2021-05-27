using SmartTutorial.API.Dtos.OptionDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class QuestionWithOptionsDto
    {
        public string Text { get; set; }
        public int Id { get; set; }
        public bool AlreadyAnswered { get; set; }

        public List<OptionDto> Options { get; set; }
    }
}
