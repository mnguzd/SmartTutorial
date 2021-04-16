using SmartTutorial.API.Dtos.SubjectDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.ThemeDtos
{
    public class ThemeWithSubjectsDto
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string Description { get; set; }
        public List<SubjectDto> Subjects { get; set; }
    }
}
