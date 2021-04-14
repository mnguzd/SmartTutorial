using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class AddSubjectDto
    {
        [Required]
        [StringLength(20)]
        public string Name { get; set; }
        [Required]
        [Range(1,5)]
        public int Complexity { get; set; }
    }
}
