using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class UpdateSubjectDto
    {
        [StringLength(20)]
        [Required]
        public string Name { get; set; }
        [Range(1,5)]
        [Required]
        public int Complexity { get; set; }
    }
}
