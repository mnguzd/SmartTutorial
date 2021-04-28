using System;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class PatchSubjectDto
    {
        [StringLength(20)]
        public string Name { get; set; }
        [Range(1, 5)]
        public int? Complexity { get; set; }
    }
}
