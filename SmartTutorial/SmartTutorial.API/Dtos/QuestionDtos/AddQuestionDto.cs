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
        [MinLength(1)]
        public string Answer { get; set; }

        [Required]
        public int TopicId { get; set; }

        [MaxLength(150)]
        [MinLength(1)]
        [Required]
        public string Option1 { get; set; }

        [MaxLength(150)]
        [MinLength(1)]
        [Required]
        public string Option2 { get; set; }

        [MaxLength(150)]
        [MinLength(1)]
        [Required]
        public string Option3 { get; set; }

        [MaxLength(150)]
        [MinLength(1)]
        [Required]
        public string Option4 { get; set; }
    }
}
