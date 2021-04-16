using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class UpdateSubjectDto
    {
        [StringLength(20)]
        public string Name { get; set; }
        [Range(1,5)]
        public int Complexity { get; set; }
    }
}
