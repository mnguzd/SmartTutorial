using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.OptionDtos
{
    public class AddOptionDto
    {
        [Required]
        [MaxLength(150)]
        [MinLength(1)]
        public string Text { get; set; }
    }
}
