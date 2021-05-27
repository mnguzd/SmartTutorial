using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.QuestionDtos
{
    public class AnswerTheQuestionDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        [MinLength(1)]
        public string UserAnswer { get; set; }
    }
}
