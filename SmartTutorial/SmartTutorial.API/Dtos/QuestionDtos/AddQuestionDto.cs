using SmartTutorial.API.Dtos.AnswerDtos;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class AddQuestionWithAnswersDto
    {
        [Required]
        [MaxLength(150)]
        [MinLength(5)]
        public string Text { get; set; }

        [Required]
        [MaxLength(150)]
        [MinLength(5)]
        public string Answer { get; set; }

        [Required]
        public int TopicId { get; set; }

        [Required]
        public List<AnswerDto> Answers { get; set; }
    }
}
